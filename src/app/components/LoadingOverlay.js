import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

const LoadingOverlay = ({ isLoading }) => {
	return (
		isLoading && (
			<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
				<ProgressSpinner
					style={{ width: '50px', height: '50px' }}
					strokeWidth='4'
					animationDuration='.5s'
				/>
			</div>
		)
	);
};

export default LoadingOverlay;
