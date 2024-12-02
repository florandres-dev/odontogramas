'use client';

import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { monthsArray } from '@/app/data/months_array';
import { isSumNonZero } from '@/app/utils/functions';

export default function PieChart({ chart, month }) {
	const [chartData, setChartData] = useState({});
	const [chartOptions, setChartOptions] = useState({});
	const [showChart, setShowChart] = useState(false);

	useEffect(() => {
		setChartData(chart.data);
		setChartOptions(chart.options);

		if (isSumNonZero(chart.data.datasets[0].data)) {
			setShowChart(true);
		} else {
			setShowChart(false);
		}
	}, []);

	useEffect(() => {
		setChartData(chart.data);
		setChartOptions(chart.options);

		if (isSumNonZero(chart.data.datasets[0].data)) {
			setShowChart(true);
		} else {
			setShowChart(false);
		}
	}, [chart]);

	return (
		<div className='flex justify-content-center max-w-60'>
			{showChart ? (
				<Chart
					type='pie'
					data={chartData}
					options={chartOptions}
					className='w-full md:w-30rem'
				/>
			) : (
				<div>
					<span className='text-xl font-bold'>
						No hay datos para mostrar del mes {monthsArray[month - 1].label}
					</span>
				</div>
			)}
		</div>
	);
}
