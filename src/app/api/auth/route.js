import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
	throw new Error('JWT_SECRET no está definido en las variables de entorno.');
}

function generateToken(userId) {
	return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '10y' });
}

export async function hashPassword(plainPassword) {
	const saltRounds = 10;
	return await bcrypt.hash(plainPassword, saltRounds);
}

export async function verifyPassword(plainPassword, hashedPassword) {
	return await bcrypt.compare(plainPassword, hashedPassword);
}

export async function POST(request) {
	try {
		const { db } = await connectToDatabase();
		const { email, password } = await request.json();
		const newEmail = email.toLowerCase();

		const user = await db.collection('users').findOne({ email: newEmail });
		if (!user) {
			return NextResponse.json(
				{ success: false, error: 'User not found' },
				{ status: 404 }
			);
		}

		const isPasswordCorrect = await verifyPassword(password, user.password);

		if (!isPasswordCorrect) {
			return NextResponse.json(
				{ success: false, error: 'Incorrect password' },
				{ status: 401 }
			);
		}

		const token = generateToken(user.public_id);

		const { _id, ...newUser } = user;

		return NextResponse.json(
			{ success: true, token: token, user: newUser },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error al procesar la solicitud:', error);
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
