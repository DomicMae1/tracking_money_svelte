<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	// 1. Menggunakan nama komponen yang baru
	import TransactionForm from '$lib/components/TransactionForm.svelte';
	import TransactionList from '$lib/components/TransactionList.svelte';
	import Filter from '$lib/components/Filter.svelte';
	// 2. Mengimpor komponen Summary yang baru
	import Summary from '$lib/components/Summary.svelte';

	// PASTIKAN URL INI SESUAI DENGAN DEPLOYMENT BACKEND ANDA
	const API_BASE_URL = 'https://tracking-money-go-iirm.vercel.app/api';

	// State untuk daftar transaksi
	let transactions = [];
	// State BARU untuk data ringkasan
	let summary = {};

	let currentFilter = {
		year: new Date().getFullYear(),
		month: 'all'
	};

	// --- FUNGSI API YANG DIPERBARUI ---

	// Fungsi helper untuk mengambil semua data (transaksi dan summary)
	async function fetchAllData(filter) {
		// Jalankan kedua fetch secara bersamaan untuk efisiensi
		await Promise.all([fetchTransactions(filter), fetchSummary(filter)]);
	}

	// Mengambil daftar transaksi
	async function fetchTransactions(filter) {
		const params = new URLSearchParams({ year: filter.year });
		if (filter.month !== 'all') params.append('month', filter.month);
		try {
			const response = await fetch(`${API_BASE_URL}/transactions?${params.toString()}`);
			if (!response.ok) throw new Error('Gagal mengambil transaksi');
			transactions = (await response.json()) || [];
		} catch (error) {
			console.error(error);
			alert('Gagal terhubung ke server untuk mengambil transaksi.');
		}
	}

	// Fungsi BARU untuk mengambil data ringkasan
	async function fetchSummary(filter) {
		const params = new URLSearchParams({ year: filter.year });
		if (filter.month !== 'all') params.append('month', filter.month);
		try {
			const response = await fetch(`${API_BASE_URL}/summary?${params.toString()}`);
			if (!response.ok) throw new Error('Gagal mengambil summary');
			summary = (await response.json()) || {};
		} catch (error) {
			console.error(error);
		}
	}

	// Menambah data baru, sekarang me-refresh semua data
	async function handleNewTransaction(event) {
		const newTransactionData = event.detail;
		try {
			await fetch(`${API_BASE_URL}/transactions`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newTransactionData)
			});
			// Panggil helper untuk me-refresh transaksi DAN summary
			await fetchAllData(currentFilter);
		} catch (error) {
			console.error('Error adding transaction:', error);
		}
	}

	// Menghapus data, sekarang me-refresh semua data
	async function handleDeleteTransaction(event) {
		const idToDelete = event.detail;
		try {
			await fetch(`${API_BASE_URL}/transactions/${idToDelete}`, { method: 'DELETE' });
			// Panggil helper untuk me-refresh transaksi DAN summary
			await fetchAllData(currentFilter);
		} catch (error) {
			console.error('Error deleting transaction:', error);
		}
	}

	// Mengubah filter, sekarang me-refresh semua data
	function handleFilterChange(event) {
		currentFilter = event.detail;
		fetchAllData(currentFilter);
	}

	// onMount sekarang memanggil helper untuk mengambil semua data awal
	onMount(() => {
		fetchAllData(currentFilter);
	});
</script>

<main>
	<!-- Judul diubah -->
	<h1>Manajer Keuangan</h1>

	<!-- Komponen Summary BARU ditambahkan di sini -->
	<Summary {summary} />

	<!-- Menggunakan nama komponen yang baru -->
	<TransactionForm on:addTransaction={handleNewTransaction} />

	<Filter on:filterChange={handleFilterChange} />

	<!-- Menggunakan nama komponen yang baru -->
	<TransactionList {transactions} on:deleteTransaction={handleDeleteTransaction} />
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
		margin-bottom: 0;
	}
</style>
