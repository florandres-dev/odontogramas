import React from 'react';

const Tooth = ({ parts, onUpdatePart }) => {
	const handleClick = (e) => {
		const partName = e.target.getAttribute('name');
		const currentState = parts.find((part) => part.name === partName).state;

		const newState =
			currentState === 'white'
				? 'blue'
				: currentState === 'blue'
				? 'red'
				: 'white';
		onUpdatePart(partName, newState);
	};

	return (
		<div className='rounded-full rotate-45 overflow-hidden items-center justify-center flex flex-wrap h-12 w-12 border border-black'>
			{parts.map((part, index) => (
				<div
					key={index}
					className={`w-3/6 h-3/6 ${
						part.unique_classes
					} cursor-pointer transition-all duration-300 hover:bg-green-200 active:bg-green-300 ${
						part.state === 'white'
							? 'bg-white'
							: part.state === 'blue'
							? 'bg-blue-500'
							: 'bg-red-500'
					}`}
					onClick={handleClick}
					name={part.name}
					data-pr-tooltip={part.name}
				/>
			))}
		</div>
	);
};

export default Tooth;
