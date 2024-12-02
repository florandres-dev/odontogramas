'use client';

import { InputText } from 'primereact/inputtext';

import '../../styles/input.css';
import { useState } from 'react';

const PaidAmountInput = ({ value, setValue, maxValue = 0 }) => {
	const [checked, setChecked] = useState(false);

	const handleInputChange = (value) => {
		setValue(value);
	};

	const handleCheckboxChange = (e) => {
		setChecked(e.target.checked);
		setValue(e.target.checked ? maxValue : value);
	};

	return (
		<div className='flex flex-col gap-4 items-center w-full justify-center'>
			<div className='flex gap-2 items-center w-full justify-center'>
				<InputText
					value={!checked ? value : maxValue}
					type='number'
					disabled={checked}
					onChange={(e) => handleInputChange(e.target.value)}
					className='outline-none border-2 px-2  py-2 rounded-lg w-3/6 text-end'
				/>
				<span className='w-1/6'>Abonado</span>
			</div>
			<div className='w-full flex justify-center items-center gap-2'>
				<div className='w-3/6 justify-end items-center flex gap-2'>
					<input
						type='checkbox'
						onChange={(e) => handleCheckboxChange(e)}
						checked={checked}
						className='cursor-pointer'
						value={checked}
					/>
				</div>
				<div className='w-1/6'>
					<span>Total</span>
				</div>
			</div>
		</div>
	);
};

export default PaidAmountInput;
