'use client';

import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from 'react';

const TreatmentSelect = ({
	treatment,
	setTreatment,
	treatmentList,
	insuranceCoverage,
	setInsuranceCoverage,
}) => {
	const handleSelectedTreatment = (value) => {
		setTreatment(value);
	};

	return (
		<div className='flex flex-col gap-4 items-center w-full justify-center'>
			<div className='flex gap-2 items-center w-full justify-center'>
				<Dropdown
					value={treatment}
					onChange={(e) => handleSelectedTreatment(e.value)}
					options={treatmentList}
					optionLabel='treatment_name'
					className=' outline-none border-2 rounded-lg w-3/6 '
					checkmark={true}
					highlightOnSelect={false}
				/>

				<span className='w-1/6'>Tratamiento</span>
			</div>
			<div className='w-full flex justify-center items-center gap-2'>
				<div className='w-3/6 justify-end items-center flex gap-2'>
					<input
						type='checkbox'
						onChange={(e) => setInsuranceCoverage(e.target.checked)}
						checked={insuranceCoverage}
						className='cursor-pointer'
						value={insuranceCoverage}
					/>
				</div>
				<div className='w-1/6'>
					<span>Prepaga</span>
				</div>
			</div>
		</div>
	);
};

export default TreatmentSelect;
