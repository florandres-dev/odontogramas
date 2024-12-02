'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import '../../styles/input.css';
import { InputTextarea } from 'primereact/inputtextarea';
import DateInput from '../components/DateInput';
import TeethContainer from '../../components/TeethContainer';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import LoadingOverlay from '@/app/components/LoadingOverlay';
import Link from 'next/link';

const NewPatient = () => {
	const stepperRef = useRef(null);

	const router = useRouter();

	const [name, setName] = useState('');
	const [lastname, setLastname] = useState('');
	const [dni, setDni] = useState('');
	const [healthcare, setHealthcare] = useState('');
	const [code, setCode] = useState('');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');
	const [observations, setObservations] = useState('');
	const [date, setDate] = useState('');
	const [formCompleted, setFormCompleted] = useState(false);
	const [options, setOptions] = useState([]);
	const [dentalChart, setDentalChart] = useState([]);
	const [createdPatient, setCreatedPatient] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const apiUrl =
			process.env.NODE_ENV === 'production'
				? 'https://odontogramas.vercel.app/api/healthcare'
				: '/api/healthcare';

		const fetchHealthcare = async () => {
			const response = await fetch(apiUrl);
			const data = await response.json();
			setOptions(data.data);
		};
		fetchHealthcare();
	}, []);

	useEffect(() => {
		const isFormCompleted =
			name.length >= 3 &&
			lastname.length >= 3 &&
			dni.length >= 7 &&
			healthcare.trim() !== '' &&
			code.trim() !== '' &&
			phone.length >= 8 &&
			address.trim() !== '' &&
			date.trim() !== '';

		setFormCompleted(isFormCompleted);
	}, [name, lastname, healthcare, code, phone, address, date]);

	const handleCreate = async () => {
		setIsLoading(true);
		try {
			setCreatedPatient(true);
			await createPatient();
			setIsLoading(false);
			toast.success('Paciente creado exitosamente. Redirigiendo...');
			setTimeout(() => {
				router.push('/patients');
			}, 2500);
		} catch (error) {
			console.error('Error creating patient:', error);
			toast.error('Hubo un error: ', error.message);
		}
	};

	const createPatient = async () => {
		const apiUrl =
			process.env.NODE_ENV === 'production'
				? 'https://odontogramas.vercel.app/api/patients/new'
				: '/api/patients/new';

		await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: name + ' ' + lastname,
				insurance: formatString(healthcare),
				affiliate_number: code,
				dni,
				phone_number: phone,
				address,
				observations,
				birth_date: date,
				dental_chart: dentalChart,
			}),
		});
	};

	function formatString(input) {
		const newInput = input
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');

		return newInput;
	}

	return (
		<div className='flex items-center justify-center w-full h-full'>
			<Toaster richColors />

			<Stepper
				linear
				ref={stepperRef}
				style={{ flexBasis: '50rem' }}>
				<StepperPanel header='Datos'>
					<div className='flex flex-column h-12rem'>
						<div className='w-full flex flex-col sm:gap-4 gap-2 sm:items-center p-4  '>
							<InputText
								className='sm:w-3/6 5/6 border-2 rounded-xl px-2'
								placeholder='*Nombre (Min. 3 caracteres)'
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							<InputText
								className='sm:w-3/6 5/6 border-2 rounded-xl px-2'
								placeholder='*Apellido (Min. 3 caracteres)'
								value={lastname}
								onChange={(e) => setLastname(e.target.value)}
							/>
							<InputText
								className='sm:w-3/6 5/6 border-2 rounded-xl px-2'
								placeholder='*DNI'
								value={dni}
								onChange={(e) => setDni(e.target.value)}
							/>
							<Dropdown
								value={healthcare}
								options={options}
								onChange={(e) => setHealthcare(e.value)}
								placeholder='Prepaga'
								className='sm:w-3/6 5/6 border-2 rounded-xl px-2  '
							/>
							<InputText
								type='number'
								className='sm:w-3/6 5/6 border-2 rounded-xl px-2  '
								placeholder='Número de Socio'
								value={code}
								onChange={(e) => setCode(e.target.value)}
							/>
							<InputText
								type='number'
								className='sm:w-3/6 5/6 border-2 rounded-xl px-2  '
								placeholder='*Número de Teléfono (Min. 8 caracteres)'
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
							/>
							<InputText
								className='sm:w-3/6 5/6 border-2 rounded-xl px-2  '
								placeholder='Domicilio'
								value={address}
								onChange={(e) => setAddress(e.target.value)}
							/>
							<InputTextarea
								className='sm:w-3/6 5/6 border-2 rounded-xl px-2 sm:min-h-20 '
								placeholder='Observaciones Adicionales'
								value={observations}
								onChange={(e) => setObservations(e.target.value)}
							/>
							<div className='sm:w-3/6 5/6 text-center'>
								<span className='text-gray-400'>Fecha de nacimiento</span>
								<DateInput
									showDate={false}
									date={date}
									setDate={setDate}
								/>
							</div>
						</div>
					</div>
					<div className='flex pt-4 items-center justify-end gap-4'>
						<Link href='/patients'>
							<Button
								label='Volver'
								disabled={!formCompleted}
								icon='pi pi-arrow-left'
								iconPos='left'
								className='bg-gray-400 hover:bg-gray-500 active:bg-gray-600 active:scale-95 transition-all duration-150 text-white font-semibold rounded-lg px-4 py-2 shadow-lg'
							/>
						</Link>

						<Button
							label='Siguiente'
							disabled={!formCompleted}
							icon='pi pi-arrow-right'
							iconPos='right'
							className='bg-cyan-400 hover:bg-cyan-500 active:bg-cyan-600 active:scale-95 transition-all duration-150 text-white font-semibold rounded-lg px-4 py-2 shadow-lg'
							onClick={() => stepperRef.current.nextCallback()}
						/>
					</div>
				</StepperPanel>
				<StepperPanel header='Odontograma'>
					<div className='flex flex-column h-12rem'>
						<div className='border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium py-10 px-4'>
							<div className='flex flex-col gap-6 items-center justify-center'>
								<h2 className='text-3xl'>Odontograma</h2>
								<TeethContainer
									setNewDentalChart={setDentalChart}
									dentalChart={dentalChart}
								/>
							</div>
						</div>
					</div>
					<div className='flex pt-4 justify-between'>
						<Button
							label='Anterior'
							severity='secondary'
							icon='pi pi-arrow-left'
							onClick={() => stepperRef.current.prevCallback()}
							className='bg-cyan-400 hover:bg-cyan-500 active:bg-cyan-600 active:scale-95 transition-all duration-150 text-white font-semibold rounded-lg px-4 py-2 shadow-lg'
						/>
						<Button
							label='Confirmar y crear'
							disabled={createdPatient}
							icon='pi pi-plus'
							iconPos='left'
							onClick={() => handleCreate()}
							className='bg-green-400 hover:bg-green-500 active:bg-green-600 active:scale-95 transition-all duration-150 text-white font-semibold rounded-lg px-4 py-2 shadow-lg'
						/>
					</div>
				</StepperPanel>
			</Stepper>
			<LoadingOverlay isLoading={isLoading} />
		</div>
	);
};

export default NewPatient;
