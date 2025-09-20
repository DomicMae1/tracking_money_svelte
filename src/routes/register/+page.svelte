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

<div class="register-page">
	<h2>Register</h2>
	<input placeholder="Username" bind:value={username} />
	<input placeholder="Email" type="email" bind:value={email} />
	<input placeholder="Password" type="password" bind:value={password} />

	<div style="margin-top: 10px;">
		<button on:click={handleRegister}>Register</button>
		<button on:click={goToLogin} style="margin-left: 8px;">Login</button>
	</div>
</div>
