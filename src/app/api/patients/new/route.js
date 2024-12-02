import { nanoid } from 'nanoid';
import connectToDatabase from '@/app/lib/mongodb';

export async function POST(request) {
	try {
		const body = await request.json();
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
		} = body;

		const { db } = await connectToDatabase();
		const newPatient = {
			public_id: nanoid(10),
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

		await db.collection('patients').insertOne(newPatient);

		return new Response(JSON.stringify({ success: true, data: newPatient }), {
			status: 201,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ success: false, error: error.message }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
}
