/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { MONTH_WISE_SALES } from "../apis";

const MonthWiseSales = () => {
	const [monthWiseSales, setMonthWiseSales] = useState({});

	useEffect(() => {
		axios
			.get(MONTH_WISE_SALES)
			.then((response) => setMonthWiseSales(response.data))
			.catch((error) =>
				console.error("Error fetching month-wise sales:", error)
			);
	}, []);

	return (
		<div>
			<h2>Month-wise Sales</h2>
			<ul>
				{Object.entries(monthWiseSales).map(([month, sales]) => (
					<li key={month}>
						{month}: {sales.toFixed(2)}/-
					</li>
				))}
			</ul>
		</div>
	);
};

export default MonthWiseSales;
