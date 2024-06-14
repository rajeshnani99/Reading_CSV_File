/** @format */

function getValidQuantity(quantity) {
	const parsedQuantity = Number(quantity);
	return isNaN(parsedQuantity) ? 0 : parsedQuantity;
}
module.exports = getValidQuantity;
