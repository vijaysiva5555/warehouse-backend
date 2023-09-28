const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId
const receipt = new mongoose.Schema({
    id: {
        type: objectId,
        ref: "user",
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
    packageDetails: {
        type: String,
        require: true
    },
    godownName: {
        type: String,
        require: true
    },
    godownCode: {
        type: String,
        require: true
    },
    locationOfPackageInGodown: {
        type: String,
        require: true
    },
    handingOverOfficerName: {
        type: String,
        require: true
    },
    handingOverOfficerDesignation: {
        type: String,
        require: true
    },
    pendingUnderSection: {
        type: String,
        require: true
    },
    adjucationOrderNo: {
        type: String,
    },
    ripeForDisposal: {
        type: String,
        require: true
    },
    disposalOrderNo: {
        type: String,
        
    },
    disposalRejectReason: {
        type: String,
        
    },
    whAckNo: {
        type: String,
        require: true
    },
    barcode: {
        type:String,                           //type: Image,   error image is not defined.
    }
},
    { timestamps: true, versionKey: false }
)
module.exports = mongoose.model("receipt", receipt)