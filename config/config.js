require('dotenv').config()
const CONFIG = {}
CONFIG.MONGOURL=process.env.MONGOURL
CONFIG.PORT = process.env.PORT
module.exports=CONFIG