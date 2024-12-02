'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useState } from 'react';
import { Toaster } from 'sonner';
import '../../../styles/input.css';
import { Tooltip } from 'primereact/tooltip';
import LoadingOverlay from '@/app/components/LoadingOverlay';
import MessageModal from '../../../components/MessageModal';

const PatientBillsTable = ({ value, patient }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editingBill, setEditingBill] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [deleteMessage, setDeleteMessage] = useState(<></>);

	const treatmentNameTemplate = (rowData) => {
		return (
			<span className='block truncate max-w-full'>
				{rowData.treatment.treatment_name}
			</span>
		);
	};

	const paidAmountTemplate = (rowData) => {
		if (isEditing && editingBill._id === rowData._id) {
			return (
				<input
					type='number'
					value={editingBill.paid_amount}
					onChange={(e) =>
						setEditingBill({
							...editingBill,
							paid_amount: e.target.value,
						})
					}
					className='w-full border-2 rounded px-2 '
				/>
			);
		}

		return <span>{rowData.paid_amount}</span>;
	};

	const totalAmountTemplate = (rowData) => {
		return <span>{rowData.total_amount}</span>;
	};

	const remainingAmountTemplate = (rowData) => {
		let sign = '';
		if (rowData.remaining_amount > 0) {
			sign = '- ';
		}
		let color = 'text-green-500';
		if (rowData.status === 'partially_paid') {
			color = 'text-yellow-500';
		}
		if (rowData.status === 'unpaid') {
			color = 'text-red-500';
		}

		return (
			<>
				<span
					id={`remainingAmount-${rowData.id}`}
					className={`font-semibold ${color}`}>
					{sign}${Math.abs(rowData.remaining_amount)}
				</span>
				<Tooltip
					target={`#remainingAmount-${rowData.id}`}
					position='top'
					content={`${
						rowData.remaining_amount == 0
							? 'Pagado'
							: `Debe $${rowData.remaining_amount}`
					}`}
				/>
			</>
		);
	};

	const handleEdit = (rowData) => {
		setEditingBill(rowData);
		setIsEditing(true);
	};

	const handleSave = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`/api/bills/${editingBill._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(editingBill),
			});

			if (response.ok) {
				const result = await response.json();
				window.location.reload();
			} else {
				console.error('Error al registrar el pago:', response.statusText);
			}
		} catch (error) {
			console.error('Error de red:', error);
		} finally {
			setIsLoading(false);
		}

		setIsEditing(false);
	};

	const handleDelete = async () => {
		await fetch(`/api/bills/${editingBill._id}`, {
			method: 'DELETE',
		});
		window.location.reload();
		setShowDeleteModal(false);
		setEditingBill(null);
	};

	const actionTemplate = (rowData) => {
		if (isEditing && editingBill._id === rowData._id)
			return (
				<div className='flex gap-4'>
					<Button
						tooltip='Guardar'
						tooltipOptions={{ position: 'top' }}
						icon='pi pi-check'
						className='bg-green-400 hover:bg-green-500 active:bg-green-600 px-2 py-1 rounded-lg text-white '
						onClick={() => handleSave()}
					/>
					<Button
						tooltip='Cancelar'
						tooltipOptions={{ position: 'top' }}
						icon='pi pi-times'
						className='bg-gray-400 hover:bg-gray-500 active:bg-gray-600 px-2 py-1 rounded-lg text-white '
						onClick={() => setIsEditing(false)}
					/>
				</div>
			);

		return (
			<div className='flex gap-4'>
				<Button
					icon='pi pi-pencil'
					className='bg-blue-400 hover:bg-blue-500 active:bg-blue-600 px-2 py-1 rounded-lg text-white '
					tooltip='Editar'
					tooltipOptions={{ position: 'top' }}
					onClick={() => handleEdit(rowData)}
				/>
				<Button
					icon='pi pi-trash'
					className='bg-red-400 hover:bg-red-500 active:bg-red-600 px-2 py-1 rounded-lg text-white '
					tooltip='Eliminar'
					tooltipOptions={{ position: 'top' }}
					onClick={() => {
						setEditingBill(rowData);
						handleMessageChange();
						setShowDeleteModal(true);
					}}
				/>
			</div>
		);
	};

	const handleMessageChange = () => {
		setDeleteMessage(
			<>
				¿Estás seguro de que quieres eliminar la factura{' '}
				<strong>
					{editingBill ? editingBill.treatment.treatment_name : ''}
				</strong>{' '}
				del paciente <strong>{patient.name}</strong>? Esta acción no se puede
				deshacer.
			</>
		);
	};

	return (
		<div className='w-full h-auto shadow-lg rounded-xl overflow-auto border-2'>
			<DataTable
				value={value}
				showGridlines
				stripedRows
				removableSort
				paginator
				rows={5}>
				<Column
					sortable
					field='treatment.treatment_name'
					header='Tratamiento'
					style={{ width: '20%' }}
					body={treatmentNameTemplate}></Column>
				<Column
					field='paid_amount'
					header='Pagado'
					style={{ width: '15%' }}
					body={paidAmountTemplate}></Column>
				<Column
					field='total_amount'
					header='Total'
					style={{ width: '15%' }}
					body={totalAmountTemplate}></Column>
				<Column
					field='remaining_amount'
					header='Estado'
					style={{ width: '15%' }}
					body={remainingAmountTemplate}></Column>
				<Column
					header='Acciones'
					style={{ width: '35%' }}
					body={actionTemplate}></Column>
			</DataTable>

			<MessageModal
				visible={showDeleteModal}
				onHide={() => setShowDeleteModal(false)}
				onConfirm={handleDelete}
				bill={editingBill ? editingBill.treatment.treatment_name : ''}
				patientName={patient.name}
				message={deleteMessage}
				title={'Eliminar Factura'}
			/>

			<Toaster richColors />
			<LoadingOverlay isLoading={isLoading} />
		</div>
	);
};

export default PatientBillsTable;
