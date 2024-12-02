import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import { hashPassword } from '@/app/api/auth/route';

export async function POST(request, { params }) {
	try {
		const { db } = await connectToDatabase();
		const { id } = params;
		const password = '12345678';

		const user = await db.collection('users').findOne({ public_id: id });

		if (!user) {
			return NextResponse.json(
				{ success: false, error: 'User not found' },
				{ status: 404 }
			);
		}

		const newPassword = await hashPassword(password);

		const updatedUser = {
			...user,
			password: newPassword,
		};

		const updated = await db
			.collection('users')
			.updateOne({ public_id: id }, { $set: updatedUser });

		if (updated.matchedCount === 0) {
			return NextResponse.json(
				{ success: false, error: 'User not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: updated }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
