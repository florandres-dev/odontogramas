import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';

export async function GET(request, { params }) {
	try {
		const { id } = params;
		const { db } = await connectToDatabase();

		const patient = await db
			.collection('patients')
			.aggregate([
				{
					$match: { public_id: id },
				},
				{
					$addFields: {
						_idString: { $toString: '$_id' },
					},
				},
				{
					$lookup: {
						from: 'bills',
						localField: '_idString',
						foreignField: 'patient_id',
						as: 'bills',
					},
				},
				{
					$project: {
						_idString: 0,
					},
				},
			])
			.toArray();

		const singlePatient = patient[0];

		if (!singlePatient) {
			return NextResponse.json(
				{ success: false, error: 'Patient not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ success: true, data: singlePatient },
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

export async function PUT(request, { params }) {
	try {
		const { id } = params;
		const {
			name,
			insurance,
			affiliate_number,
			phone_number,
			dni,
			address,
			observations,
			birth_date,
			dental_chart,
		} = await request.json();
		const { db } = await connectToDatabase();

		const updatedPatient = {
			name,
			insurance,
			affiliate_number,
			phone_number,
			dni,
			address,
			observations,
			birth_date,
			dental_chart,
		};

		const result = await db
			.collection('patients')
			.updateOne({ public_id: id }, { $set: updatedPatient });

		if (result.matchedCount === 0) {
			return NextResponse.json(
				{ success: false, error: 'Patient not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ success: true, data: updatedPatient },
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
