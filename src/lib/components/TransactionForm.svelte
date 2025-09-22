<script lang="ts">
	// @ts-nocheck

	import { createEventDispatcher } from 'svelte';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { tick } from 'svelte';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { getLocalTimeZone, today, DateFormatter, type DateValue } from '@internationalized/date';
	const dispatch = createEventDispatcher();

	let description = '';
	let amount = null;
	let formattedAmount = '';
	let date: DateValue | null = null;
	const df = new DateFormatter('id-ID', { dateStyle: 'long' });
	let type = 'expense';

	function toggle() {
		open = !open;
	}

	const createNewTransaction = () => ({
		id: Date.now() + Math.random(), // ID unik untuk Svelte #each block
		description: '',
		amount: null,
		date: null,
		type: 'expense'
	});

	// Inisialisasi state dengan satu form transaksi
	let transactions = [createNewTransaction()];

	// Formatter IDR
	const formatter = new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0
	});

	function formatRupiah(value) {
		if (!value || isNaN(value)) return '';
		return formatter.format(value);
	}

	let transaksiList = [
		{
			description: '',
			amount: null,
			formattedAmount: '',
			date: null as DateValue | null,
			type: 'expense'
		}
	];

	function handleAmountInput(e, index) {
		let raw = e.target.value.replace(/[^\d]/g, '');
		if (!raw) {
			transaksiList[index].amount = null;
			transaksiList[index].formattedAmount = '';
		} else {
			transaksiList[index].amount = parseInt(raw, 10);
			transaksiList[index].formattedAmount = formatRupiah(transaksiList[index].amount);
		}
		// trigger re-render
		transaksiList = [...transaksiList];
	}

	// --- FUNGSI BARU: Logika untuk menambah, menghapus, duplikat ---
	const handleTambahTransaksi = () => {
		transactions = [...transactions, createNewTransaction()];
	};

	const handleHapusTransaksi = (index: number) => {
		if (transactions.length > 1) {
			transactions = transactions.filter((_, i) => i !== index);
		} else {
			alert('Minimal harus ada satu transaksi.');
		}
	};

	const handleDuplikatTransaksi = (index: number) => {
		const originalTransaction = transactions[index];
		const duplicatedTransaction = {
			...originalTransaction,
			id: Date.now() + Math.random() // Pastikan ID baru unik
		};

		// Menyisipkan duplikat tepat di bawah aslinya
		const newTransactions = [
			...transactions.slice(0, index + 1),
			duplicatedTransaction,
			...transactions.slice(index + 1)
		];
		transactions = newTransactions;
	};

	// --- Logika Submit untuk semua form ---
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

			// Ganti fetch -> console.log + dispatch
			console.log('Submit data:', newTransactionData);
			dispatch('addTransaction', newTransactionData);

			validTransactions.push(newTransactionData);
		}

		if (validTransactions.length > 0) {
			// Reset form setelah sukses
			transaksiList = [
				{
					description: '',
					amount: null,
					formattedAmount: '',
					date: null,
					type: 'expense'
				}
			];
			alert('Data berhasil dikirim ke parent ✅');
		}
	}

	function handleDateSelect(selectedDate: DateValue, index: number) {
		transaksiList[index].date = selectedDate;
	}

	function formatDateLocal(d: DateValue) {
		if (!d) return '';
		const jsDate = d.toDate(getLocalTimeZone());
		const year = jsDate.getFullYear();
		const month = String(jsDate.getMonth() + 1).padStart(2, '0');
		const day = String(jsDate.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	function handleSubmit() {
		if (!description.trim() || !amount || !date) {
			alert('Mohon isi semua kolom!');
			return;
		}

		const formattedDate = formatDateLocal(date);

		const newTransactionData = {
			description,
			amount: +amount,
			date: formattedDate,
			type
		};

		console.log('Submit data:', newTransactionData);
		dispatch('addTransaction', newTransactionData);

		// Reset form
		description = '';
		amount = null;
		formattedAmount = '';
		date = null;
	}

	function tambahForm() {
		transaksiList = [
			...transaksiList,
			{ description: '', amount: null, formattedAmount: '', date: null, type: 'expense' }
		];
	}

	function hapusForm(index: number) {
		if (transaksiList.length > 1) {
			transaksiList = transaksiList.filter((_, i) => i !== index);
		}
	}

	function duplikatForm(index: number) {
		transaksiList = [
			...transaksiList.slice(0, index + 1),
			{ ...transaksiList[index] }, // copy field
			...transaksiList.slice(index + 1)
		];
	}
</script>

<!-- Nama class diubah agar lebih generik -->
<form class="transaction-form" on:submit|preventDefault={handleSubmitAll}>
	{#each transaksiList as transaksi, index}
		<div class="single-transaction">
			<!-- Type -->
			<div class="type-selector">
				<label class:selected={transaksi.type === 'expense'}>
					<input type="radio" bind:group={transaksi.type} value="expense" />
					Pengeluaran
				</label>
				<label class:selected={transaksi.type === 'income'}>
					<input type="radio" bind:group={transaksi.type} value="income" />
					Pemasukan
				</label>
			</div>

			<!-- Deskripsi -->
			<div class="form-control">
				<label>Deskripsi</label>
				<textarea
					class="description"
					placeholder="Contoh: Gaji, Beli Kopi"
					bind:value={transaksi.description}
				/>
			</div>

			<div class="form-row">
				<!-- Jumlah -->
				<div class="form-control amount-control">
					<label>Jumlah (Rp)</label>
					<input
						class="bg-white"
						type="text"
						placeholder="Contoh: Rp50.000"
						value={transaksi.formattedAmount}
						on:input={(e) => handleAmountInput(e, index)}
					/>
				</div>

				<!-- Tanggal -->
				<div class="form-control date-control">
					<label>Tanggal</label>
					<Popover.Root>
						<Popover.Trigger>
							{#snippet child({ props })}
								<Button
									variant="outline"
									class="w-full justify-start text-left font-normal"
									{...props}
								>
									<CalendarIcon class="mr-2 h-4 w-4" />
									{transaksi.date
										? df.format(transaksi.date.toDate(getLocalTimeZone()))
										: 'Pilih tanggal'}
									<ChevronDownIcon class="ml-auto h-4 w-4 text-muted-foreground" />
								</Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content class="w-auto p-0">
							<Calendar bind:value={transaksi.date} />
						</Popover.Content>
					</Popover.Root>
				</div>
			</div>

			<!-- Tombol aksi per form -->
			<!-- Tombol aksi per form -->
			<div class="action-row mt-2 grid grid-cols-2 gap-2">
				<button
					type="button"
					on:click={() => hapusForm(index)}
					class="w-full rounded bg-red-500 py-2 text-white"
				>
					Hapus
				</button>
				<button
					type="button"
					on:click={() => duplikatForm(index)}
					class="w-full rounded bg-blue-500 py-2 text-white"
				>
					Duplikat
				</button>
			</div>
		</div>
	{/each}

	<div class="mt-4">
		<button type="button" on:click={tambahForm} class="w-full rounded bg-green-500 py-2 text-white">
			Tambah Form Baru
		</button>
	</div>

	<button type="submit" class="mt-4 bg-blue-600">Submit Semua Transaksi</button>
</form>

<style>
	/* Mendefinisikan variabel warna di root komponen agar mudah diubah */
	.transaction-form {
		--primary-color: #0d6efd;
		--primary-hover: #0b5ed7;
		--border-color: #dee2e6;
		--text-color: #333;
		--background-color: #f8f9fa;
	}

	/* Styling form yang lebih baik */
	.transaction-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.5rem;
		border-radius: 12px;
		background-color: var(--background-color);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		max-width: 900px;
		margin: 2rem auto;
	}

	/* --- Type Selector --- */
	.type-selector {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}
	.type-selector label {
		padding: 0.75rem;
		text-align: center;
		border: 1px solid var(--border-color);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
	}
	.type-selector input {
		display: none;
	}
	.type-selector label.selected {
		background-color: var(--primary-color);
		color: white;
		border-color: var(--primary-color);
		font-weight: bold;
	}

	.form-row {
		display: flex; /* Membuat item di dalamnya bersebelahan */
		gap: 1rem; /* Memberi jarak antara input Jumlah dan Tanggal */
		align-items: flex-end; /* Meratakan bagian bawah input jika labelnya berbeda tinggi */
	}

	/* 2. Atur lebar untuk masing-masing input */
	.amount-control {
		flex-grow: 2; /* Biarkan input Jumlah mengisi 2/3 ruang yang tersedia */
	}
	.date-control {
		flex-grow: 1; /* Biarkan input Tanggal mengisi 1/3 ruang yang tersedia */
	}
	.description {
		background-color: white;
		padding-top: 0.5rem;
		padding-left: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 8px;
	}

	/* --- Form Controls --- */
	.form-control {
		display: flex;
		width: 100%;
		flex-direction: column;
		text-align: left;
	}
	label {
		margin-bottom: 0.5rem;
		font-weight: bold;
		color: var(--text-color);
	}

	/* === PERBAIKAN PENGGABUNGAN ATURAN (DRY) === */
	/* Aturan ini berlaku untuk <input> biasa DAN input di dalam datepicker */
	:global(input),
	.form-control :global(.datepicker input) {
		width: 100%;
		padding-top: 0.3rem;
		padding-bottom: 0.3rem;
		padding-left: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
		box-sizing: border-box;
		transition:
			border-color 0.2s,
			box-shadow 0.2s; /* Tambahan untuk efek focus */
	}

	/* Saran: Tambahkan style untuk :focus agar lebih interaktif */
	:global(input:focus),
	.form-control :global(.datepicker input:focus) {
		outline: none;
		border-color: var(--primary-color);
		box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
	}

	/* === PERBAIKAN DUPLIKASI === */
	/* Cukup satu aturan untuk .datepicker */
	.form-control :global(.datepicker) {
		width: 100%;
	}

	/* --- Tombol Submit --- */
	button {
		padding: 0.75rem;
		border: none;
		border-radius: 4px;
		color: white;
		font-size: 1rem;
		font-weight: bold;
		cursor: pointer;
		transition: background-color 0.2s;
		margin-top: 0.5rem; /* Tambahan sedikit jarak di atas tombol */
	}
</style>
