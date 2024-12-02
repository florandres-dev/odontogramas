'use client';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import LoadingOverlay from '../components/LoadingOverlay';

const Profile = () => {
	const [userInfo, setUserInfo] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [newPassword, setNewPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = async () => {
		setIsEditing(false);
		setIsLoading(true);

		setUserInfo({ ...userInfo, password: newPassword });

		const response = await fetch(`/api/users/${userInfo.public_id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				updatedUser: { ...userInfo, password: newPassword },
			}),
		});

		if (response.ok) {
			updateUserInfo();
			toast.success('Cambios guardados');
		} else {
			toast.error('Error al guardar cambios');
		}
		setIsLoading(false);
	};

	const updateUserInfo = async () => {
		const response = await fetch(`/api/users/${userInfo.public_id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (response.ok) {
			const user = await response.json();
			console.log(user.data);
			setUserInfo(user.data);
			localStorage.setItem('user', JSON.stringify(user.data));
		} else {
			toast.error('Error al actualizar usuario');
		}
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		if (name === 'password') {
			setNewPassword(value);
			return;
		}
		setUserInfo({ ...userInfo, [name]: value });
	};

	useEffect(() => {
		const token = localStorage.getItem('token');

		const user = JSON.parse(localStorage.getItem('user'));
		if (!token || !user) {
			window.location.href = '/login';
		}

		setUserInfo(user);
	}, []);

	return (
		<div className='h-full w-full flex justify-center items-center'>
			<div className='w-3/6 bg-white rounded-xl shadow-lg h-fit flex flex-col justify-center items-center gap-4 py-10'>
				<span className='text-2xl mb-6'>Mi cuenta</span>
				<div className='flex gap-2 w-4/6 justify-center items-center'>
					<span className='w-1/6 text-end'>Rol: </span>
					{userInfo !== null ? (
						<InputText
							value={userInfo.isAdmin ? 'Administrador' : 'Usuario'}
							disabled
							className='p-2 w-5/6 bg-gray-200'
						/>
					) : (
						<span>Cargando...</span>
					)}
				</div>
				<div className='flex gap-2 w-4/6 justify-center items-center'>
					<span className='w-1/6 text-end'>Nombre: </span>
					{userInfo !== null ? (
						<InputText
							onChange={handleChange}
							name='name'
							value={userInfo.name}
							disabled={!isEditing}
							className='p-2 w-5/6 bg-gray-200'
						/>
					) : (
						<span>Cargando...</span>
					)}
				</div>
				<div className='flex gap-2 w-4/6 justify-center items-center'>
					<span className='w-1/6 text-end'>Apellido: </span>
					{userInfo !== null ? (
						<InputText
							onChange={handleChange}
							name='lastname'
							value={userInfo.lastname}
							disabled={!isEditing}
							className='p-2 w-5/6 bg-gray-200'
						/>
					) : (
						<span>Cargando...</span>
					)}
				</div>
				<div className='flex gap-2 w-4/6 justify-center items-center'>
					<span className='w-1/6 text-end'>Email: </span>
					{userInfo !== null ? (
						<InputText
							onChange={handleChange}
							name='email'
							value={userInfo.email}
							disabled={!isEditing}
							className='p-2 w-5/6 bg-gray-200'
						/>
					) : (
						<span>Cargando...</span>
					)}
				</div>
				<div className='flex gap-2 w-4/6 justify-center items-center'>
					<span className='w-1/6 text-end'>Contraseña: </span>
					{userInfo !== null ? (
						<InputText
							onChange={handleChange}
							name='password'
							value={!isEditing ? '*********' : newPassword}
							disabled={!isEditing}
							className='p-2 w-5/6 bg-gray-200'
						/>
					) : (
						<span>Cargando...</span>
					)}
				</div>
				{!isEditing ? (
					<Button
						className='py-2 px-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-lg text-white font-medium shadow-lg '
						onClick={handleEdit}>
						Editar Datos
					</Button>
				) : (
					<Button
						className='py-2 px-4 bg-green-500 hover:bg-green-600 active:bg-green-700 rounded-lg text-white font-medium shadow-lg '
						onClick={handleSave}>
						Guardar Datos
					</Button>
				)}
			</div>
			<LoadingOverlay isLoading={isLoading} />
			<Toaster richColors={true} />
		</div>
	);
};

export default Profile;
