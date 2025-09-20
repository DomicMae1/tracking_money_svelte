<script>
	// @ts-nocheck

	// Mengimpor nama komponen yang baru dan benar
	import TransactionItem from '$lib/components/TransactionItem.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let transactions = [];

	function forwardDelete(event) {
		dispatch('deleteTransaction', event.detail);
	}
</script>

<!-- Nama class diubah agar lebih generik -->
<div class="transaction-list-container">
	<!-- Judul diubah -->
	<h2>Riwayat Transaksi</h2>

	{#if transactions.length === 0}
		<!-- Pesan diubah agar lebih sesuai -->
		<p class="empty-message">Belum ada data transaksi untuk periode ini.</p>
	{:else}
		<div class="list">
			{#each transactions as transaction (transaction.id)}
				<!-- Menggunakan komponen yang baru dan benar -->
				<TransactionItem {transaction} on:deleteTransaction={forwardDelete} />
			{/each}
		</div>
	{/if}
</div>

<style>
	/* Nama class diubah agar lebih generik */
	.transaction-list-container {
		width: 100%;
		max-width: 900px;
		margin: 2rem auto;
	}

	h2 {
		text-align: left;
		margin-bottom: 1rem;
		color: #333;
	}

	.empty-message {
		text-align: center;
		color: #6c757d;
		padding: 2rem;
		background-color: #f8f9fa;
		border-radius: 6px;
	}
</style>
