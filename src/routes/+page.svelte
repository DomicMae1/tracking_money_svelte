<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import ExpenseForm from '$lib/components/ExpenseForm.svelte';
	import ExpenseList from '$lib/components/ExpenseList.svelte';
	import Filter from '$lib/components/Filter.svelte';

	// Alamat base URL untuk API Go kita
	const API_URL = 'https://tracking-money-go-iirm.vercel.app/api/transactions/';

	// State utama sekarang dimulai dengan array kosong
	let transactions = [];

	// State untuk filter, tidak berubah
	let currentFilter = {
		year: new Date().getFullYear(),
		month: 'all'
	};

	// --- FUNGSI UNTUK BERKOMUNIKASI DENGAN API ---

	// 1. Mengambil data dari backend
	async function fetchTransactions(filter) {
		let url = `${API_URL}?year=${filter.year}`;
		if (filter.month !== 'all') {
			url += `&month=${filter.month}`;
		}

		try {
			const response = await fetch(url);
			if (!response.ok) throw new Error('Gagal mengambil data');
			transactions = (await response.json()) || [];
		} catch (error) {
			console.error('Error fetching transactions:', error);
			alert('Tidak bisa terhubung ke server backend.');
		}
	}

	// 2. Menambah data baru (POST)
	async function handleNewTransaction(event) {
		const newTransactionData = event.detail;

		try {
			const response = await fetch(API_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newTransactionData)
			});

			if (!response.ok) throw new Error('Gagal menambah data');

			const createdTransaction = await response.json();

			// === PERBAIKAN DI SINI ===
			// 1. Ambil tanggal dari data yang baru dibuat
			const transactionDate = new Date(createdTransaction.date);

			// 2. Update filter agar cocok dengan data baru
			currentFilter = {
				year: transactionDate.getFullYear(),
				month: ('0' + (transactionDate.getMonth() + 1)).slice(-2)
			};

			// 3. Ambil data dari server DENGAN filter yang sudah diupdate
			// Ini akan menjamin data baru pasti tampil
			await fetchTransactions(currentFilter);
		} catch (error) {
			console.error('Error adding transaction:', error);
		}
	}

	// 3. Menghapus data (DELETE)
	async function handleDeleteTransaction(event) {
		const idToDelete = event.detail;

		try {
			const response = await fetch(`${API_URL}${idToDelete}`, {
				method: 'DELETE'
			});

			if (!response.ok) throw new Error('Gagal menghapus data');

			await fetchTransactions(currentFilter);
		} catch (error) {
			console.error('Error deleting transaction:', error);
		}
	}

	// 4. Menangani perubahan filter
	function handleFilterChange(event) {
		currentFilter = event.detail;
		fetchTransactions(currentFilter);
	}

	// onMount dijalankan sekali saat komponen pertama kali dimuat
	onMount(() => {
		fetchTransactions(currentFilter);
	});
</script>

<main>
	<h1>Pelacak Pengeluaran</h1>

	<ExpenseForm on:addTransaction={handleNewTransaction} />

	<Filter on:filterChange={handleFilterChange} />

	<ExpenseList {transactions} on:deleteTransaction={handleDeleteTransaction} />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 800px;
		margin: 0 auto;
	}

	h1 {
		color: #333;
		font-size: 2.5rem;
		font-weight: 700;
	}
</style>
