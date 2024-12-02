'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { TabView, TabPanel } from 'primereact/tabview';
import TeethContainer from '@/app/components/TeethContainer';
import PatientBillsTable from './components/IndividualPatientTable';
import { Button } from 'primereact/button';
import PaymentModal from '../components/PaymentModal';

const PatientById = () => {
	const { id } = useParams();
	const [patient, setPatient] = useState({});
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);

	const getPatientById = async () => {
		const response = await fetch(`/api/patients/${id}`);
		const data = await response.json();
		setPatient(data.data);
		setLoading(false);
		console.log(data.data);
	};

	useEffect(() => {
		getPatientById();
	}, []);

	const handleSave = async () => {
		await fetch(`/api/patients/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(patient),
		});
		setIsEditing(false);
	};

	const handleModalClose = () => {
		setPaymentModalVisible(false);
	};

	const patientFields = [
		{ label: 'Nombre', value: patient.name, key: 'name' },
		{ label: 'DNI', value: patient.dni, key: 'dni' },
		{
			label: 'Fecha de nacimiento',
			value: patient.birth_date,
			key: 'birth_date',
		},
		{
			label: 'Número de afiliación',
			value: patient.affiliate_number,
			key: 'affiliate_number',
		},
		{
			label: 'Número de teléfono',
			value: patient.phone_number,
			key: 'phone_number',
		},
		{ label: 'Dirección', value: patient.address, key: 'address' },
		{
			label: 'Notas',
			value:
				patient.observations !== ''
					? patient.observations
					: 'No hay observaciones',
			key: 'observations',
		},
	];

	if (loading) {
		return (
			<div className='w-full h-full flex flex-col gap-10 justify-center items-center'>
				<span>Cargando informacion de paciente...</span>
				<ProgressSpinner
					style={{ width: '100px', height: '100px' }}
					strokeWidth='8'
					fill='#EEEEEE'
					animationDuration='.5s'
				/>
			</div>
		);
	}

	return (
		<div className='w-full h-full flex flex-col gap-8 justify-start sm:pt-8 p-4 items-center bg-gray-100 sm:text-base text-sm'>
			<h2 className='sm:text-3xl text-xl '>{patient.name}</h2>
			<div className='rounded-lg overflow-auto sm:w-3/6 w-5/6 min-h-[40vh] shadow-xl bg-white px-4 '>
				<TabView className='flex flex-col'>
					<TabPanel
						header={
							<span
								className={`sm:text-xl text-sm hover:text-gray-400 transition-all ease-linear duration-150 `}>
								Datos
							</span>
						}>
						<div className='flex flex-col gap-8'>
							<div className='grid grid-cols-[1fr_2fr] gap-x-2 gap-y-2 items-center justify-center'>
								{patientFields.map((field, index) => (
									<React.Fragment key={index}>
										<div className='flex justify-end'>
											<span>{field.label}:</span>
										</div>
										<div
											className={`flex justify-start rounded-xl w-5/6 ${
												isEditing
													? 'bg-white text-black'
													: 'bg-gray-200 text-gray-500 cursor-default'
											}`}>
											{isEditing ? (
												<input
													type='text'
													value={patient[field.key]}
													onChange={(e) =>
														setPatient({
															...patient,
															[field.key]: e.target.value,
														})
													}
													className='w-full rounded-xl px-2 py-1 border-2 border-black'
												/>
											) : (
												<span className='w-full rounded-xl px-2 py-1 border-2 border-black'>
													{field.value}
												</span>
											)}
										</div>
									</React.Fragment>
								))}
							</div>
							<div className='w-full flex justify-center'>
								<button
									className={` p-2 text-white font-semibold rounded w-2/6 transition-all duration-150 ease-linear ${
										isEditing
											? 'bg-green-500 hover:bg-green-600 active:bg-green-700'
											: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
									}`}
									onClick={isEditing ? handleSave : () => setIsEditing(true)}>
									{isEditing ? 'Guardar' : 'Editar'}
								</button>
							</div>
						</div>
					</TabPanel>
					<TabPanel
						header={
							<span
								className={`sm:text-xl text-sm hover:text-gray-400 transition-all ease-linear duration-150 `}>
								Odontograma
							</span>
						}>
						<div className='w-full flex justify-center items-center'>
							<TeethContainer patientId={id} />
						</div>
					</TabPanel>
					<TabPanel
						header={
							<span
								className={`sm:text-xl text-sm hover:text-gray-400 transition-all ease-linear duration-150 `}>
								Facturación
							</span>
						}>
						<div className='flex flex-col w-full justify-center items-center '>
							<div className='w-full flex justify-end pb-4'>
								<Button
									className='bg-green-500 text-white font-semibold hover:bg-green-600 active:bg-green-700 active:scale-95 transition-all duration-150 shadow-lg px-4 py-2 flex gap-4 rounded-xl'
									onClick={() => setPaymentModalVisible(true)}>
									Agregar Factura
								</Button>
							</div>
							<PatientBillsTable
								value={patient.bills}
								patient={patient}
							/>
						</div>
					</TabPanel>
				</TabView>
			</div>
			<PaymentModal
				visible={isPaymentModalVisible}
				onClose={handleModalClose}
				patient={patient}
			/>
		</div>
	);
};

export default PatientById;
