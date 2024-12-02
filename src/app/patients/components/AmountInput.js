'use client';

import { InputText } from 'primereact/inputtext';

import '../../styles/input.css';

const AmountInput = ({ value, setValue }) => {
	const handleInputChange = (value) => {
		setValue(value);
	};

	return (
		<div className='flex gap-2 items-center w-full justify-center'>
			<InputText
				value={value}
				type='number'
				disabled={true}
				onChange={(e) => handleInputChange(e.target.value)}
				className='outline-none border-2 px-2  py-2 rounded-lg w-3/6 text-end'
			/>
			<span className='w-1/6'>Importe</span>
		</div>
	);
};

export default AmountInput;
