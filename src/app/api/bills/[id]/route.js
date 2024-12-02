import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
	try {
		const { id } = params;
		const { db } = await connectToDatabase();
		const bill = await db
			.collection('bills')
			.findOne({ _id: new ObjectId(id) });

		if (!bill) {
			return NextResponse.json(
				{ success: false, message: 'Factura no encontrada' },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: bill }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

export async function PUT(request, { params }) {
	const { id } = params;
	const billData = await request.json();

	try {
		const { db } = await connectToDatabase();

		const existingBill = await db
			.collection('bills')
			.findOne({ _id: new ObjectId(id) });
		if (!existingBill) {
			return NextResponse.json(
				{ success: false, message: 'Factura no encontrada' },
				{ status: 404 }
			);
		}

		const { paid_amount } = billData;

		const total_amount = existingBill.total_amount;
		const remaining_amount = total_amount - paid_amount;

		let status;
		if (paid_amount == 0) {
			status = 'unpaid';
		} else if (paid_amount >= total_amount) {
			status = 'paid';
		} else {
			status = 'partially_paid';
		}

		const billToUpdate = {
			paid_amount,
			remaining_amount,
			status,
		};

		const result = await db
			.collection('bills')
			.updateOne({ _id: new ObjectId(id) }, { $set: billToUpdate });

		if (result.matchedCount === 0) {
			return NextResponse.json(
				{ success: false, message: 'Factura no encontrada' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ success: true, message: 'Factura actualizada' },
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

export async function DELETE(request, { params }) {
	const { id } = params;

	try {
		const { db } = await connectToDatabase();
		const result = await db
			.collection('bills')
			.deleteOne({ _id: new ObjectId(id) });

		if (result.deletedCount === 0) {
			return NextResponse.json(
				{ success: false, message: 'Factura no encontrada' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ success: true, message: 'Factura eliminada' },
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
