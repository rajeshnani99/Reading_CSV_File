/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { MOST_REVENUE_ITEM } from "../apis";

const MostRevenueItem = () => {
	const [mostRevenueItems, setMostRevenueItems] = useState({});

	useEffect(() => {
		axios
			.get(MOST_REVENUE_ITEM)
			.then((response) => setMostRevenueItems(response.data))
			.catch((error) =>
				console.error("Error fetching items generating most revenue:", error)
			);
	}, []);

	return (
		<div>
			<h2>Items Generating Most Revenue Each Month</h2>
			<ul>
				{Object.entries(mostRevenueItems).map(([month, item]) => (
					<li key={month}>
						{month}: {item}
					</li>
				))}
			</ul>
		</div>
	);
};

export default MostRevenueItem;
