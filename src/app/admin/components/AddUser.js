import LoadingOverlay from '@/app/components/LoadingOverlay';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tooltip } from 'primereact/tooltip';
import React, { useEffect, useState } from 'react';

const AddUser = () => {
	const [mail, setMail] = useState('');
	const [name, setName] = useState('');
	const [lastname, setLastname] = useState('');
	const [isAdmin, setIsAdmin] = useState(false);
	const [isFormValid, setIsFormValid] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		const checkForm = () => {
			const validName = name.length >= 3 && name.trim() !== '';
			const validLastname = lastname.length >= 3 && lastname.trim() !== '';
			const validMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);

			const errors = [];
			if (!validName) errors.push('Nombre inválido (3 caracteres mín.)');
			if (!validLastname) errors.push('Apellido inválido (3 caracteres mín.)');
			if (!validMail) errors.push('Email invalido. (Ej: nombre@dominio.com).');

			if (errors.length > 0) {
				setErrorMessage(errors.join('\n'));
				return false;
			}

			setErrorMessage('');
			return true;
		};
		setIsFormValid(checkForm());
	}, [mail, name, lastname]);

	const handleCreate = async () => {
		setIsLoading(true);
		const response = await fetch('/api/users/new', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				lastname,
				email: mail,
				password: '12345678',
				isAdmin,
			}),
		});

		if (!response.ok) {
			throw new Error('Error al crear usuario');
		}

		const data = await response.json();
		window.location.reload();
	};

	return (
		<div className='w-full flex flex-col gap-4 justify-center items-center p-4'>
			<div className='flex flex-col gap-6 justify-center items-center w-full bg-white py-6 shadow-lg rounded-xl'>
				<h2 className='text-2xl'>Agregar usuario</h2>
				<div className='w-4/6 flex flex-col gap-2 items-center'>
					<label
						htmlFor='name'
						className='text-start w-full font-medium text-gray-600'>
						* Nombre:
					</label>
					<InputText
						className='w-full border-2 rounded-lg px-2 py-1'
						placeholder='(Min. 3 caracteres)'
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div className='w-4/6 flex flex-col gap-2 items-center'>
					<label
						htmlFor='name'
						className='text-start w-full font-medium text-gray-600'>
						* Apellido:
					</label>
					<InputText
						className='w-full border-2 rounded-lg px-2 py-1'
						placeholder='(Min. 3 caracteres)'
						value={lastname}
						onChange={(e) => setLastname(e.target.value)}
					/>
				</div>
				<div className='w-4/6 flex flex-col gap-2 items-center'>
					<label
						htmlFor='name'
						className='text-start w-full font-medium text-gray-600'>
						* Email:
					</label>
					<InputText
						className='w-full border-2 rounded-lg px-2 py-1'
						placeholder='Ej. nombre@dominio.com'
						value={mail}
						onChange={(e) => setMail(e.target.value)}
					/>
				</div>
				<div className='w-4/6 justify-start '>
					<div
						className='flex gap-2 cursor-pointer w-fit'
						onClick={() => setIsAdmin(!isAdmin)}>
						<input
							type='checkbox'
							name='isAdmin'
							checked={isAdmin}
							className='w-4 cursor-pointer'
						/>
						<label
							htmlFor='isAdmin'
							className='cursor-pointer'>
							Administrador
						</label>
					</div>
				</div>

				<div className='w-full flex justify-center items-center'>
					<Tooltip
						target='.create-button'
						content={errorMessage}
						position='top'
					/>
					<div className='w-3/12 create-button'>
						<Button
							disabled={!isFormValid}
							className='bg-green-400 enabled:hover:bg-green-500 enabled:active:bg-green-600 w-full flex justify-center items-center font-semibold py-2 rounded-lg text-white shadow-md enabled:hover:shadow-black/30 gap-2'
							icon='pi pi-plus'
							onClick={() => handleCreate()}>
							Crear
						</Button>
					</div>
				</div>
			</div>
			<LoadingOverlay isLoading={isLoading} />
		</div>
	);
};

export default AddUser;
