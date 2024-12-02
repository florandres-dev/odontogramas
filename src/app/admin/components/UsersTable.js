'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useState } from 'react';
import LoadingOverlay from '@/app/components/LoadingOverlay.js';
import MessageModal from '@/app/components/MessageModal';
import { toast, Toaster } from 'sonner';

const UsersTable = ({ value, loadingUsers }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [modal, setModal] = useState({
		message: <></>,
		title: '',
		function: () => {},
	});

	const handleEdit = (rowData) => {
		setEditingUser(rowData);
		setIsEditing(true);
	};

	const handleSave = async () => {
		setIsLoading(true);

		const updatedUser = {
			...editingUser,
			name: editingUser.name,
			lastname: editingUser.lastname,
			email: editingUser.email,
			password: editingUser.password,
			isAdmin: editingUser.isAdmin,
		};

		try {
			const response = await fetch(`/api/users/${updatedUser.public_id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ updatedUser }),
			});

			if (response.ok) {
				const result = await response.json();
				window.location.reload();
			} else {
				console.error('Error al actualizar usuario:', response.statusText);
			}
		} catch (error) {
			console.error('Error de red:', error);
		} finally {
			setIsLoading(false);
		}

		setIsEditing(false);
	};

	const handleRoleChange = (rowData) => {
		const updateUser = async (id, isAdmin) => {
			setShowModal(false);
			setIsLoading(true);
			const updatedUser = { ...rowData, isAdmin };
			const response = await fetch(`/api/users/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ updatedUser }),
			});

			if (response.ok) {
				const result = await response.json();
				window.location.reload();
			} else {
				console.error('Error actualizando el usuario:', response.statusText);
			}
		};

		setModal({
			title: 'Cambiar rol',
			message: (
				<>
					¿Estás seguro de que quieres{' '}
					<strong>
						{rowData.isAdmin ? 'quitar' : 'añadir'} el rol de administrador
					</strong>{' '}
					a{' '}
					<strong>
						{rowData.name} {rowData.lastname}
					</strong>
					? Esta acción no se puede deshacer.
				</>
			),
			function: () => updateUser(rowData.public_id, !rowData.isAdmin),
		});
		setShowModal(true);
	};

	const handleDelete = async (rowData) => {
		const deleteUser = async (id) => {
			setShowModal(false);
			setIsLoading(true);
			const response = await fetch(`/api/users/${id}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				const result = await response.json();
				window.location.reload();
			} else {
				console.error('Error eliminando el usuario:', response.statusText);
			}
		};

		setModal({
			title: 'Eliminar usuario',
			message: (
				<>
					¿Estás seguro de que quieres eliminar a{' '}
					<strong>
						{rowData.name} {rowData.lastname}
					</strong>
					? Esta acción no se puede deshacer.
				</>
			),
			function: () => deleteUser(rowData.public_id),
		});
		setShowModal(true);
	};

	const handleResetPassword = async (rowData) => {
		const resetPassword = async (id) => {
			setShowModal(false);
			setIsLoading(true);

			const response = toast.promise(
				fetch(`/api/users/${id}/reset-password`, {
					method: 'POST',
				}),
				{
					loading: 'Reiniciando contraseña...',
					success: () => {
						setIsLoading(false);
						return 'Contraseña reiniciada correctamente';
					},
					error: () => {
						setIsLoading(false);
						console.error(
							'Error reiniciando la contraseña:',
							response.statusText
						);
						return 'Error al reiniciar la contraseña';
					},
				}
			);
		};

		setModal({
			title: 'Reiniciar contraseña',
			message: (
				<>
					¿Estás seguro de que quieres reiniciar la contraseña de a{' '}
					<strong>
						{rowData.name} {rowData.lastname}
					</strong>
					? Esta acción no se puede deshacer.
				</>
			),
			function: () => resetPassword(rowData.public_id),
		});
		setShowModal(true);
	};

	const nameTemplate = (rowData) => {
		if (isEditing && rowData.public_id === editingUser.public_id) {
			return (
				<input
					type='text'
					value={editingUser.name}
					onChange={(e) =>
						setEditingUser({ ...editingUser, name: e.target.value })
					}
					className='w-full rounded-xl px-2 py-1 border-2 border-black'
				/>
			);
		}

		return <span>{rowData.name}</span>;
	};

	const lastnameTemplate = (rowData) => {
		if (isEditing && rowData.public_id === editingUser.public_id) {
			return (
				<input
					type='text'
					value={editingUser.lastname}
					onChange={(e) =>
						setEditingUser({ ...editingUser, lastname: e.target.value })
					}
					className='w-full rounded-xl px-2 py-1 border-2 border-black'
				/>
			);
		}

		return <span>{rowData.lastname}</span>;
	};

	const emailTemplate = (rowData) => {
		if (isEditing && rowData.public_id === editingUser.public_id) {
			return (
				<input
					type='text'
					value={editingUser.email}
					onChange={(e) =>
						setEditingUser({ ...editingUser, email: e.target.value })
					}
					className='w-full rounded-xl px-2 py-1 border-2 border-black'
				/>
			);
		}

		return <span>{rowData.email}</span>;
	};

	const actionTemplate = (rowData) => {
		if (isEditing && rowData.public_id === editingUser.public_id) {
			return (
				<div className='flex gap-4'>
					<Button
						tooltip='Guardar'
						tooltipOptions={{ position: 'top' }}
						icon='pi pi-check'
						className='bg-green-400 hover:bg-green-500 active:bg-green-600 px-3 py-1 rounded-lg text-white shadow-md hover:shadow-black/30 '
						onClick={() => handleSave()}
					/>
					<Button
						tooltip='Cancelar'
						tooltipOptions={{ position: 'top' }}
						icon='pi pi-times'
						className='bg-gray-400 hover:bg-gray-500 active:bg-gray-600 px-3 py-1 rounded-lg text-white shadow-md hover:shadow-black/30 '
						onClick={() => setIsEditing(false)}
					/>
				</div>
			);
		}
		return (
			<div className='flex gap-4'>
				<Button
					icon='pi pi-user'
					tooltip={`${rowData.isAdmin ? 'Quitar' : 'Añadir'} rol administrador`}
					tooltipOptions={{ position: 'top' }}
					className={`${
						rowData.isAdmin
							? 'bg-green-400 hover:bg-green-500 active:bg-green-600'
							: 'bg-gray-400 hover:bg-gray-500 active:bg-gray-600'
					} px-3 py-1 rounded-lg text-white shadow-md hover:shadow-black/30 `}
					onClick={() => handleRoleChange(rowData)}
				/>
				<Button
					tooltip='Editar'
					tooltipOptions={{ position: 'top' }}
					icon='pi pi-pencil'
					className='bg-blue-400 hover:bg-blue-500 active:bg-blue-600 px-3 py-1 rounded-lg text-white shadow-md hover:shadow-black/30 '
					onClick={() => handleEdit(rowData)}
				/>

				<Button
					tooltip='Reiniciar contraseña'
					tooltipOptions={{ position: 'top' }}
					icon='pi pi-refresh'
					className='bg-purple-400 hover:bg-purple-500 active:bg-purple-600 px-3 py-1 rounded-lg text-white shadow-md hover:shadow-black/30 '
					onClick={() => handleResetPassword(rowData)}
				/>
				<Button
					tooltip='Eliminar'
					tooltipOptions={{ position: 'top' }}
					icon='pi pi-trash'
					className='bg-red-400 hover:bg-red-500 active:bg-red-600 px-2 py-1 rounded-lg text-white shadow-md hover:shadow-black/30 '
					onClick={() => handleDelete(rowData)}
				/>
			</div>
		);
	};

	return (
		<div className='mx-2 h-auto shadow-lg rounded-xl overflow-auto border-2 w-full'>
			<DataTable
				emptyMessage={
					loadingUsers ? 'Cargando Usuarios...' : 'No se encontraron resultados'
				}
				value={value}
				showGridlines
				stripedRows
				removableSort
				paginator
				rows={5}
				size='small'
				tableStyle={{ minWidth: '20rem' }}>
				<Column
					sortable
					field='name'
					header='Nombre'
					style={{ width: '20%' }}
					body={nameTemplate}
				/>
				<Column
					sortable
					field='lastname'
					header='Apellido'
					style={{ width: '20%' }}
					body={lastnameTemplate}
				/>
				<Column
					sortable
					field='email'
					header='Mail'
					style={{ width: '25%' }}
					body={emailTemplate}
				/>
				<Column
					header='Acciones'
					style={{ width: '25%' }}
					body={actionTemplate}
				/>
			</DataTable>

			<LoadingOverlay isLoading={isLoading} />
			<MessageModal
				visible={showModal}
				onHide={() => setShowModal(false)}
				onConfirm={modal.function}
				title={modal.title}
				message={modal.message}
			/>
			<Toaster
				duration={3000}
				richColors
			/>
		</div>
	);
};

export default UsersTable;
