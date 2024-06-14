/** @format */

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const csv = require("csv-parser");
const routes = require("./routes/sales.js");
const path = require("path");
const PORT = 5001;

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/", routes);

app.listen(5001, () => {
	console.log(`server is running at ${PORT}`);
});
