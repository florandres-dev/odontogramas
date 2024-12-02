import React, { useEffect, useState } from 'react';
import PieChart from './Chart';
import { transformData, options } from '@/app/data/revenue';
import { monthsArray } from '@/app/data/months_array';
import { getTotalAmount } from '@/app/utils/functions';
import { Dropdown } from 'primereact/dropdown';

const ChartsSection = ({ patients }) => {
	const [chartData, setChartData] = useState(null);
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
	const [totalRevenue, setTotalRevenue] = useState('Cargando...');

	useEffect(() => {
		if (patients && patients.length > 0) {
			const totalAmount = getTotalAmount(patients);
			setTotalRevenue(`$${totalAmount}`);
		}
	}, [patients]);

	useEffect(() => {
		if (patients && patients.length > 0) {
			const newChartData = transformData(patients, selectedMonth);
			setChartData(newChartData);
		}
	}, [patients, selectedMonth]);

	const handleMonthChange = (e) => {
		setSelectedMonth(parseInt(e.target.value));
	};

	return (
		<div className='sm:w-2/6 w-full h-full flex flex-col items-center justify-start sm:pt-20 py-5 text-center'>
			<div className='flex flex-col gap-2'>
				<span>Total Facturado: {totalRevenue}</span>
				<Dropdown
					value={selectedMonth}
					onChange={(e) => handleMonthChange(e)}
					options={monthsArray}
					optionLabel='label'
					className=' outline-none border-2 rounded-lg w-full '
					checkmark={true}
					highlightOnSelect={false}
				/>

				{chartData && (
					<PieChart
						chart={{ data: chartData, options }}
						month={selectedMonth}
					/>
				)}
			</div>
		</div>
	);
};

export default ChartsSection;
