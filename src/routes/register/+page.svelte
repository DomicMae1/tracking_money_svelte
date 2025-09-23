<script lang="ts">
	let username = '';
	let email = '';
	let password = '';

	async function handleRegister() {
		const res = await fetch('https://tracking-money-go.vercel.app/api/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, email, password })
		});

		if (res.ok) {
			alert('Registrasi berhasil! Silakan login.');
			window.location.href = '/login';
		} else {
			const errorText = await res.text();
			alert('Registrasi gagal: ' + errorText);
		}
	}

	function goToLogin() {
		window.location.href = '/login';
	}
</script>

<main class="page-container">
	<div class="register-card">
		<div class="card-header">
			<h1>📝 Buat Akun Baru</h1>
			<p>Daftar untuk mulai mengelola keuangan Anda</p>
		</div>

		<form on:submit|preventDefault={handleRegister}>
			<div class="form-group">
				<label for="username">Username</label>
				<div class="input-wrapper">
					<span class="icon">👤</span>
					<input
						id="username"
						type="text"
						placeholder="contoh: johndoe"
						bind:value={username}
						required
					/>
				</div>
			</div>

			<div class="form-group">
				<label for="email">Email</label>
				<div class="input-wrapper">
					<span class="icon">📧</span>
					<input
						id="email"
						type="email"
						placeholder="contoh: johndoe@email.com"
						bind:value={email}
						required
					/>
				</div>
			</div>

			<div class="form-group">
				<label for="password">Password</label>
				<div class="input-wrapper">
					<span class="icon">🔒</span>
					<input
						id="password"
						type="password"
						placeholder="••••••••"
						bind:value={password}
						required
					/>
				</div>
			</div>

			<div class="actions">
				<button type="submit" class="btn btn-primary">Register</button>
				<button type="button" class="btn btn-secondary" on:click={goToLogin}>
					Sudah Punya Akun
				</button>
			</div>
		</form>
	</div>
</main>

<style>
	:root {
		--font-family: 'Inter', sans-serif;
		--primary: #3b82f6;
		--primary-dark: #2563eb;
		--text-dark: #111827;
		--text-muted: #6b7280;
	}

	.page-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: linear-gradient(135deg, #3b82f6, #06b6d4);
		font-family: var(--font-family);
		padding: 1rem;
	}

	.register-card {
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		padding: 2.5rem;
		border-radius: 20px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
		width: 100%;
		max-width: 480px;
		text-align: center;
		animation: fadeInUp 0.6s ease both;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.card-header h1 {
		font-size: 1.8rem;
		font-weight: 700;
		color: var(--text-dark);
		margin-bottom: 0.5rem;
	}

	.card-header p {
		color: var(--text-muted);
		font-size: 0.95rem;
		margin: 0;
	}

	.form-group {
		margin-bottom: 1.25rem;
		text-align: left;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: var(--text-dark);
		font-size: 0.9rem;
	}

	.input-wrapper {
		position: relative;
	}

	.icon {
		position: absolute;
		left: 14px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 1rem;
		color: var(--text-muted);
	}

	input {
		width: 100%;
		padding: 0.75rem 1rem 0.75rem 2.5rem;
		border: 1px solid #d1d5db;
		border-radius: 10px;
		font-size: 1rem;
		transition:
			border 0.2s,
			box-shadow 0.2s;
	}

	input:focus {
		outline: none;
		border-color: var(--primary);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	.btn {
		width: 100%;
		padding: 0.9rem 1rem;
		border-radius: 10px;
		border: none;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-primary {
		background: var(--primary);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: var(--primary-dark);
		transform: translateY(-2px);
		box-shadow: 0 6px 12px rgba(59, 130, 246, 0.35);
	}

	.btn-secondary {
		background: white;
		color: var(--text-muted);
		border: 1px solid #d1d5db;
	}

	.btn-secondary:hover {
		background: #f9fafb;
	}

	@media (max-width: 480px) {
		.register-card {
			padding: 2rem 1.5rem;
		}

		.card-header h1 {
			font-size: 1.5rem;
		}
	}
</style>
