const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const app = express();
const CONFIG = require("./config/config");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

app.use(express.json());
app.use(
	cors({
		origin: CONFIG.UI_URL,
		credentials: true,
	})
);
app.use(cookieParser());
app.use(
	fileUpload({
		parseNested: true,
	})
);

app.use(express.urlencoded({ extended: true }));
mongoose
	.connect(CONFIG.MONGOURL)
	.then(() => {
		console.log("mongodb is connected");
	})
	.catch((err) => {
		console.log(err);
	});

app.use("/", routes);

app.listen(CONFIG.PORT || 3000, () => {
	console.log("express is running on " + `${CONFIG.PORT || 3000}`);
});
