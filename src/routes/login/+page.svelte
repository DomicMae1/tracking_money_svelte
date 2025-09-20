<script lang="ts">
	let email = '';
	let password = '';

	async function handleLogin() {
		const res = await fetch('https://tracking-money-go.vercel.app/api/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		if (res.ok) {
			const data = await res.json();
			// Simpan token di cookies
			document.cookie = `token=${data.token}; path=/; max-age=86400`;
			window.location.href = '/';
		} else {
			alert('Login gagal');
		}
	}

	function goToRegister() {
		window.location.href = '/register';
	}
</script>

<div class="login-page">
	<h2>Login</h2>
	<input placeholder="Email" bind:value={email} />
	<input type="password" placeholder="Password" bind:value={password} />

	<div style="margin-top: 10px;">
		<button on:click={handleLogin}>Login</button>
		<button on:click={goToRegister} style="margin-left: 8px;">Register</button>
	</div>
</div>
