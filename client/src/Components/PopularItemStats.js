/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { POPULAR_ITEM_STATS } from "../apis";

const PopularItemStats = () => {
	const [itemStats, setItemStats] = useState({});

	useEffect(() => {
		axios
			.get(POPULAR_ITEM_STATS)
			.then((response) => setItemStats(response.data))
			.catch((error) => console.error("Error fetching item stats:", error));
	}, []);
	return (
		<div>
			<h2>Most Popular Item Stats Each Month</h2>
			{Object.entries(itemStats).map(([month, itemStats]) => (
				<div key={month}>
					<p>Month: {month}</p>
					<p>Most Popular SKU: {itemStats.mostPopularSKU}</p>
					<p>Min Unit Price: {itemStats.minUnitPrice}/-</p>
					<p>Max Unit Price: {itemStats.maxUnitPrice}/-</p>
					<p>
						Average Unit Price:{" "}
						{itemStats.averageUnitPrice !== null
							? `${itemStats.averageUnitPrice.toFixed(2)}/-`
							: "N/A"}
					</p>
					<hr />
				</div>
			))}
		</div>
	);
};

export default PopularItemStats;
