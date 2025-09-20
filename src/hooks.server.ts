// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Ambil token dari cookies
	const token = event.cookies.get('token');

	// Jika user akses "/" tanpa login → redirect ke /login
	if (!token && event.url.pathname === '/') {
		return Response.redirect(`${event.url.origin}/login`);
	}

	// Jika sudah login dan masih akses /login → redirect ke /
	if (token && event.url.pathname === '/login') {
		return Response.redirect(`${event.url.origin}/`);
	}

	// Lanjutkan request normal
	return resolve(event);
};
