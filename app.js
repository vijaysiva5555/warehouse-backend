const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const routes = require("./routes/routes")
const app = express()
const path = require("path")
require('dotenv').config()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use("/fileuploads", express.static(path.join(__dirname, "/fileuploads"), { etag: false }))
mongoose.connect(process.env.MONGOURL)
    .then(() => { console.log("mongodb is connected") })
    .catch((err => { console.log(err) }))

app.use("/", routes)

app.listen(process.env.PORT || 3000, () => {
    console.log("express is running on " + `${process.env.PORT || 3000}`)
})