import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function authenticateToken(req) {
	const authHeader = req.headers.get('authorization');
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		return NextResponse.json(
			{ success: false, message: 'Token required' },
			{ status: 401 }
		);
	}

	try {
		const user = jwt.verify(token, process.env.JWT_SECRET);
		return user;
	} catch (err) {
		return NextResponse.json(
			{ success: false, message: 'Invalid token' },
			{ status: 403 }
		);
	}
}
