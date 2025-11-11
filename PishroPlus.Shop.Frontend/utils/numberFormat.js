export function formatNumber(value) {
	if (!value) return '';
	const numStr = value.toString().replace(/\D/g, '');
	return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function parseNumber(value) {
	return parseInt(value.replace(/,/g, ''), 10) || 0;
}