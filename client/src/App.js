/** @format */

import React from "react";
import TotalSales from "./Components/TotalSales";
import MonthWiseSales from "./Components/MonthWiseSales";
import MostPopularItem from "./Components/MostPopularItem";
import MostRevenueItem from "./Components/MostRevenueItem";
import PopularItemStats from "./Components/PopularItemStats";
import "./App.css";

const App = () => {
	return (
		<div className="App">
			<h1>Ice Cream Parlour Sales</h1>
			<div className="App">
				<div className="total-sales">
					<TotalSales />
				</div>
				<div className="month-wise-sales">
					<MonthWiseSales />
				</div>
				<div className="most-popular-item">
					<MostPopularItem />
				</div>
				<div className="most-revenue-item">
					<MostRevenueItem />
				</div>
				<div className="popular-item-stats">
					<PopularItemStats />
				</div>
			</div>
		</div>
	);
};

export default App;
