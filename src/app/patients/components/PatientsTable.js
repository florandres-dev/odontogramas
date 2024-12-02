'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useState } from 'react';
import PaymentModal from './PaymentModal.js';
import Link from 'next/link.js';
import LoadingOverlay from '@/app/components/LoadingOverlay.js';

const PatientsTable = ({ value, loadingPatients }) => {
	const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
	const [selectedPatient, setSelectedPatient] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleLinkClick = () => {
		setIsLoading(true);
	};

	const stateTemplate = (rowData) => {
		function sumRemainingAmount(invoices) {
			if (!Array.isArray(invoices) || invoices.length === 0) {
				return 0;
			}

			return invoices.reduce((total, invoice) => {
				return total + (invoice.remaining_amount || 0);
			}, 0);
		}

		const state = sumRemainingAmount(rowData.bills);

		let cellStyle = {
			color: 'black',
			fontWeight: 'bold',
		};
		let sign = '';

		if (state > 0) {
			cellStyle.color = 'red';
			sign = '- ';
		} else {
			cellStyle.color = 'green';
		}

		if (state < 0) {
			sign = '+ ';
		}

		return (
			<span style={cellStyle}>
				{sign}${Math.abs(state)}
			</span>
		);
	};

	const actionTemplate = (rowData) => {
		return (
			<div className='flex gap-4'>
				<Link
					href={`/patients/${rowData.public_id}`}
					onClick={handleLinkClick}>
					<Button
						label='Ver'
						icon='pi pi-search'
						className='bg-blue-400 hover:bg-blue-500 active:bg-blue-600 px-3 py-1 rounded-lg text-white '
					/>
				</Link>

				<Button
					label='Procesar Pago'
					icon='pi pi-credit-card'
					className='bg-purple-400 hover:bg-purple-500 active:bg-purple-600 px-2 py-1 rounded-lg text-white '
					onClick={() => handleProcessPayment(rowData)}
				/>
			</div>
		);
	};

	const handleProcessPayment = (rowData) => {
		setSelectedPatient(rowData);
		setPaymentModalVisible(true);
	};

	const handleModalClose = () => {
		setPaymentModalVisible(false);
		setSelectedPatient(null);
	};

	const nameTemplate = (rowData) => {
		return <span>{rowData.name}</span>;
	};

	const insuranceTemplate = (rowData) => {
		return <span>{rowData.insurance}</span>;
	};

	return (
		<div className='w-5/6 h-auto shadow-lg rounded-xl overflow-auto border-2'>
			<DataTable
				emptyMessage={
					loadingPatients
						? 'Cargando pacientes...'
						: 'No se encontraron resultados'
				}
				value={value}
				showGridlines
				stripedRows
				size='small'
				removableSort
				paginator
				rows={5}
				tableStyle={{ minWidth: '50rem' }}>
				<Column
					sortable
					field='name'
					header='Nombre'
					style={{ width: '35%' }}
					body={nameTemplate}></Column>
				<Column
					field='insurance'
					header='Prepaga'
					style={{ width: '15%' }}
					body={insuranceTemplate}></Column>
				<Column
					field='state'
					header='Estado'
					style={{ width: '15%' }}
					body={stateTemplate}></Column>
				<Column
					header='Acciones'
					style={{ width: '35%' }}
					body={actionTemplate}></Column>
			</DataTable>

			<PaymentModal
				visible={isPaymentModalVisible}
				onClose={handleModalClose}
				patient={selectedPatient}
			/>
			<LoadingOverlay isLoading={isLoading} />
		</div>
	);
};

export default PatientsTable;
