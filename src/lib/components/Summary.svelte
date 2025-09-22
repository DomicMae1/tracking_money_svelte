<script>
	// @ts-nocheck

	// Komponen ini menerima objek 'summary' dari halaman utama.
	// Kita berikan nilai default agar tidak error saat data belum ter-load.
	export let summary = {
		totalIncome: 0,
		totalExpense: 0,
		balance: 0
	};

	// Fungsi helper untuk memformat angka menjadi format Rupiah
	function formatCurrency(value) {
		// Pastikan value adalah angka, jika tidak, kembalikan 0
		if (typeof value !== 'number') {
			value = 0;
		}
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(value);
	}
</script>

<div class="summary-container">
	<div class="card">
		<h4>Pemasukan</h4>
		<p class="income">{formatCurrency(summary.totalIncome)}</p>
	</div>
	<div class="card">
		<h4>Pengeluaran</h4>
		<p class="expense">{formatCurrency(summary.totalExpense)}</p>
	</div>
	<div class="card balance-card">
		<h4>Saldo Akhir</h4>
		<p class="balance">{formatCurrency(summary.balance)}</p>
	</div>
</div>

<style>
	.summary-container {
		display: grid;
		/* Membuat layout kolom yang responsif */
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
		max-width: 900px;
		margin: 2rem auto;
	}

	.card {
		background: #fff;
		padding-top: 1rem;
		padding-bottom: 1rem;
		border-radius: 8px;
		text-align: center;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
		transition: transform 0.2s ease-in-out;
	}

	.card:hover {
		transform: translateY(-5px);
	}

	.card h4 {
		margin: 0 0 0.5rem 0;
		color: #495057;
		font-weight: 500;
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
