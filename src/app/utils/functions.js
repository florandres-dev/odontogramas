export function sumArray(numbers) {
	return numbers.reduce((acum, num) => acum + num, 0);
}

export function isSumNonZero(numbers) {
	const totalSum = numbers.reduce((sum, num) => sum + num, 0);
	return totalSum !== 0;
}

export function getTotalAmount(patients) {
	const totalAmount = patients.reduce((sum, patient) => {
		return (
			sum +
			patient.bills.reduce((billSum, bill) => {
				return billSum + parseFloat(bill.total_amount);
			}, 0)
		);
	}, 0);

	return totalAmount;
}

export function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getFirstLetter(name) {
	return name.charAt(0).toUpperCase();
}
