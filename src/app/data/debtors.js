const fetchPatients = async () => {
	const token = localStorage.getItem('token');
	try {
		const response = await fetch('/api/patients/', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error('Error fetching patients:', error);
		return [];
	}
};

const colors = {
	blue500: '#3B82F6',
	green500: '#10B981',
	red500: '#EF4444',
	yellow500: '#F59E0B',
	purple500: '#8B5CF6',
	orange500: '#F97316',
	pink500: '#D946EF',
	teal500: '#14B8A6',
	indigo500: '#4F46E5',
	lime500: '#84CC16',
	gray500: '#6B7280',
};

const createDebtorsData = async () => {
	const patients = await fetchPatients();

	const debtorsData = patients.filter((patient) => patient.state < 0);

	const labels = debtorsData.map((debtor) => debtor.patient_name);
	const data = debtorsData.map((debtor) => Math.abs(debtor.state));

	const backgroundColors = data.map((_, index) => {
		const colorKeys = Object.keys(colors);
		return colors[colorKeys[index % colorKeys.length]];
	});

	const hoverBackgroundColors = backgroundColors.map((color) =>
		color.replace('500', '400')
	);

	return {
		data: {
			labels: labels,
			datasets: [
				{
					data: data,
					backgroundColor: backgroundColors,
					hoverBackgroundColor: hoverBackgroundColors,
				},
			],
		},
		options: {
			plugins: {
				legend: {
					labels: {
						usePointStyle: true,
					},
				},
			},
		},
	};
};

export const debtors = createDebtorsData();
