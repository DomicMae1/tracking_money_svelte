<script>
	// @ts-nocheck
	import { BanknoteArrowUp } from 'lucide-svelte';
	import { BanknoteArrowDown } from 'lucide-svelte';
	import { Wallet } from 'lucide-svelte';

	export let summary = {
		totalIncome: 0,
		totalExpense: 0,
		balance: 0
	};

	function formatCurrency(value) {
		if (typeof value !== 'number') value = 0;
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(value);
	}
</script>

<div class="summary-container">
	<div class="card">
		<div class="card-header">
			<BanknoteArrowUp class="icon income-icon" />
			<h4>Pemasukan</h4>
		</div>
		<p class="income">{formatCurrency(summary.totalIncome)}</p>
	</div>

	<div class="card">
		<div class="card-header">
			<BanknoteArrowDown class="icon expense-icon" />
			<h4>Pengeluaran</h4>
		</div>
		<p class="expense">{formatCurrency(summary.totalExpense)}</p>
	</div>

	<div class="card balance-card">
		<div class="card-header">
			<Wallet class="icon" />
			<h4>Saldo Akhir</h4>
		</div>
		<p class="balance">{formatCurrency(summary.balance)}</p>
	</div>
</div>

<style>
	.summary-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
		max-width: 900px;
		margin: 2rem auto;
	}

	.card {
		background: #fff;
		padding: 1rem;
		border-radius: 8px;
		text-align: center;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
		transition: transform 0.2s ease-in-out;
	}

	.card:hover {
		transform: translateY(-5px);
	}

	.card-header {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.card-header h4 {
		margin: 0;
		color: #495057;
		font-weight: 500;
	}

	.icon {
		width: 20px;
		height: 20px;
	}

	.card p {
		margin: 0;
		font-size: 1.5rem;
		font-weight: bold;
	}

	.income {
		color: #198754; /* Hijau */
	}

	.expense {
		color: #dc3545; /* Merah */
	}

	.balance-card {
		background-color: #0d6efd; /* Biru */
		color: white;
	}

	.balance-card h4,
	.balance-card p {
		color: white;
	}
</style>
