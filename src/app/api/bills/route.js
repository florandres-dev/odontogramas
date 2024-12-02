import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';

export async function GET(req) {
	try {
		const { db } = await connectToDatabase();
		const bills = await db.collection('bills').find({}).toArray();

		return NextResponse.json({ success: true, data: bills }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
