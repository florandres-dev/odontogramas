'use client';

import { useEffect, useState } from 'react';
import HomeButtons from './HomeButtons';

const HomeMenu = ({ patientsData = {}, loadingPatients }) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const storedUser = JSON.parse(localStorage.getItem('user'));
		setUser(storedUser);
	}, []);

	return (
		<div className='sm:w-7/12 h-full sm:p-20 p-6 flex flex-col items-center sm:justify-start justify-center sm:gap-20 gap-8 w-full'>
			{user !== null && (
				<h1 className='sm:text-4xl text-2xl'>
					Bienvenid@, {user.name} {user.lastname}
				</h1>
			)}
			<div className='bg-white h-3/6 mx-10 w-full rounded-xl p-4 flex flex-col sm:justify-start justify-center shadow-lg'>
				<div className='flex w-full justify-center items-center gap-6'>
					<span className='sm:text-2xl text-lg'>Pacientes actuales:</span>
					<span
						className={` ${
							loadingPatients ? 'animate-pulse' : 'sm:text-3xl text-xl'
						}`}>
						{loadingPatients ? 'Cargando...' : patientsData.length}
					</span>
				</div>
				<div className='w-full h-full flex items-center'>
					<HomeButtons />
				</div>
			</div>
		</div>
	);
};

export default HomeMenu;
