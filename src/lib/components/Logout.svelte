<script>
	function logout() {
		// Hapus cookie token
		document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

		// Redirect ke halaman login
		window.location.href = '/login';
	}
</script>

<button
	class="absolute top-4 right-4 rounded-lg bg-red-500 px-4 py-2 text-white shadow-md hover:bg-red-600"
	on:click={logout}
>
	Logout
</button>
