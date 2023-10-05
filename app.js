const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const routes = require("./routes/routes")
const app = express()
const path = require("path")
const CONFIG = require("./config/config")
const cors = require("cors")
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const { authorized } = require("./models/auth")

require('dotenv').config()

app.use(bodyParser.json())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(cookieParser())
app.use(fileUpload({
    parseNested: true
}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use("/fileuploads", authorized, express.static(path.join(__dirname, "/fileuploads"), { etag: false }))
mongoose.connect(CONFIG.MONGOURL)
    .then(() => { console.log("mongodb is connected") })
    .catch((err => { console.log(err) }))

app.use("/", routes)

app.listen(CONFIG.PORT || 3000, () => {
    console.log("express is running on " + `${CONFIG.PORT || 3000}`)
})