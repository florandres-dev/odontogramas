'use client';

import React, { useEffect, useState } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';
import { toast, Toaster } from 'sonner';

const LoginForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await fetch('/api/auth/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});

			if (!response.ok) {
				setIsLoading(false);
				if (response.status === 401 || response.status === 404) {
					toast.error('Correo o contraseña incorrectos');
					throw new Error(`Something went wrong`);
				} else {
					toast.error('Error al iniciar sesión');
					throw new Error(`Something went wrong`);
				}
			}

			const data = await response.json();

			setLoaded(true);
			setIsLoading(false);
			localStorage.setItem('token', data.token);

			localStorage.setItem('user', JSON.stringify(data.user));
			toast.success('Sesión iniciada correctamente. Redireccionando...');
			window.location.href = '/home';
		} catch (error) {
			setIsLoading(false);
		}
	};

	return (
		<div className='flex items-center justify-center h-full bg-slate-100 -mt-14'>
			<form
				onSubmit={handleSubmit}
				className='bg-white p-6 rounded shadow-md w-96'>
				<h2 className='text-2xl font-bold mb-4 text-center'>Bienvenido/a</h2>
				<div className='mb-4'>
					<label
						className='block text-sm font-medium text-gray-700'
						htmlFor='email'>
						Correo Electrónico
					</label>
					<input
						type='email'
						id='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className='mt-1 p-2 border border-gray-300 rounded w-full'
					/>
				</div>
				<div className='mb-4'>
					<label
						className='block text-sm font-medium text-gray-700'
						htmlFor='password'>
						Contraseña
					</label>
					<div className='flex border border-gray-300 rounded'>
						<input
							type={showPassword ? 'text' : 'password'}
							id='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className='p-2 w-full border-r border-gray-300'
						/>
						<button
							type='button'
							onClick={() => setShowPassword(!showPassword)}
							className='flex items-center justify-center px-2 hover:bg-gray-100 transition duration-200'>
							<i
								className={`pi ${
									showPassword ? 'pi-eye-slash' : 'pi-eye'
								}`}></i>
						</button>
					</div>
				</div>
				<button
					disabled={loaded}
					type='submit'
					className='w-full bg-blue-600 disabled:opacity-50 text-white p-2 rounded enabled:hover:bg-blue-700 transition duration-200'>
					Iniciar Sesión
				</button>
			</form>
			<LoadingOverlay isLoading={isLoading} />
			<Toaster richColors={true} />
		</div>
	);
};

export default LoginForm;
