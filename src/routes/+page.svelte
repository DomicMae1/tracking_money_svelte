<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import {
		SidebarProvider,
		Sidebar,
		SidebarContent,
		SidebarFooter,
		SidebarGroup,
		SidebarGroupLabel,
		SidebarMenu,
		SidebarMenuItem,
		SidebarMenuButton,
		SidebarTrigger
	} from '$lib/components/ui/sidebar';
	import { Menu } from '@lucide/svelte';
	// 1. Menggunakan nama komponen yang baru
	import Logout from '$lib/components/Logout.svelte';
	import TransactionForm from '$lib/components/TransactionForm.svelte';
	import TransactionList from '$lib/components/TransactionList.svelte';
	import Filter from '$lib/components/Filter.svelte';
	// 2. Mengimpor komponen Summary yang baru
	import Summary from '$lib/components/Summary.svelte';
	import MonthlyChart from '$lib/components/MonthlyChart.svelte'; // Impor komponen baru

	// PASTIKAN URL INI SESUAI DENGAN DEPLOYMENT BACKEND ANDA
	const API_BASE_URL = 'https://tracking-money-go.vercel.app/api';

	// State untuk daftar transaksi
	let transactions = [];
	// State BARU untuk data ringkasan
	let summary = {};
	let monthlySummary = [];
	let notes = [];

	let currentFilter = {
		year: new Date().getFullYear(),
		month: 'all'
	};

	let token = null; // ❗ awalnya null
	let isSidebarOpen = false;

	function getCookie(name) {
		if (typeof document === 'undefined') return null; // aman untuk SSR
		const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
		return match ? match[2] : null;
	}

	// --- FUNGSI API YANG DIPERBARUI ---

	// Fungsi helper untuk mengambil semua data (transaksi dan summary)
	async function fetchAllData(filter) {
		if (!token) return;
		await Promise.all([
			fetchTransactions(filter),
			fetchSummary(filter),
			fetchMonthlySummary(filter)
		]);
	}
	// Mengambil daftar transaksi
	async function fetchTransactions(filter) {
		const params = new URLSearchParams({ year: filter.year });
		if (filter.month !== 'all') params.append('month', filter.month);
		try {
			const response = await fetch(`${API_BASE_URL}/transactions?${params.toString()}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
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
			const response = await fetch(`${API_BASE_URL}/summary?${params.toString()}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			if (!response.ok) throw new Error('Gagal mengambil summary');
			summary = (await response.json()) || {};
		} catch (error) {
			console.error(error);
		}
	}

	async function fetchMonthlySummary(filter) {
		const params = new URLSearchParams({ year: filter.year });
		if (filter.month !== 'all') params.append('month', filter.month); // ✅ sudah benar
		try {
			const response = await fetch(`${API_BASE_URL}/monthly-summary?${params.toString()}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			if (!response.ok) throw new Error('Gagal mengambil summary bulanan');
			monthlySummary = (await response.json()) || [];
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
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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
			await fetch(`${API_BASE_URL}/transactions/${idToDelete}`, {
				method: 'DELETE',
				headers: { Authorization: `Bearer ${token}` }
			});

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

	function handleAddNote(event) {
		notes = [...notes, event.detail];
	}

	// onMount sekarang memanggil helper untuk mengambil semua data awal
	onMount(() => {
		token = getCookie('token'); // ✅ token hanya diambil di client
		if (!token) {
			window.location.href = '/login'; // redirect kalau belum login
		} else {
			fetchAllData(currentFilter);
		}
	});
</script>

<main>
	<!-- Judul diubah -->
	<h1>Manajer Keuangan</h1>

	<div class="hidden lg:block">
		<Logout />
	</div>
	<!-- Komponen Summary BARU ditambahkan di sini -->
	<Summary {summary} />

	<MonthlyChart {monthlySummary} />

	<!-- Menggunakan nama komponen yang baru -->
	<TransactionForm on:addTransaction={handleNewTransaction} />

	<Filter on:filterChange={handleFilterChange} />

	<!-- Menggunakan nama komponen yang baru -->
	<TransactionList
		{transactions}
		on:deleteTransaction={handleDeleteTransaction}
		on:addNote={handleAddNote}
	/>
</main>

<div class="lg:hidden">
	<!-- Sidebar + trigger -->
	<SidebarProvider on:openChange={(e) => (isSidebarOpen = e.detail.open)}>
		<!-- Tombol trigger -->
		{#if !isSidebarOpen}
			<div class="mobile-sidebar-trigger p-2" transition:fade>
				<SidebarTrigger>
					<Menu class="h-6 w-6 text-gray-700" />
				</SidebarTrigger>
			</div>
		{/if}

		<!-- Sidebar -->
		<Sidebar side="right" class="custom-sidebar">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Menu</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton>
								<Logout />
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<p class="px-4 text-xs text-gray-500">© 2025 Money Manager</p>
			</SidebarFooter>
		</Sidebar>
	</SidebarProvider>
</div>

<div class="notes-container">
	{#each notes as note, i}
		<div class="note-item">
			<b>{note.description}</b>
			<br />
			{new Intl.NumberFormat('id-ID', {
				style: 'currency',
				currency: 'IDR',
				minimumFractionDigits: 0
			}).format(note.amount)}
			<br />
			<small>{new Date(note.date).toLocaleDateString('id-ID')}</small>
		</div>
	{/each}
</div>

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
		margin-bottom: 0.5rem;
	}

	.notes-container {
		position: fixed;
		top: 1rem;
		left: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		z-index: 50;
		max-width: 200px;
	}

	.note-item {
		background: #fff8c4;
		border: 1px solid #facc15;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		font-size: 0.9rem;
		text-align: left;
	}

	/* 📱 Mobile styles */
	@media (max-width: 640px) {
		main {
			padding: 0.75rem;
			max-width: 100%;
		}

		h1 {
			font-size: 1.8rem;
		}

		.notes-container {
			position: static;
			max-width: 100%;
			margin-top: 1rem;
		}

		.note-item {
			font-size: 0.85rem;
			padding: 0.5rem 0.75rem;
		}

		button {
			width: 100%;
			padding: 0.75rem;
			font-size: 1rem;
		}
	}

	/* 📱📲 Tablet styles */
	@media (min-width: 641px) and (max-width: 1024px) {
		main {
			padding: 1rem;
			max-width: 95%;
		}

		h1 {
			font-size: 2rem;
		}

		button {
			padding: 0.75rem 1rem;
			font-size: 1rem;
		}
	}
	.mobile-sidebar-trigger {
		position: fixed;
		top: 0.5rem;
		left: 0.5rem;
		z-index: 1001;
	}
	.custom-sidebar {
		position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
		width: 250px;
		background-color: #ffffff;
		box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
		transform: translateX(-100%);
		transition: transform 0.3s ease-in-out;
		z-index: 1000;
		display: flex;
		flex-direction: column;
	}
	.custom-sidebar[data-state='open'] {
		transform: translateX(0);
	}

	/* Content biar fleksibel */
	.custom-sidebar :global(.sidebar-footer) {
		padding: 1rem;
		border-top: 1px solid #eee;
	}

	/* Footer selalu di bawah */
	.custom-sidebar :global(.sidebar-footer) {
		padding: 1rem;
		border-top: 1px solid #eee;
	}
</style>
