'use client';
import React, { useEffect, useState } from 'react';
import Tooth from './Tooth';
import { Tooltip } from 'primereact/tooltip';
import { teeth_names } from '../data/teeth_names';
import { ProgressSpinner } from 'primereact/progressspinner';

const odontogramTemplate = Array.from({ length: 32 }, (_, index) => ({
	name: teeth_names[index],
	parts: [
		{
			name: 'tooth_part_1',
			state: 'white',
			unique_classes: 'border-r border-b border-black',
		},
		{
			name: 'tooth_part_2',
			state: 'white',
			unique_classes: 'border-b border-black',
		},
		{
			name: 'tooth_part_3',
			state: 'white',
			unique_classes: 'border-r border-black',
		},
		{ name: 'tooth_part_4', state: 'white', unique_classes: '' },
		{
			name: 'tooth_part_5',
			state: 'white',
			unique_classes: 'border border-black absolute rounded-full',
		},
	],
}));

const TeethContainer = ({
	dental_chart = odontogramTemplate,
	patientId = null,
	setNewDentalChart = null,
	dentalChart = [],
}) => {
	const [teethData, setTeethData] = useState(dental_chart);
	const [loading, setLoading] = useState(true);

	const updateToothPart = (toothIndex, partName, newState) => {
		setTeethData((prevTeethData) =>
			prevTeethData.map((tooth, index) =>
				index === toothIndex
					? {
							...tooth,
							parts: tooth.parts.map((part) =>
								part.name === partName ? { ...part, state: newState } : part
							),
					  }
					: tooth
			)
		);
	};

	useEffect(() => {
		const fetchTeethData = async () => {
			const response = await fetch(`/api/patients/${patientId}`);
			const data = await response.json();
			setTeethData(data.data.dental_chart);
		};
		if (patientId) {
			fetchTeethData();
			setLoading(false);
			return;
		}
		if (dentalChart.length > 0) setTeethData(dentalChart);
		else setNewDentalChart(teethData);

		setLoading(false);
	}, []);

	useEffect(() => {
		const updateDentalChart = async () => {
			try {
				const getResponse = await fetch(`/api/patients/${patientId}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				if (!getResponse.ok) {
					throw new Error('Failed to fetch patient data');
				}
				const data = await getResponse.json();
				const patientData = data.data;

				const updatedPatientData = {
					...patientData,
					dental_chart: teethData,
				};

				const putResponse = await fetch(`/api/patients/${patientId}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(updatedPatientData),
				});

				if (!putResponse.ok) {
					throw new Error('Failed to update dental chart');
				}
			} catch (error) {
				console.error('Error updating dental chart:', error);
			}
		};

		if (patientId) {
			updateDentalChart();
		} else {
			setNewDentalChart(teethData);
		}
	}, [teethData, patientId]);

	return (
		<div className='flex flex-wrap gap-4 w-full justify-center'>
			<Tooltip
				target='.tooth'
				mouseTrack
				mouseTrackLeft={10}
			/>
			{loading ? (
				<ProgressSpinner />
			) : (
				teethData.map((tooth, index) => (
					<div
						key={index}
						className='tooth'
						data-pr-tooltip={tooth.name}>
						<Tooth
							parts={tooth.parts}
							onUpdatePart={(partName, newState) =>
								updateToothPart(index, partName, newState)
							}
						/>
					</div>
				))
			)}
		</div>
	);
};

export default TeethContainer;
