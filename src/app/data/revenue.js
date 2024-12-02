const colors = {
	blue500: '#3B82F6',
	blue400: '#60A5FA',
	green500: '#10B981',
	green400: '#34D399',
	red500: '#EF4444',
	red400: '#F87171',
	purple500: '#8B5CF6',
	purple400: '#A78BFA',
	yellow500: '#F59E0B',
	yellow400: '#FBBF24',
	indigo500: '#6366F1',
	indigo400: '#818CF8',
};

export function transformData(patients, selectedMonth) {
	const totalPaid = patients.reduce((sum, patient) => {
		return (
			sum +
			patient.bills.reduce((billSum, bill) => {
				const billDate = new Date(bill.date);
				if (selectedMonth === billDate.getMonth() + 1) {
					return billSum + parseFloat(bill.paid_amount);
				}
				return billSum;
			}, 0)
		);
	}, 0);

	const totalRemaining = patients.reduce((sum, patient) => {
		return (
			sum +
			patient.bills.reduce((billSum, bill) => {
				const billDate = new Date(bill.date);
				if (selectedMonth === billDate.getMonth() + 1) {
					return billSum + bill.remaining_amount;
				}
				return billSum;
			}, 0)
		);
	}, 0);

	return {
		labels: ['Abonado', 'Pendiente'],
		datasets: [
			{
				data: [totalPaid, totalRemaining],
				backgroundColor: [
					'#4CAF50', // color para "Abonado"
					'#F44336', // color para "Pendiente"
				],
				hoverBackgroundColor: [
					'#81C784', // color hover para "Abonado"
					'#EF5350', // color hover para "Pendiente"
				],
			},
		],
	};
}

export const options = {
	plugins: {
		legend: {
			labels: {
				usePointStyle: true,
			},
		},
	},
};
