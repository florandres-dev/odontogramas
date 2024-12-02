'use client';

import { useEffect, useState } from 'react';
import ChartsSection from './components/ChartsSection';
import HomeMenu from './components/HomeMenu';
import { patients } from '../data/patients';

export default function Home() {
	const [loadingPatients, setLoadingPatients] = useState(true);
	const [patientsData, setPatientsData] = useState({});

	const fetchPatients = async () => {
		const token = localStorage.getItem('token');

		if (!token) {
			window.location.href = '/login';
		}

		try {
			const response = await fetch('/api/patients/', {
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
		fetchPatients().then((patients) => {
			setPatientsData(patients);
		});
	}, []);

	return (
		<div className='flex items-center justify-center sm:h-full w-full flex-col sm:flex-row'>
			<HomeMenu
				patientsData={patientsData}
				loadingPatients={loadingPatients}
			/>
			<ChartsSection patients={patientsData} />
		</div>
	);
}
