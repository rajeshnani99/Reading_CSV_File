/** @format */

const bodyParser = require("body-parser");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const express = require("express");
const getValidQuantity = require("../utils");

const router = express.Router();
const salesData = [];

// Function to handle CSV parsing and data loading
const loadSalesData = () => {
	return new Promise((resolve, reject) => {
		fs.createReadStream(path.join(__dirname, "../iceCreamSales.csv"))
			.pipe(csv())
			.on("data", (row) => {
				row.Quantity = parseInt(row.Quantity);
				row["Total Price"] = parseFloat(row["Total Price"]);
				row.Date = new Date(row.Date);
				salesData.push(row);
			})
			.on("end", () => {
				console.log("CSV file successfully processed");
			})
			.on("error", (err) => {
				console.error("Error processing CSV file:", err);
			});
	});
};

// Load sales data when the module is first loaded
loadSalesData().catch((err) => {
	console.error("Failed to load sales data:", err);
});

// Middleware to check if sales data is loaded
const salesDataLoaded = (req, res, next) => {
	if (salesData.length === 0) {
		const error = new Error("Sales data not loaded");
		return next(error);
	}
	next();
};

// calculate total sales
router.get("/total-sales", salesDataLoaded, async (req, res, next) => {
	try {
		const totalSales = salesData.reduce((acc, item) => {
			const validTotalPrice = getValidQuantity(item["Total Price"]);
			return acc + validTotalPrice;
		}, 0);
		res.json({ totalSales });
	} catch (err) {
		console.error("Error calculating total sales:", err);
		res.status(500).json({ error: "Failed to calculate total sales" });
	}
});

// calculate month-wise sales totals
router.get("/month-wise-sales", salesDataLoaded, async (req, res, next) => {
	try {
		const monthWiseSales = salesData.reduce((acc, item) => {
			const month = item.Date.toISOString().slice(0, 7);
			const validTotalPrice = getValidQuantity(item["Total Price"]);
			acc[month] = (acc[month] || 0) + validTotalPrice;
			return acc;
		}, {});
		res.json(monthWiseSales);
	} catch (err) {
		console.error("Error calculating month-wise sales:", err);
		res.status(500).json({ error: "Failed to calculate month-wise sales" });
	}
});

// most popular item in each month
router.get("/most-popular-item", salesDataLoaded, async (req, res, next) => {
	try {
		const skuQuantities = {};

		// Aggregate quantities by SKU
		for (const item of salesData) {
			if (skuQuantities[item.SKU]) {
				skuQuantities[item.SKU] += item.Quantity;
			} else {
				skuQuantities[item.SKU] = item.Quantity;
			}
		}

		// find the SKU with the highest total quantity
		let maxQuantity = 0;
		let mostPopularSKU = null;

		for (const [sku, quantity] of Object.entries(skuQuantities)) {
			if (quantity > maxQuantity) {
				maxQuantity = quantity;
				mostPopularSKU = sku;
			}
		}

		res.json(mostPopularSKU);
	} catch (err) {
		console.error("Error finding most popular item:", err);
		res.status(500).json({ error: "Failed to find most popular item" });
	}
});

// items generating most revenue in each month
router.get("/most-revenue-item", salesDataLoaded, async (req, res, next) => {
	try {
		const skuRevenuesByMonth = {};

		// aggregate revenues by SKU and month
		salesData.forEach((item) => {
			const date = new Date(item.Date);
			const month = `${date.getFullYear()}-${String(
				date.getMonth() + 1
			).padStart(2, "0")}`;

			if (!skuRevenuesByMonth[month]) {
				skuRevenuesByMonth[month] = {};
			}

			if (skuRevenuesByMonth[month][item.SKU]) {
				skuRevenuesByMonth[month][item.SKU] += item["Total Price"];
			} else {
				skuRevenuesByMonth[month][item.SKU] = item["Total Price"];
			}
		});

		// find the SKU with the highest total revenue for each month
		const mostRevenueGeneratingSKUsByMonth = {};

		for (const [month, skuRevenues] of Object.entries(skuRevenuesByMonth)) {
			let maxRevenue = 0;
			let mostRevenueGeneratingSKU = null;

			for (const [sku, revenue] of Object.entries(skuRevenues)) {
				if (revenue > maxRevenue) {
					maxRevenue = revenue;
					mostRevenueGeneratingSKU = sku;
				}
			}

			mostRevenueGeneratingSKUsByMonth[month] = mostRevenueGeneratingSKU;
		}

		res.json(mostRevenueGeneratingSKUsByMonth);
	} catch (err) {
		console.error("Error finding most revenue item:", err);
		res.status(500).json({ error: "Failed to find most revenue item" });
	}
});

//for the most popular item, find the min, max, and average number of orders each month
router.get(
	"/most-popular-item-stats",
	salesDataLoaded,
	async (req, res, next) => {
		try {
			const skuPopularity = {};
			const skuUnitPrices = {};

			// finding the most popular SKU by quantity for each month
			salesData.forEach((item) => {
				const date = new Date(item.Date);
				const month = `${date.getFullYear()}-${String(
					date.getMonth() + 1
				).padStart(2, "0")}`;

				if (!skuPopularity[month]) {
					skuPopularity[month] = {};
				}
				const validQuantity = getValidQuantity(item["Quantity"]);
				if (skuPopularity[month][item.SKU]) {
					skuPopularity[month][item.SKU] += validQuantity;
				} else {
					skuPopularity[month][item.SKU] = validQuantity;
				}
			});

			// find the most popular SKU by quantity for each month
			const mostPopularSKUsByMonth = {};
			for (const [month, skuQuantities] of Object.entries(skuPopularity)) {
				let maxQuantity = 0;
				let mostPopularSKU = null;

				for (const [sku, quantity] of Object.entries(skuQuantities)) {
					if (quantity > maxQuantity) {
						maxQuantity = quantity;
						mostPopularSKU = sku;
					}
				}

				mostPopularSKUsByMonth[month] = mostPopularSKU;
			}

			// calculating min, max, and average unit prices for the most popular SKU each month
			const metrics = {};

			salesData.forEach((item) => {
				const date = new Date(item.Date);
				const month = `${date.getFullYear()}-${String(
					date.getMonth() + 1
				).padStart(2, "0")}`;

				if (
					mostPopularSKUsByMonth[month] &&
					item.SKU === mostPopularSKUsByMonth[month]
				) {
					if (!skuUnitPrices[month]) {
						skuUnitPrices[month] = [];
					}
					skuUnitPrices[month].push(item["Unit Price"]);
				}
			});

			for (const [month, prices] of Object.entries(skuUnitPrices)) {
				const minPrice = Math.min(...prices);
				const maxPrice = Math.max(...prices);

				let total = 0;
				for (let i = 0; i < prices.length; i++) {
					let validDateNum = getValidQuantity(prices[i]);
					total += validDateNum;
				}
				console.log(`total :: ${total}`);
				console.log(`length : ${prices.length}`);
				const avgPrice = total / prices.length;

				metrics[month] = {
					mostPopularSKU: mostPopularSKUsByMonth[month],
					minUnitPrice: minPrice,
					maxUnitPrice: maxPrice,
					averageUnitPrice: avgPrice,
				};
			}

			res.json(metrics);
		} catch (err) {
			console.error("Error calculating most popular item stats:", err);
			res
				.status(500)
				.json({ error: "Failed to calculate most popular item stats" });
		}
	}
);

// Error handling middleware
router.use((err, req, res, next) => {
	console.error("Error:", err.message);
	res.status(err.status || 500).json({ error: err.message });
});

module.exports = router;
