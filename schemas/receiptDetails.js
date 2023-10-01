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
        type: Object,
        require: true
    },
    godownName: {
        type: Object,
        require: true
    },
    godownCode: {
        type: Object,
        require: true
    },
    locationOfPackageInGodown: {
        type: Object,
        require: true
    },
    handingOverOfficerName: {
        type: Object,
        require: true
    },
    handingOverOfficerDesignation: {
        type: Object,
        require: true
    },
    pendingUnderSection: {
        type: Object,
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