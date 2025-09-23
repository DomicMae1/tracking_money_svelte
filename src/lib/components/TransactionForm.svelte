<script lang="ts">
	// @ts-nocheck
	import { BanknoteArrowUp, BanknoteArrowDown, Trash, Copy } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { getLocalTimeZone, DateFormatter, type DateValue } from '@internationalized/date';

	const dispatch = createEventDispatcher();
	const df = new DateFormatter('id-ID', { dateStyle: 'long' });

	const formatter = new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0
	});

	function formatRupiah(value: number | null) {
		if (!value || isNaN(value)) return '';
		return formatter.format(value);
	}

	const createNewTransaction = (isFirst = false) => ({
		id: Date.now() + Math.random(),
		description: '',
		amount: null,
		formattedAmount: '',
		date: null as DateValue | null,
		type: 'expense',
		expanded: isFirst
	});

	let transaksiList = [createNewTransaction(true)];

	function handleAmountInput(e: Event, index: number) {
		const target = e.target as HTMLInputElement;
		let raw = target.value.replace(/[^\d]/g, '');
		if (!raw) {
			transaksiList[index].amount = null;
			transaksiList[index].formattedAmount = '';
		} else {
			transaksiList[index].amount = parseInt(raw, 10);
			transaksiList[index].formattedAmount = formatRupiah(transaksiList[index].amount);
		}
		transaksiList = [...transaksiList];
	}

	function tambahForm() {
		transaksiList = [...transaksiList, createNewTransaction(false)];
	}

	function hapusForm(index: number) {
		if (transaksiList.length > 1) {
			transaksiList = transaksiList.filter((_, i) => i !== index);
		}
	}

	function duplikatForm(index: number) {
		const duplicated = { ...transaksiList[index], expanded: false };
		transaksiList = [
			...transaksiList.slice(0, index + 1),
			duplicated,
			...transaksiList.slice(index + 1)
		];
	}

	function formatDateLocal(d: DateValue) {
		if (!d) return '';
		const jsDate = d.toDate(getLocalTimeZone());
		const year = jsDate.getFullYear();
		const month = String(jsDate.getMonth() + 1).padStart(2, '0');
		const day = String(jsDate.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	async function handleSubmitAll() {
		const validTransactions = [];

		for (const trx of transaksiList) {
			if (!trx.description.trim() || !trx.amount || !trx.date) {
				alert('Mohon isi semua kolom pada semua transaksi sebelum mengirim!');
				return;
			}

			const newTransactionData = {
				description: trx.description,
				amount: +trx.amount,
				date: formatDateLocal(trx.date),
				type: trx.type
			};

			console.log('Submit data:', newTransactionData);
			dispatch('addTransaction', newTransactionData);
			validTransactions.push(newTransactionData);
		}

		if (validTransactions.length > 0) {
			transaksiList = [createNewTransaction(true)];
			alert('Data berhasil dikirim ke parent ✅');
		}
	}
</script>

<form class="transaction-form" on:submit|preventDefault={handleSubmitAll}>
	{#each transaksiList as transaksi, index}
		<div class="single-transaction">
			<div
				class="accordion-header flex cursor-pointer items-center justify-between"
				on:click={() => (transaksi.expanded = !transaksi.expanded)}
			>
				<span class="font-bold">
					Transaksi {index + 1}: {transaksi.description || '(Belum diisi)'}
				</span>
				<span class="text-xl">{transaksi.expanded ? '▾' : '▸'}</span>
			</div>

			{#if transaksi.expanded}
				<div class="accordion-content mt-4">
					<div class="type-selector flex flex-col gap-2 sm:flex-row">
						<label class:selected={transaksi.type === 'expense'} class="option flex-1">
							<div class="option-content">
								<BanknoteArrowDown class="icon expense-icon" />
								<span>Pengeluaran</span>
							</div>
							<input type="radio" bind:group={transaksi.type} value="expense" />
						</label>
						<label class:selected={transaksi.type === 'income'} class="option flex-1">
							<div class="option-content">
								<BanknoteArrowUp class="icon income-icon" />
								<span>Pemasukan</span>
							</div>
							<input type="radio" bind:group={transaksi.type} value="income" />
						</label>
					</div>

					<div class="form-control mt-2">
						<label>Deskripsi</label>
						<textarea
							class="description"
							placeholder="Contoh: Gaji, Beli Kopi"
							bind:value={transaksi.description}
						></textarea>
					</div>

					<div class="form-row mt-2 flex flex-col gap-2 sm:flex-row">
						<div class="form-control amount-control flex-1">
							<label>Jumlah (Rp)</label>
							<input
								class="amount"
								type="text"
								placeholder="Contoh: Rp50.000"
								value={transaksi.formattedAmount}
								on:input={(e) => handleAmountInput(e, index)}
							/>
						</div>

						<div class="form-control date-control flex-1">
							<label>Tanggal</label>
							<Popover.Root>
								<Popover.Trigger>
									<Button variant="outline" class="w-full justify-start text-left font-normal">
										<CalendarIcon class="mr-2 h-4 w-4" />
										{transaksi.date
											? df.format(transaksi.date.toDate(getLocalTimeZone()))
											: 'Pilih tanggal'}
										<ChevronDownIcon class="ml-auto h-4 w-4 text-muted-foreground" />
									</Button>
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0">
									<Calendar bind:value={transaksi.date} />
								</Popover.Content>
							</Popover.Root>
						</div>
					</div>

					<div class="action-row mt-2 grid grid-cols-1 gap-2 pt-8 sm:grid-cols-2">
						<button
							type="button"
							on:click={() => hapusForm(index)}
							class="flex w-full items-center justify-center gap-2 rounded bg-red-500 py-2 text-white"
						>
							<Trash class="h-5 w-5" /> Hapus
						</button>
						<button
							type="button"
							on:click={() => duplikatForm(index)}
							class="flex w-full items-center justify-center gap-2 rounded bg-blue-500 py-2 text-white"
						>
							<Copy class="h-5 w-5" /> Duplikat
						</button>
					</div>
				</div>
			{/if}
		</div>
	{/each}

	<div class="mt-8">
		<button type="button" on:click={tambahForm} class="w-full rounded bg-green-500 py-2 text-white">
			Tambah Form Baru
		</button>
	</div>

	<button type="submit" class=" w-full rounded bg-blue-600 py-2 font-bold text-white">
		Submit Semua Transaksi
	</button>
</form>

<style>
	.transaction-form {
		--primary-color: #0d6efd;
		--border-color: #dee2e6;
		--text-color: #333;
		--background-color: #ffff;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.5rem;
		border-radius: 12px;
		background-color: var(--background-color);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		margin: 2rem auto;
	}

	.type-selector {
		gap: 1rem;
		width: 100%;
	}
	.option {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
	}
	.option.selected {
		background-color: var(--primary-color);
		color: white;
		border-color: var(--primary-color);
		font-weight: bold;
	}
	.option-content {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}
	.icon {
		width: 18px;
		height: 18px;
	}
	.expense-icon {
		color: #dc3545;
	}
	.income-icon {
		color: #198754;
	}

	.form-row {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.amount-control,
	.date-control {
		width: 100%;
	}

	.form-control {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	label {
		margin-bottom: 0.5rem;
		font-weight: bold;
		color: var(--text-color);
	}
	.description {
		background-color: white;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 8px;
	}

	.amount {
		background-color: white;
		padding-left: 0.5rem;
		padding-top: 0.3rem;
		padding-bottom: 0.3rem;
		border: 1px solid #ccc;
		border-radius: 8px;
	}

	.accordion-header {
		padding: 0.5rem;
		background-color: #e9ecef;
		border-radius: 6px;
		cursor: pointer;
	}
	.accordion-header:hover {
		background-color: #dee2e6;
	}

	.action-row {
		display: grid;
		gap: 0.5rem;
	}

	@media (min-width: 640px) {
		.form-row {
			flex-direction: row;
			gap: 1rem;
		}
		.action-row {
			grid-template-columns: repeat(2, 1fr);
		}
		.type-selector {
			flex-direction: row;
		}
	}
</style>
