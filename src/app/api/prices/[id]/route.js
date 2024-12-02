import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';

export async function PUT(request, { params }) {
	const { id } = params;
	const pricesData = await request.json();

	try {
		const { db } = await connectToDatabase();
		const healthcare = await db.collection('prices').findOne({
			treatment_id: id,
		});

		if (!healthcare) {
			return NextResponse.json(
				{ success: false, message: 'Precio no encontrado' },
				{ status: 404 }
			);
		}

		const {
			insurance_price = healthcare.insurance_price,
			particular_price = healthcare.particular_price,
			treatment_name = healthcare.treatment_name,
		} = pricesData;

		const healthcareToUpdate = {
			insurance_price,
			particular_price,
			treatment_name,
		};

		const result = await db.collection('prices').updateOne(
			{
				treatment_id: id,
			},
			{
				$set: healthcareToUpdate,
			}
		);

		if (result.matchedCount === 0) {
			return NextResponse.json(
				{ success: false, message: 'Precio no encontrado' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ success: true, message: 'Precio actualizado' },
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

export async function DELETE(req, { params }) {
	const { id } = params;

	try {
		const { db } = await connectToDatabase();

		const healthcare = await db.collection('prices').findOne({
			treatment_id: id,
		});

		if (!healthcare) {
			return NextResponse.json(
				{ success: false, message: 'Precio no encontrado' },
				{ status: 404 }
			);
		}
		console.log(healthcare);
		const result = await db.collection('prices').deleteOne({
			treatment_id: id,
		});

		if (result.deletedCount === 0) {
			return NextResponse.json(
				{ success: false, message: 'Precio no encontrado' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ success: true, message: 'Precio eliminado' },
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
