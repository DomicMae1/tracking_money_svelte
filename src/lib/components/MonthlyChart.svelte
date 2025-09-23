<script>
	// @ts-nocheck

	import { onMount, afterUpdate } from 'svelte';
	import Chart from 'chart.js/auto';

	export let monthlySummary = [];

	let chartCanvas;
	let chartInstance;

	// Fungsi untuk menggambar atau memperbarui grafik (tidak ada perubahan di sini)
	function renderChart() {
		if (!chartCanvas || !monthlySummary) return;

		const labels = monthlySummary.map((d) => d.month);
		const incomeData = monthlySummary.map((d) => d.income);
		const expenseData = monthlySummary.map((d) => d.expense);

		const data = {
			labels: labels,
			datasets: [
				{
					label: 'Pemasukan',
					data: incomeData,
					backgroundColor: 'rgba(25, 135, 84, 0.6)',
					borderColor: 'rgba(25, 135, 84, 1)',
					borderWidth: 1
				},
				{
					label: 'Pengeluaran',
					data: expenseData,
					backgroundColor: 'rgba(220, 53, 69, 0.6)',
					borderColor: 'rgba(220, 53, 69, 1)',
					borderWidth: 1
				}
			]
		};

		if (chartInstance) {
			// Jika grafik sudah ada, cukup update datanya
			chartInstance.data = data;
			chartInstance.update();
		} else {
			// Jika belum ada, buat grafik baru
			chartInstance = new Chart(chartCanvas, {
				type: 'bar',
				data: data,
				options: {
					responsive: true,
					scales: {
						y: {
							beginAtZero: true
						}
					}
				}
			});
		}
	}

	// === PERBAIKAN UTAMA ADA DI SINI ===

	// 1. Panggil renderChart saat komponen pertama kali siap (mounted)
	// Ini akan membuat kerangka grafik awal.
	onMount(() => {
		renderChart();
	});

	// 2. Tetap panggil renderChart setelah data (prop) berubah
	// Ini akan mengisi grafik dengan data dari API saat datanya tiba.
	afterUpdate(() => {
		renderChart();
	});
</script>

<div class="chart-container">
	<h2 class="font-bold">Ringkasan Bulanan</h2>
	<canvas bind:this={chartCanvas}></canvas>
</div>

<style>
	.chart-container {
		max-width: 900px;
		margin: 2rem auto;
		padding: 1.5rem;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
	}
	h2 {
		text-align: left;
		margin-top: 0;
	}
</style>
