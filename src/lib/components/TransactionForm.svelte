<script>
	// @ts-nocheck

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let description = '';
	let amount = null;
	let date = '';
	// Menambahkan state baru untuk tipe transaksi, default-nya 'expense'
	let type = 'expense';

	function handleSubmit() {
		if (!description.trim() || !amount || !date) {
			alert('Mohon isi semua kolom!');
			return;
		}

		// Buat objek baru, sekarang menyertakan 'type'
		const newTransactionData = {
			description: description,
			amount: +amount,
			date: date,
			type: type // Sertakan tipe yang dipilih
		};

		// Kirim event dengan data yang sudah lengkap
		dispatch('addTransaction', newTransactionData);

		// Reset form
		description = '';
		amount = null;
		date = '';
		// Tipe tidak perlu di-reset, biarkan pilihan terakhir pengguna
	}
</script>

<!-- Nama class diubah agar lebih generik -->
<form class="transaction-form" on:submit|preventDefault={handleSubmit}>
	<!-- Elemen baru untuk memilih tipe Pemasukan/Pengeluaran -->
	<div class="type-selector">
		<label class:selected={type === 'expense'}>
			<input type="radio" bind:group={type} value="expense" />
			Pengeluaran
		</label>
		<label class:selected={type === 'income'}>
			<input type="radio" bind:group={type} value="income" />
			Pemasukan
		</label>
	</div>

	<div class="form-control">
		<label for="description">Deskripsi</label>
		<input
			type="text"
			id="description"
			placeholder="Contoh: Gaji, Beli Kopi"
			bind:value={description}
		/>
	</div>
	<div class="form-control">
		<label for="amount">Jumlah (Rp)</label>
		<input type="number" id="amount" placeholder="Contoh: 50000" bind:value={amount} />
	</div>
	<div class="form-control">
		<label for="date">Tanggal</label>
		<input type="date" id="date" bind:value={date} />
	</div>
	<button type="submit">Tambah Transaksi</button>
</form>

<style>
	/* Styling form yang lebih baik */
	.transaction-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.5rem;
		border-radius: 12px;
		background-color: #f8f9fa;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		max-width: 900px;
		margin: 2rem auto;
	}
	.type-selector {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}
	.type-selector label {
		padding: 0.75rem;
		text-align: center;
		border: 1px solid #dee2e6;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
	}
	.type-selector input {
		/* Sembunyikan radio button asli */
		display: none;
	}
	/* Style untuk label yang terpilih */
	.type-selector label.selected {
		background-color: #0d6efd;
		color: white;
		border-color: #0d6efd;
		font-weight: bold;
	}
	.form-control {
		display: flex;
		flex-direction: column;
	}
	label {
		margin-bottom: 0.5rem;
		font-weight: bold;
		color: #333;
	}
	input {
		padding: 0.75rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}
	button {
		padding: 0.75rem;
		border: none;
		border-radius: 4px;
		background-color: #0d6efd;
		color: white;
		font-size: 1rem;
		font-weight: bold;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	button:hover {
		background-color: #0b5ed7;
	}
</style>
