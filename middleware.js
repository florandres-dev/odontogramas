import { NextResponse } from 'next/server';

const allowedOrigins = [
	'https://odontogramas-dt1ob4yy9-flors-projects-ab6a49c3.vercel.app',
	'https://odontogramas.vercel.app',
];

export function middleware(req) {
	const origin = req.headers.get('origin');
	if (allowedOrigins.includes(origin)) {
		const response = NextResponse.next();
		response.headers.set('Access-Control-Allow-Origin', origin);
		response.headers.set(
			'Access-Control-Allow-Methods',
			'GET, POST, PUT, DELETE, OPTIONS'
		);
		response.headers.set(
			'Access-Control-Allow-Headers',
			'Content-Type, Authorization'
		);
		return response;
	}
	return NextResponse.next();
}

export const config = {
	matcher: '/api/:path*', // Aplica a todas las rutas bajo /api
};
