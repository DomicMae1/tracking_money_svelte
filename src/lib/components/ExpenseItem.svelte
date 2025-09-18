<script>
	// @ts-nocheck

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	// Komponen ini menerima satu objek 'transaction' dari induknya (ExpenseList)
	export let transaction;

	// Fungsi untuk memformat angka menjadi format Rupiah
	function formatCurrency(value) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(value);
	}

	// Saat tombol hapus diklik, kirim event ke induk beserta ID transaksi ini
	function handleDelete() {
		dispatch('deleteTransaction', transaction.id);
	}
</script>

<div class="expense-item">
	<div class="info">
		<span class="description">{transaction.description}</span>
		<span class="date">{transaction.date}</span>
	</div>
	<div class="amount-action">
		<span class="amount">{formatCurrency(transaction.amount)}</span>
		<button class="delete-btn" on:click={handleDelete}>Hapus</button>
	</div>
</div>

<style>
	.expense-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background-color: #fff;
		border: 1px solid #e9ecef;
		border-radius: 6px;
		margin-bottom: 0.75rem;
	}

	.info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.description {
		font-weight: 600;
		font-size: 1.1rem;
		color: #212529;
	}

	.date {
		font-size: 0.85rem;
		color: #6c757d;
	}

	.amount-action {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.amount {
		font-weight: bold;
		color: #dc3545; /* Merah untuk pengeluaran */
		font-size: 1.1rem;
	}

	.delete-btn {
		border: none;
		background-color: #dc3545;
		color: white;
		padding: 0.5rem 0.75rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.8rem;
	}

	.delete-btn:hover {
		background-color: #c82333;
	}
</style>
