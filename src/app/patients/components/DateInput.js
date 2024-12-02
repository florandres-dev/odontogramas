'use client';

const DateInput = ({ date, setDate, showDate = true }) => {
	const handleDateChange = (e) => {
		setDate(e.target.value);
	};

	return (
		<div className='flex gap-2 items-center w-full justify-center'>
			<input
				type='date'
				value={date}
				onChange={handleDateChange}
				className={`outline-none border-2 px-2 py-2 rounded-lg ${
					showDate ? 'w-3/6' : 'w-full'
				} `}
			/>
			{showDate && <span className='w-1/6'>Fecha</span>}
		</div>
	);
};

export default DateInput;
