'use client';

import LoadingOverlay from '@/app/components/LoadingOverlay';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { useState } from 'react';

const HomeButtons = () => {
	const [isLoading, setIsLoading] = useState(false);

	const handleLinkClick = () => {
		setIsLoading(true);
	};

	return (
		<div className='flex w-full justify-evenly sm:flex-row flex-col gap-2 sm:gap-0 mt-2 sm:my-0 items-center  '>
			<Link
				href={'/patients/new'}
				className='sm:w-3/12 w-5/6'
				onClick={handleLinkClick}>
				<Button className='rounded-xl sm:py-4 py-1 sm:px-4 px-1 bg-green-500 text-white font-bold flex sm:flex-col gap-1 sm:gap-0 justify-center shadow-lg hover:bg-green-600 active:bg-green-700 active:scale-100 transition-all duration-150 hover:shadow-2xl hover:scale-105 w-full'>
					<span>Agregar</span>
					<span>paciente</span>
				</Button>
			</Link>
			<Link
				href='/patients'
				className='sm:w-3/12 w-5/6'
				onClick={handleLinkClick}>
				<div className='w-full'>
					<Button className='rounded-xl sm:py-4 py-1 sm:px-4 px-1 bg-blue-500 text-white font-bold flex sm:flex-col gap-1 sm:gap-0 justify-center shadow-lg hover:bg-blue-600 active:bg-blue-700 active:scale-100 transition-all duration-150 hover:shadow-2xl hover:scale-105 w-full'>
						<span>Ver listado</span>
						<span>de pacientes</span>
					</Button>
				</div>
			</Link>
			<Link
				href='/prices'
				className='sm:w-3/12 w-5/6'
				onClick={handleLinkClick}>
				<Button className='rounded-xl sm:py-4 py-1 sm:px-4 px-1 bg-violet-500 text-white font-bold flex sm:flex-col gap-1 sm:gap-0 justify-center shadow-lg hover:bg-violet-600 active:bg-violet-700 active:scale-100 transition-all duration-150 hover:shadow-2xl hover:scale-105 w-full'>
					<span>Ver listado</span>
					<span>de tratamientos</span>
				</Button>
			</Link>
			<LoadingOverlay isLoading={isLoading} />
		</div>
	);
};

export default HomeButtons;
