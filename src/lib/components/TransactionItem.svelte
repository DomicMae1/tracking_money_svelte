<script>
	// @ts-nocheck

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	// Komponen ini sekarang menerima transaksi yang bisa berupa 'income' atau 'expense'
	export let transaction;

	function formatCurrency(value) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(value);
	}

	function handleDelete() {
		dispatch('deleteTransaction', transaction.id);
	}
</script>

<!-- Menggunakan class:income untuk styling kondisional -->
<!-- Jika transaction.type adalah 'income', Svelte akan otomatis menambahkan class "income" -->
<div class="transaction-item" class:income={transaction.type === 'income'}>
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
	.transaction-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background-color: #fff;
		/* Merah (pengeluaran) sebagai default */
		border-left: 5px solid #dc3545;
		border-radius: 6px;
		margin-bottom: 0.75rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	/* === PERUBAHAN UTAMA DI SINI === */
	/* Jika item memiliki class 'income', ganti warna border dan jumlahnya */
	.transaction-item.income {
		border-left-color: #198754; /* Hijau */
	}

	.transaction-item.income .amount {
		color: #198754; /* Hijau */
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
		color: #dc3545; /* Default-nya merah */
		font-size: 1.1rem;
	}
	.delete-btn {
		border: none;
		background-color: #6c757d; /* Warna lebih netral */
		color: white;
		padding: 0.5rem 0.75rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.8rem;
	}
	.delete-btn:hover {
		background-color: #5c636a;
	}
</style>
