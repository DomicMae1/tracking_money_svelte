<script>
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	// --- State untuk Pilihan Filter ---
	let selectedYear = new Date().getFullYear();
	let selectedMonth = 'all'; // 'all' berarti semua bulan

	// --- Opsi untuk Dropdown ---
	const years = [2025, 2024, 2023]; // Anda bisa membuatnya lebih dinamis jika perlu
	const months = [
		{ value: 'all', name: 'Semua Bulan' },
		{ value: '01', name: 'Januari' },
		{ value: '02', name: 'Februari' },
		{ value: '03', name: 'Maret' },
		{ value: '04', name: 'April' },
		{ value: '05', name: 'Mei' },
		{ value: '06', name: 'Juni' },
		{ value: '07', name: 'Juli' },
		{ value: '08', name: 'Agustus' },
		{ value: '09', name: 'September' },
		{ value: '10', name: 'Oktober' },
		{ value: '11', name: 'November' },
		{ value: '12', name: 'Desember' }
	];

	// --- Fungsi untuk Mengirim Event ---
	function dispatchFilterChange() {
		dispatch('filterChange', {
			year: selectedYear,
			month: selectedMonth
		});
	}

	// Kirim nilai filter awal saat komponen pertama kali dimuat
	onMount(() => {
		dispatchFilterChange();
	});
</script>

<div class="filter-container">
	<div class="filter-control">
		<label for="year">Tahun:</label>
		<select id="year" bind:value={selectedYear} on:change={dispatchFilterChange}>
			{#each years as year}
				<option value={year}>{year}</option>
			{/each}
		</select>
	</div>
	<div class="filter-control">
		<label for="month">Bulan:</label>
		<select id="month" bind:value={selectedMonth} on:change={dispatchFilterChange}>
			{#each months as month}
				<option value={month.value}>{month.name}</option>
			{/each}
		</select>
	</div>
</div>

<style>
	.filter-container {
		display: flex;
		justify-content: flex-start;
		gap: 1.5rem;
		padding: 1rem;
		background-color: #e9ecef;
		border-radius: 6px;
		max-width: 900px;
		margin: 1rem auto 2rem auto;
	}

	.filter-control {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	label {
		font-weight: 600;
	}

	select {
		border-radius: 4px;
		border: 1px solid #ccc;
	}
</style>
