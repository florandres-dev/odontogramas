'use client';
import { useEffect, useState } from 'react';
import PatientsTable from './components/PatientsTable';
import { Button } from 'primereact/button';
import Link from 'next/link';
import LoadingOverlay from '../components/LoadingOverlay';

const Patients = () => {
	const apiUrl =
		process.env.NODE_ENV === 'production'
			? 'https://odontogramas.vercel.app/api/patients'
			: '/api/patients/';

	const [filterName, setFilterName] = useState('');
	const [patients, setPatients] = useState([]);
	const [loadingPatients, setLoadingPatients] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	const handleLinkClick = () => {
		setIsLoading(true);
	};

	const fetchPatients = async () => {
		const token = localStorage.getItem('token');

		if (!token) {
			window.location.href = '/login';
		}

		try {
			const response = await fetch(apiUrl, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			setLoadingPatients(false);
			return data.data;
		} catch (error) {
			console.error('Error fetching patients:', error);
			setLoadingPatients(false);
			throw error;
		}
	};

	useEffect(() => {
		const token = localStorage.getItem('token');

		if (!token) {
			window.location.href = '/login';
		}
		const loadPatients = async () => {
			const newPatients = await fetchPatients();
			setPatients(newPatients);
		};
		loadPatients();
	}, []);

	const filterPatients = () => {
		if (!filterName) return patients;
		return patients.filter((patient) =>
			patient.name.toLowerCase().includes(filterName.toLowerCase())
		);
	};
	return (
		<div className='w-full flex flex-col items-center justify-start sm:pt-8 py-4 sm:gap-10 gap-4 h-full sm:text-base text-sm'>
			<h1 className='sm:text-3xl text-xl font-bold'>Pacientes</h1>
			<div className='flex items-center justify-between w-5/6 sm:flex-row flex-col-reverse sm:gap-0 gap-3'>
				<div className='flex items-center border border-gray-300 rounded-xl overflow-auto shadow-lg bg-white'>
					<span className='p-2'>
						<i className='pi pi-search' />
					</span>
					<input
						type='text'
						placeholder='Buscar'
						value={filterName}
						onChange={(e) => setFilterName(e.target.value)}
						className='p-2 w-full border-0 focus:outline-none'
					/>
				</div>
				<Link
					href='/patients/new'
					onClick={handleLinkClick}>
					<Button className='bg-green-500 text-white font-semibold hover:bg-green-600 active:bg-green-700 active:scale-95 transition-all duration-150 shadow-lg  p-2 flex gap-4 rounded-xl'>
						<i className='pi pi-plus' />
						Añadir paciente
					</Button>
				</Link>
			</div>
			<PatientsTable
				value={filterPatients(patients)}
				loadingPatients={loadingPatients}
			/>
			<LoadingOverlay isLoading={isLoading} />
		</div>
	);
};

export default Patients;
