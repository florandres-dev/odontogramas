'use client';

import React, { useEffect, useState } from 'react';
import PricesTable from './components/PricesTable';
import { Button } from 'primereact/button';
import TreatmentFormModal from './components/NewTreatmentModal';

const Prices = () => {
	const [isModalVisible, setModalVisible] = useState(false);

	const openModal = () => setModalVisible(true);
	const closeModal = () => setModalVisible(false);

	useEffect(() => {
		const token = localStorage.getItem('token');

		if (!token) {
			window.location.href = '/login';
		}
	}, []);

	return (
		<div className='flex flex-col items-center justify-start py-4 h-full w-full sm:text-base text-sm'>
			<h1 className='sm:text-3xl text-xl font-bold'>Precios</h1>
			<div className='w-full flex flex-col items-center justify-start pt-10 gap-4 h-full'>
				<div className='flex items-center justify-end w-5/6'>
					<Button
						className='bg-green-500 text-white font-semibold hover:bg-green-600 active:bg-green-700 active:scale-95 transition-all duration-150 shadow-lg px-6 py-2 flex gap-2 rounded-lg'
						onClick={openModal}
						icon='pi pi-plus'>
						<div>
							<span>Añadir</span>
						</div>
					</Button>
				</div>
				<PricesTable />
			</div>
			<TreatmentFormModal
				visible={isModalVisible}
				onClose={closeModal}
			/>
		</div>
	);
};

export default Prices;
