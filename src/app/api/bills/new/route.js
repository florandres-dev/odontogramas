import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';

export async function POST(request) {
	try {
		const { db } = await connectToDatabase();
		const billData = await request.json();

		const { total_amount, paid_amount, patient_id, treatment } = billData;
		const remaining_amount = total_amount - paid_amount;

		let status;
		if (paid_amount === 0) {
			status = 'unpaid';
		} else if (paid_amount >= total_amount) {
			status = 'paid';
		} else {
			status = 'partially_paid';
		}

		const newBill = {
			...billData,
			treatment,
			patient_id: patient_id,
			remaining_amount,
			date: new Date(),
			status,
		};

		const result = await db.collection('bills').insertOne(newBill);

		return NextResponse.json({ success: true, data: result }, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
