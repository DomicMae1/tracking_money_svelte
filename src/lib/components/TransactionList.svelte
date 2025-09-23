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
	function handleAddNote(event) {
		dispatch('addNote', event.detail);
	}
</script>

<!-- Nama class diubah agar lebih generik -->
<div class="transaction-list-container">
	<!-- Judul diubah -->
	<h2 class="font-bold">Riwayat Transaksi</h2>

	{#if transactions.length === 0}
		<!-- Pesan diubah agar lebih sesuai -->
		<p class="empty-message">Belum ada data transaksi untuk periode ini.</p>
	{:else}
		<div class="list">
			{#each transactions as transaction (transaction.id)}
				<!-- Menggunakan komponen yang baru dan benar -->
				<TransactionItem
					{transaction}
					on:deleteTransaction={forwardDelete}
					on:addNote={handleAddNote}
				/>
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
		padding: 0 1rem;
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
	.list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* 📱 Mobile */
	@media (max-width: 640px) {
		.transaction-list-container {
			margin: 1rem auto;
			padding: 0.5rem;
		}

		h2 {
			font-size: 1.25rem;
			text-align: center; /* judul lebih pas ditengah di HP */
		}

		.empty-message {
			padding: 1rem;
			font-size: 0.85rem;
		}
	}

	/* 📲 Tablet */
	@media (min-width: 641px) and (max-width: 1024px) {
		.transaction-list-container {
			max-width: 95%;
			margin: 1.5rem auto;
		}

		h2 {
			font-size: 1.35rem;
		}
	}
</style>
