<script>
	// @ts-nocheck

	import { createEventDispatcher } from 'svelte';

	// Inisialisasi dispatcher untuk mengirim "event" ke komponen induk
	const dispatch = createEventDispatcher();

	// Variabel untuk menampung nilai dari setiap input form
	// Ini adalah "state" untuk komponen ini
	let description = '';
	let amount = null;
	let date = '';

	// Fungsi yang akan dijalankan saat form disubmit
	function handleSubmit() {
		// 1. Lakukan validasi sederhana
		if (!description.trim() || !amount || !date) {
			alert('Mohon isi semua kolom!');
			return;
		}

		// 2. Buat objek transaksi baru dari data form
		const newTransaction = {
			id: Date.now(), // ID unik sederhana untuk sekarang
			description: description,
			amount: +amount, // Tanda + untuk memastikan tipe datanya number
			date: date
		};

		// 3. "Kirim" event bernama 'addTransaction' beserta datanya ke komponen induk
		dispatch('addTransaction', newTransaction);

		// 4. Reset form setelah berhasil disubmit
		description = '';
		amount = null;
		date = '';
	}
</script>

<form class="expense-form" on:submit|preventDefault={handleSubmit}>
	<div class="form-control">
		<label for="description">Deskripsi</label>
		<input type="text" id="description" placeholder="Contoh: Beli Kopi" bind:value={description} />
	</div>
	<div class="form-control">
		<label for="amount">Jumlah (Rp)</label>
		<input type="number" id="amount" placeholder="Contoh: 25000" bind:value={amount} />
	</div>
	<div class="form-control">
		<label for="date">Tanggal</label>
		<input type="date" id="date" bind:value={date} />
	</div>
	<button type="submit">Tambah Pengeluaran</button>
</form>

<style>
	.expense-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.5rem;
		border-radius: 8px;
		background-color: #f8f9fa;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		max-width: 500px;
		margin: 2rem auto;
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
		background-color: #007bff;
		color: white;
		font-size: 1rem;
		font-weight: bold;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	button:hover {
		background-color: #0056b3;
	}
</style>
