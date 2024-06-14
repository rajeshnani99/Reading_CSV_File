/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { MOST_POPULAR_ITEM } from "../apis";

const MostPopularItem = () => {
	const [mostPopularItems, setMostPopularItems] = useState();

	useEffect(() => {
		axios
			.get(MOST_POPULAR_ITEM)
			.then((response) => setMostPopularItems(response.data))
			.catch((error) =>
				console.error("Error fetching most popular items:", error)
			);
	}, []);

	return (
		<div>
			<h2>Most Popular Item Each Month</h2>

			<p>- {mostPopularItems}</p>
		</div>
	);
};

export default MostPopularItem;
