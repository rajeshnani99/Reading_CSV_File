/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { TOTAL_SALES } from "../apis";

const TotalSales = () => {
	const [totalSales, setTotalSales] = useState(0);

	useEffect(() => {
		axios
			.get(TOTAL_SALES)
			.then((response) => setTotalSales(response.data.totalSales))
			.catch((error) => console.error("Error fetching total sales:", error));
	}, []);

	return (
		<div>
			<h2>Total Sales</h2>
			<p>{totalSales.toFixed(2)}/-</p>
		</div>
	);
};

export default TotalSales;
