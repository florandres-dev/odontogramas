import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const MessageModal = ({ visible, onHide, onConfirm, title, message }) => {
	return (
		<Dialog
			header={title}
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
						label='Confirmar'
						icon='pi pi-check'
						onClick={onConfirm}
						className='bg-blue-400 hover:bg-blue-500 active:bg-blue-600 px-2 py-1 rounded-lg text-white '
					/>
				</div>
			}>
			<div className='p-4'>{message}</div>
		</Dialog>
	);
};

export default MessageModal;
