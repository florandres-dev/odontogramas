'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import ConfirmDeleteModal from './DeleteTreatmentModal';
import LoadingOverlay from '@/app/components/LoadingOverlay';

const PricesTable = () => {
	const [loadingPrices, setLoadingPrices] = useState(true);
	const [prices, setPrices] = useState([]);
	const [isEditing, setIsEditing] = useState(false);
	const [editingPrice, setEditingPrice] = useState(null);
	const [priceToDelete, setPriceToDelete] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);

	const fetchPrices = async () => {
		try {
			const response = await fetch('/api/prices');
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			console.log(data.data);
			return data.data;
		} catch (error) {
			console.error('Error fetching prices:', error);
			throw error;
		}
	};

	useEffect(() => {
		const loadPrices = async () => {
			const newPrices = await fetchPrices();
			setPrices(newPrices);
			setLoadingPrices(false);
		};
		loadPrices();
	}, []);

	const handleEdit = (rowData) => {
		setEditingPrice(rowData);
		setIsEditing(true);
	};

	const handleSave = async () => {
		setIsLoadingOverlay(true);

		try {
			const response = await fetch(`/api/prices/${editingPrice.treatment_id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(editingPrice),
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
			setIsLoadingOverlay(false);
		}

		setIsEditing(false);
	};

	const handleDelete = async () => {
		await fetch(`/api/prices/${priceToDelete.treatment_id}`, {
			method: 'DELETE',
		});
		window.location.reload();
		setShowDeleteModal(false);
		setPriceToDelete(null);
	};

	const actionTemplate = (rowData) => {
		if (isEditing && editingPrice.treatment_id === rowData.treatment_id)
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
		else
			return (
				<div className='flex gap-4'>
					<Button
						tooltip='Editar'
						tooltipOptions={{ position: 'top' }}
						icon='pi pi-pencil'
						className='bg-blue-400 hover:bg-blue-500 active:bg-blue-600 px-2 py-1 rounded-lg text-white '
						onClick={() => handleEdit(rowData)}
					/>
					<Button
						tooltip='Eliminar'
						tooltipOptions={{ position: 'top' }}
						icon='pi pi-trash'
						className='bg-red-400 hover:bg-red-500 active:bg-red-600 px-2 py-1 rounded-lg text-white '
						onClick={() => {
							setPriceToDelete(rowData);
							setShowDeleteModal(true);
						}}
					/>
				</div>
			);
	};

	const treatmentNameTemplate = (rowData) => {
		if (isEditing && editingPrice.treatment_id === rowData.treatment_id) {
			return (
				<InputText
					value={editingPrice.treatment_name}
					onChange={(e) =>
						setEditingPrice({ ...editingPrice, treatment_name: e.target.value })
					}
					className='w-full border-2 rounded px-2 '
				/>
			);
		}
		return <span>{rowData.treatment_name}</span>;
	};

	const insurancePriceTemplate = (rowData) => {
		if (isEditing && editingPrice.treatment_id === rowData.treatment_id) {
			return (
				<InputText
					type='number'
					value={editingPrice.insurance_price}
					onChange={(e) =>
						setEditingPrice({
							...editingPrice,
							insurance_price: e.target.value,
						})
					}
					className='w-full border-2 rounded px-2 '
				/>
			);
		}
		return (
			<span>
				{new Intl.NumberFormat('es-AR', {
					style: 'currency',
					currency: 'ARS',
				}).format(rowData.insurance_price)}
			</span>
		);
	};

	const particularPriceTemplate = (rowData) => {
		if (isEditing && editingPrice.treatment_id === rowData.treatment_id) {
			return (
				<InputText
					type='number'
					value={editingPrice.particular_price}
					onChange={(e) =>
						setEditingPrice({
							...editingPrice,
							particular_price: e.target.value,
						})
					}
					className='w-full border-2 rounded px-2 '
				/>
			);
		}
		return (
			<span>
				{new Intl.NumberFormat('es-AR', {
					style: 'currency',
					currency: 'ARS',
				}).format(rowData.particular_price)}
			</span>
		);
	};

	return (
		<div className='w-5/6 h-auto shadow-lg rounded-xl overflow-auto border-2'>
			<DataTable
				value={prices}
				stripedRows
				removableSort
				paginator
				rows={5}
				size='small'
				emptyMessage={
					loadingPrices ? 'Cargando precios...' : 'No se encontraron resultados'
				}
				tableStyle={{ minWidth: '80vw' }}>
				<Column
					sortable
					field='treatment_name'
					header='Tratamiento'
					style={{ width: '40%' }}
					body={treatmentNameTemplate}></Column>
				<Column
					field='insurance_price'
					header='Precio c/ prepaga'
					style={{ width: '20%' }}
					body={insurancePriceTemplate}></Column>
				<Column
					field='particular_price'
					header='Precio particular'
					style={{ width: '20%' }}
					body={particularPriceTemplate}></Column>
				<Column
					header='Acciones'
					style={{ width: '10%' }}
					body={actionTemplate}></Column>
			</DataTable>
			<ConfirmDeleteModal
				visible={showDeleteModal}
				onHide={() => setShowDeleteModal(false)}
				onConfirm={handleDelete}
				itemName={
					priceToDelete ? `Tratamiento ${priceToDelete.treatment_name}` : ''
				}
			/>
			<LoadingOverlay isLoading={isLoadingOverlay} />
		</div>
	);
};

export default PricesTable;
