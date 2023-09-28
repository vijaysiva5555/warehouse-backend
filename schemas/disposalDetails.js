const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId
const disposalDetails = new mongoose.Schema({
    id: {
        type: objectId,
        ref: "user",
        require: true
    }, 
    whAckNo: {
        type: String,
        ref: "receipt",
        require: true
    },
    eMalkhanaId: {
        type: objectId,
        ref: "eMalkhana",
        require: true
    },
    eMalkhanaNo: {
        type: String,
        require: true
    },
    disposalMethod: {
        type: String,
        require: true
    },
    disposalAuctionOrder: {
        type: String,
        default: null
    },
    disposalType: {
        type: String,
        require: true
    },
    disposalRecovery:{
        type:Array
    },
    reOpenUploadOrder: {
        type: Array,
        require: true
    }
},
    { timestamps: true, versionKey: false }
)
module.exports = mongoose.model("disposal", disposalDetails)