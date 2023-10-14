const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const disposalDetails = new mongoose.Schema({
    whAckNo: {
        type: String,
        ref: "receipt",
        require: true
    },
    eMalkhanaId: {
        type: ObjectId,
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
        
    },
    createdBy: {
        type: ObjectId,
        require: true,
        ref: "user"
    }
},
    { timestamps: true, versionKey: false }
)
module.exports = mongoose.model("disposal", disposalDetails)