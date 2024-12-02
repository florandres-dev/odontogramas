import { nanoid } from 'nanoid';
import connectToDatabase from '@/app/lib/mongodb';

export async function POST(request) {
	try {
		const body = await request.json();
		const { treatment_name, insurance_price, particular_price } = body;

		if (!treatment_name || !insurance_price || !particular_price) {
			return new Response(
				JSON.stringify({ success: false, message: 'Missing data' }),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		const { db } = await connectToDatabase();
		const newHealthcare = {
			treatment_id: nanoid(10),
			treatment_name,
			insurance_price,
			particular_price,
		};

		await db.collection('prices').insertOne(newHealthcare);

		return new Response(
			JSON.stringify({ success: true, data: newHealthcare }),
			{
				status: 201,
				headers: { 'Content-Type': 'application/json' },
			}
		);
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
