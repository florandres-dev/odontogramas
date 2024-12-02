import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import '../../styles/input.css';

const TreatmentFormModal = ({ visible, onClose }) => {
	const [formData, setFormData] = useState({
		treatment_name: '',
		insurance_price: '',
		particular_price: '',
	});
	const [formInvalid, setFormInvalid] = useState(true);
	const [error, setError] = useState({
		message: 'Completa todos los campos',
		type: 'warning',
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = () => {
		postTreatment(formData);
		onClose();
	};

	useEffect(() => {
		if (
			formData.treatment_name.trim() === '' ||
			formData.insurance_price.trim() === '' ||
			formData.particular_price.trim() === ''
		) {
			setFormInvalid(true);
			setError({
				message: 'Completa todos los campos',
				type: 'error',
			});
			return;
		}

		setFormInvalid(false);

		if (Number(formData.insurance_price) > Number(formData.particular_price)) {
			setError({
				message: 'El precio con prepaga no debería ser mayor que el particular',
				type: 'warning',
			});
			return;
		}

		setError({
			message: '',
			type: '',
		});
	}, [formData]);

	const postTreatment = async (data) => {
		await fetch('/api/prices/new', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
	};

	const clearForm = () => {
		setFormData({
			treatment_name: '',
			insurance_price: '',
			particular_price: '',
		});
	};

	return (
		<Dialog
			header='Agregar Tratamiento'
			visible={visible}
			style={{ width: '30vw' }}
			breakpoints={{ '640px': '80vw' }}
			onHide={() => {
				onClose();
				clearForm();
			}}>
			<form className='flex flex-col gap-6'>
				<div className='flex flex-col gap-2'>
					<label
						className='font-semibold'
						htmlFor='treatment_name'>
						Nombre del tratamiento
					</label>
					<input
						type='text'
						name='treatment_name'
						value={formData.treatment_name}
						onChange={handleInputChange}
						className='p-2 border border-gray-300 rounded-md'
					/>
				</div>
				<div className='flex flex-col gap-2'>
					<label
						className='font-semibold'
						htmlFor='insurance_price'>
						Precio con prepaga
					</label>
					<input
						type='number'
						name='insurance_price'
						value={formData.insurance_price}
						onChange={handleInputChange}
						className='p-2 border border-gray-300 rounded-md'
					/>
				</div>
				<div className='flex flex-col gap-2'>
					<label
						className='font-semibold'
						htmlFor='particular_price'>
						Precio particular
					</label>
					<input
						type='number'
						name='particular_price'
						value={formData.particular_price}
						onChange={handleInputChange}
						className='p-2 border border-gray-300 rounded-md'
					/>
				</div>

				<div className='h-4'>
					{error.message && (
						<div className='flex gap-2 items-center text-sm'>
							<i
								className={`pi  ${
									error.type === 'warning'
										? 'text-yellow-500 pi-exclamation-triangle'
										: 'text-red-500 pi-exclamation-circle'
								}`}
							/>
							<span
								className={`${
									error.type === 'warning' ? 'text-yellow-500' : 'text-red-500'
								}`}>
								{error.message}
							</span>
						</div>
					)}
				</div>

				<div className='w-full flex justify-center items-center'>
					<Button
						label='Confirmar'
						disabled={formInvalid}
						icon='pi pi-check'
						onClick={handleSubmit}
						className=' bg-green-400 hover:bg-green-500 active:bg-green-600 px-4 py-2 rounded-lg text-white disabled:bg-gray-400 disabled:text-gray-100 '
					/>
				</div>
			</form>
		</Dialog>
	);
};

export default TreatmentFormModal;
