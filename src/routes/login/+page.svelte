<script lang="ts">
	let identifier = '';
	let password = '';

	async function handleLogin() {
		const loginButton = document.querySelector('.btn-primary') as HTMLButtonElement;
		if (loginButton) loginButton.disabled = true;

		try {
			const res = await fetch('https://tracking-money-go.vercel.app/api/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ identifier, password })
			});

			if (res.ok) {
				const data = await res.json();
				document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax; Secure`;
				window.location.href = '/';
			} else {
				const errorData = await res.json();
				alert(`Login gagal: ${errorData.message || 'Email atau password salah.'}`);
			}
		} catch (error) {
			console.error('Login error:', error);
			alert('Tidak dapat terhubung ke server. Mohon coba lagi nanti.');
		} finally {
			if (loginButton) loginButton.disabled = false;
		}
	}

	function goToRegister() {
		window.location.href = '/register';
	}
</script>

<main class="page-container">
	<div class="login-card">
		<div class="card-header">
			<h1>👋 Selamat Datang Kembali</h1>
			<p>Masuk untuk melanjutkan ke dasbor Anda</p>
		</div>

		<form on:submit|preventDefault={handleLogin}>
			<div class="form-group">
				<label for="email">Email</label>
				<div class="input-wrapper">
					<span class="icon">📧</span>
					<input
						id="identifier"
						type="text"
						placeholder="contoh: johndoe / johndoe@email.com"
						bind:value={identifier}
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
				<button type="submit" class="btn btn-primary">Login</button>
				<button type="button" class="btn btn-secondary" on:click={goToRegister}>
					Buat Akun Baru
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

	/* --- Layout --- */
	.page-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: linear-gradient(135deg, #3b82f6, #06b6d4);
		font-family: var(--font-family);
		padding: 1rem;
	}

	/* --- Card Login dengan efek glass --- */
	.login-card {
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

	/* Animasi masuk */
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

	/* --- Input Group --- */
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

	/* --- Tombol --- */
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

	/* Responsif */
	@media (max-width: 480px) {
		.login-card {
			padding: 2rem 1.5rem;
		}

		.card-header h1 {
			font-size: 1.5rem;
		}
	}
</style>
