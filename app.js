const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const app = express();
const path = require("path");
const CONFIG = require("./config/config");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const { authorized } = require("./models/auth");

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
app.use(
	"/barcodeFolder",
	authorized,
	express.static(path.join(__dirname, "/barcodeFolder"), { etag: false })
);
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
