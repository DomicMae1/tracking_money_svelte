<script>
	// @ts-nocheck
	import { onMount, afterUpdate } from 'svelte';
	import Chart from 'chart.js/auto';
	import zoomPlugin from 'chartjs-plugin-zoom'; // <- Plugin untuk zoom & pan

	export let monthlySummary = [];

	let chartCanvas;
	let chartInstance;

	Chart.register(zoomPlugin); // Daftarkan plugin

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

		const options = {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				y: { beginAtZero: true }
			},
			plugins: {
				zoom: {
					pan: {
						enabled: true,
						mode: 'x',
						threshold: 5
					},
					zoom: {
						enabled: true,
						mode: 'x',
						wheel: { enabled: true }, // scroll mouse
						pinch: { enabled: true }, // touch device pinch
						drag: { enabled: true } // drag untuk zoom area
					}
				}
			}
		};

		if (chartInstance) {
			chartInstance.data = data;
			chartInstance.options = options;
			chartInstance.update();
		} else {
			chartInstance = new Chart(chartCanvas, {
				type: 'bar',
				data: data,
				options: options
			});
		}
	}

	onMount(() => renderChart());
	afterUpdate(() => renderChart());
</script>

<div class="chart-container">
	<h2 class="font-bold">Ringkasan Bulanan</h2>
	<div class="canvas-wrapper">
		<canvas bind:this={chartCanvas}></canvas>
	</div>
</div>

<style>
	.chart-container {
		max-width: 900px;
		margin: 2rem auto;
		padding: 1rem;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
	}
	h2 {
		margin-top: 0;
	}
	.canvas-wrapper {
		position: relative;
		width: 100%;
		height: 400px; /* tinggi chart agar bisa scroll & zoom */
	}
	@media (max-width: 768px) {
		.canvas-wrapper {
			height: 300px;
		} /* height lebih pas di tablet/mobil */
	}
</style>
