'use client';

import React, { useEffect, useState } from 'react';
import UsersTable from './components/UsersTable';
import AddUser from './components/AddUser';

const AdminPanel = () => {
	const apiUrl =
		process.env.NODE_ENV === 'production'
			? 'https://odontogramas.vercel.app/api/users'
			: '/api/users/';

	const [users, setUsers] = useState([]);
	const [loadingUsers, setLoadingUsers] = useState(true);
	const [token, setToken] = useState('');

	const getUsers = async () => {
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		setLoadingUsers(false);
		setUsers(data.data);
	};

	useEffect(() => {
		const authToken = localStorage.getItem('token');

		if (!authToken) {
			window.location.href = '/login';
			return;
		}
		setToken(authToken);

		if (users.length === 0) {
			getUsers();
		}
	}, []);

	return (
		<div className='flex sm:flex-row flex-col  items-center justify-center h-full w-full sm:text-base text-sm'>
			<div className='sm:w-8/12 w-full flex flex-col gap-6 items-center justify-center h-full'>
				<div className='w-full gap-4 flex-col h-full sm:p-10 py-10 px-4 flex justify-center items-center'>
					<span className='sm:text-3xl text-xl'>Usuarios</span>
					<UsersTable
						value={users}
						loadingUsers={loadingUsers}
					/>
				</div>
			</div>
			<div className='sm:w-4/12 w-full sm:pr-10 flex justify-center items-center h-full'>
				<AddUser />
			</div>
		</div>
	);
};

export default AdminPanel;
