import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';

export async function GET() {
	try {
		const { db } = await connectToDatabase();
		const healthcare = await db.collection('prices').find({}).toArray();

		return NextResponse.json(
			{ success: true, data: healthcare },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
