'use client';

import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import DateInput from './DateInput';
import AmountInput from './AmountInput';
import TreatmentSelect from './TreatmentSelect';
import PaidAmountInput from './PaidAmountInput';

const PaymentModal = ({ visible, onClose, patient }) => {
	const [date, setDate] = useState(null);
	const [value, setValue] = useState('');
	const [paidValue, setPaidValue] = useState('');
	const [treatment, setTreatment] = useState(null);
	const [treatmentList, setTreatmentList] = useState([]);
	const [insuranceCoverage, setInsuranceCoverage] = useState(false);
	const [formCompleted, setFormCompleted] = useState(false);

	const getTreatments = async () => {
		const apiUrl =
			process.env.NODE_ENV === 'production'
				? 'https://odontogramas.vercel.app/api/prices'
				: '/api/prices';

		const response = await fetch(apiUrl);
		const data = await response.json();
		setTreatmentList(data.data);
	};

	useEffect(() => {
		getTreatments();
	}, []);

	useEffect(() => {
		if (!treatment) return;

		if (insuranceCoverage) {
			setValue(treatment.insurance_price);
			return;
		}

		setValue(treatment.particular_price);
	}, [treatment, insuranceCoverage]);

	const checkForm = () => {
		if (!value) return false;
		if (paidValue === '') return false;
		if (!treatment) return false;
		if (!date) return false;
		return true;
	};

	useEffect(() => {
		setFormCompleted(checkForm());
	}, [value, paidValue, treatment, date]);

	const handlePayment = async () => {
		const apiUrl =
			process.env.NODE_ENV === 'production'
				? 'https://odontogramas.vercel.app/api/bills/new'
				: '/api/bills/new';

		const paymentData = {
			treatment: treatment,
			patient_id: patient._id,
			total_amount: value,
			paid_amount: paidValue,
		};

		try {
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(paymentData),
			});

			if (response.ok) {
				const result = await response.json();
				window.location.reload();
			} else {
				console.error('Error al registrar el pago:', response.statusText);
			}
		} catch (error) {
			console.error('Error de red:', error);
		}

		clearForm();
	};

	const clearForm = () => {
		setValue('');
		setPaidValue('');
		setDate(null);
		setTreatment(null);
		setInsuranceCoverage(false);
		setFormCompleted(false);
		onClose();
	};

	return (
		<Dialog
			visible={visible}
			onHide={onClose}
			style={{
				width: '450px',
			}}
			content={({ hide }) => (
				<div className='flex flex-col px-8 py-5 gap-4 bg-white items-center rounded-xl'>
					<span className='text-2xl'>Procesar Pago</span>
					<div className='text-xl flex gap-4 items-center'>
						<span>Paciente:</span>
						<span className='font-semibold'>{patient ? patient.name : ''}</span>
					</div>

					<TreatmentSelect
						treatment={treatment}
						setTreatment={setTreatment}
						treatmentList={treatmentList}
						insuranceCoverage={insuranceCoverage}
						setInsuranceCoverage={setInsuranceCoverage}
					/>
					<DateInput
						date={date}
						setDate={setDate}
					/>
					<AmountInput
						value={value}
						setValue={setValue}
					/>
					<PaidAmountInput
						value={paidValue}
						setValue={setPaidValue}
						maxValue={value}
					/>

					<div className='flex gap-8 mt-4 mb-2'>
						<Button
							label='Cancelar'
							icon='pi pi-times'
							onClick={clearForm}
							className='px-4 py-3 bg-red-400 hover:bg-red-500 active:bg-red-600 active:scale-95 transition-all duration-150 text-white font-semibold rounded-lg'
						/>
						<Button
							label='Aceptar'
							icon='pi pi-check'
							onClick={handlePayment}
							disabled={!formCompleted}
							className='px-4 py-3 bg-green-400 hover:bg-green-500 active:bg-green-600 active:scale-95 transition-all duration-150 text-white font-semibold rounded-lg'
						/>
					</div>
				</div>
			)}></Dialog>
	);
};

export default PaymentModal;
