import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import { capitalizeFirstLetter } from '@/app/utils/functions';
import { hashPassword } from '../../auth/route';

export async function GET(request, { params }) {
	try {
		const { db } = await connectToDatabase();
		const { id } = params;

		const user = await db.collection('users').findOne({ public_id: id });

		if (!user) {
			return NextResponse.json(
				{ success: false, error: 'User not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: user }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

export async function PUT(request, { params }) {
	try {
		const { db } = await connectToDatabase();
		const { id } = params;
		const { updatedUser } = await request.json();

		const existingUser = await db
			.collection('users')
			.findOne({ public_id: id });

		if (!existingUser) {
			return NextResponse.json(
				{ success: false, error: 'User not found' },
				{ status: 404 }
			);
		}

		const updatedFields = {};

		if (updatedUser.name) {
			updatedFields.name = capitalizeFirstLetter(updatedUser.name);
		}
		if (updatedUser.lastname) {
			updatedFields.lastname = capitalizeFirstLetter(updatedUser.lastname);
		}
		if (updatedUser.email) {
			updatedFields.email = updatedUser.email.toLowerCase();
		}
		if (updatedUser.password) {
			updatedFields.password = await hashPassword(updatedUser.password);
		}
		if (updatedUser.isAdmin !== undefined) {
			updatedFields.isAdmin = updatedUser.isAdmin;
		}

		if (Object.keys(updatedFields).length === 0) {
			return NextResponse.json(
				{ success: false, error: 'No fields to update' },
				{ status: 400 }
			);
		}

		const result = await db
			.collection('users')
			.updateOne({ public_id: id }, { $set: updatedFields });

		return NextResponse.json({ success: true, data: result }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

export async function DELETE(request, { params }) {
	try {
		const { db } = await connectToDatabase();
		const { id } = params;

		const user = await db.collection('users').deleteOne({ public_id: id });

		if (user.deletedCount === 0) {
			return NextResponse.json(
				{ success: false, error: 'User not found' },
				{ status: 401 }
			);
		}

		return NextResponse.json({ success: true, data: user }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
