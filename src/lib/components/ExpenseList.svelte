<script>
// @ts-nocheck

	import ExpenseItem from '$lib/components/ExpenseItem.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	// Menerima array 'transactions' dari komponen induknya (+page.svelte)
	export let transactions = [];

	// Fungsi untuk meneruskan event 'deleteTransaction' dari ExpenseItem ke +page.svelte
	function forwardDelete(event) {
		dispatch('deleteTransaction', event.detail);
	}
</script>

<div class="expense-list-container">
	<h2>Daftar Pengeluaran</h2>

	{#if transactions.length === 0}
		<p class="empty-message">Belum ada data pengeluaran. Silakan tambahkan!</p>
	{:else}
		<div class="list">
			{#each transactions as transaction (transaction.id)}
				<ExpenseItem {transaction} on:deleteTransaction={forwardDelete} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.expense-list-container {
		width: 100%;
		max-width: 500px;
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
