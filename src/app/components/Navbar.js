'use client';

import { Menubar } from 'primereact/menubar';
import React, { useEffect, useState, useRef } from 'react';
import navbarItems from '../data/navbar';
import { useAuth } from '../context/AuthContext';
import { getFirstLetter } from '../utils/functions';
import MessageModal from './MessageModal';

const Navbar = () => {
	const { isLoggedIn } = useAuth();

	const menuRef = useRef(null);
	const profileRef = useRef(null);

	const [menuItems, setMenuItems] = useState(navbarItems);
	const [userInfo, setUserInfo] = useState(null);
	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const logoutTitle = 'Cerrar sesión';
	const logoutMessage =
		'¿Estás segur@ de que quieres cerrar sesión? Tendrás que volver a iniciar sesión para poder acceder a tus datos.';

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('user'));

		if (!user) {
			return;
		}

		setUserInfo(user);

		if (user.isAdmin) {
			setMenuItems([
				...navbarItems,
				{
					label: 'Admin',
					icon: 'pi pi-cog',
					url: '/admin',
				},
			]);
		}
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setIsProfileMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	if (!isLoggedIn) {
		return null;
	}

	const profileTemplate = () => {
		if (!userInfo) {
			return null;
		}
		return (
			<div
				className='relative'
				ref={menuRef}>
				<div
					className='px-3 py-2 flex justify-center items-center rounded-full bg-gray-200 text-gray-600 font-semibold hover:bg-gray-300 cursor-pointer'
					onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
					{getFirstLetter(userInfo.name)}
					{getFirstLetter(userInfo.lastname)}
				</div>
				{isProfileMenuOpen && (
					<Menubar
						className='absolute bg-white right-0 w-48 shadow-lg rounded-lg'
						model={[
							{
								label: 'Perfil',
								icon: 'pi pi-user',
								url: '/profile',
								className: 'w-full',
							},
							{
								label: 'Cerrar sesión',
								icon: 'pi pi-sign-out',
								className: 'w-full',
								command: () => setIsModalOpen(true),
							},
						]}
					/>
				)}
			</div>
		);
	};

	return (
		<div className='fixed top-0 left-0 w-full h-14 shadow-lg z-50'>
			<Menubar
				className='w-full h-full'
				model={menuItems}
				end={profileTemplate()}
			/>
			<MessageModal
				title={logoutTitle}
				message={logoutMessage}
				visible={isModalOpen}
				onHide={() => setIsModalOpen(false)}
				onConfirm={() => {
					localStorage.removeItem('user');
					localStorage.removeItem('token');
					window.location.reload();
				}}
			/>
		</div>
	);
};

export default Navbar;
