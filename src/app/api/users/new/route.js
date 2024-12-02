import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import { capitalizeFirstLetter } from '@/app/utils/functions';

import { nanoid } from 'nanoid';
import { hashPassword } from '../../auth/route';

export async function POST(request) {
	try {
		const { db } = await connectToDatabase();
		const { name, lastname, email, password, isAdmin } = await request.json();

		if (!name || !lastname || !email || !password || isAdmin === undefined) {
			return NextResponse.json(
				{
					success: false,
					error:
						'All fields are required (Name, Lastname, Email, Password, Role)',
				},
				{ status: 400 }
			);
		}

		const newEmail = email.toLowerCase();
		const newName = capitalizeFirstLetter(name);
		const newLastname = capitalizeFirstLetter(lastname);

		console.log('password pre hash', password);

		const hashedPassword = await hashPassword(password);

		console.log('password post hash', hashedPassword);

		if (await db.collection('users').findOne({ email: newEmail })) {
			return NextResponse.json(
				{ success: false, error: 'Email already exists' },
				{ status: 400 }
			);
		}

		const user = await db.collection('users').insertOne({
			public_id: nanoid(10),
			name: newName,
			lastname: newLastname,
			email: newEmail,
			password: hashedPassword,
			isAdmin: isAdmin,
		});

		return NextResponse.json({ success: true, data: user }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
