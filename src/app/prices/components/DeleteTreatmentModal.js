import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const ConfirmDeleteModal = ({ visible, onHide, onConfirm, itemName }) => {
	return (
		<Dialog
			header='Eliminar Tratamiento'
			visible={visible}
			onHide={onHide}
			style={{ width: '450px' }}
			footer={
				<div className='flex gap-2 justify-end'>
					<Button
						label='Cancelar'
						icon='pi pi-times'
						onClick={onHide}
						className='bg-gray-400 hover:bg-gray-500 active:bg-gray-600 px-2 py-1 rounded-lg text-white '
					/>
					<Button
						label='Eliminar'
						icon='pi pi-check'
						onClick={onConfirm}
						className='bg-red-400 hover:bg-red-500 active:bg-red-600 px-2 py-1 rounded-lg text-white '
					/>
				</div>
			}>
			<div className='p-4'>
				<p>
					¿Estás seguro de que quieres eliminar <strong>{itemName}</strong>?
					Esta acción no se puede deshacer.
				</p>
			</div>
		</Dialog>
	);
};

export default ConfirmDeleteModal;
