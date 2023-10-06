require('dotenv').config()
const CONFIG = {}
CONFIG.MONGOURL=process.env.MONGOURL
CONFIG.PORT = process.env.PORT
CONFIG.EMALKHANADOC = process.env.EMALKHANADOC

module.exports=CONFIG