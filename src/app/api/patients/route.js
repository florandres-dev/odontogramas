import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import { authenticateToken } from '../middlewares/authenticateToken';

export async function GET(req) {
	const user = await authenticateToken(req);

	if (user instanceof NextResponse) {
		return user;
	}

	try {
		const { db } = await connectToDatabase();

		const patients = await db
			.collection('patients')
			.aggregate([
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

		return NextResponse.json(
			{ success: true, data: patients },
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
