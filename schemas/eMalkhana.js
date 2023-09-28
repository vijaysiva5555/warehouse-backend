const mongoose = require("mongoose")
const eMalkhana = new mongoose.Schema({
    eMalkhanaNo: {
        type: String,
        require: true,
        unique: true
    },
    status: {
        type: Number,    //1= eMalkhana generated,2 = receiptGenerated,3 = disposalStarted,4 = reopened
        require: true
    },
    seizingUnitName: {
        type: String,
        require: true
    },
    fileNo: {
        type: String,
        require: true
    },
    importerName: {
        type: String,
        require: true
    },
    importerAddress: {
        type: String,
        require: true
    },
    placeOfSeizure: {
        type: String,
        require: true
    },
    seizedItemName: {
        type: String,
        require: true
    },
    seizedItemWeight: {
        type: String,
        require: true
    },
    seizedItemValue: {
        type: String,
        require: true
    },
    itemDesc: {
        type: String
    },
    seizingOfficerName: {
        type: String,
        require: true
    },
    seizingOfficerDesignation: {
        type: String,
        require: true
    },
    seizingOfficerSealNo: {
        type: String,
        require: true
    },
    documents: {
        type: Array,
    },
    reOpenReasonvareMalkhanaNo: {
        type: String,
        default: null
    },
    reOpenUploadOrder: {
        type: Array,
        default: null
    },
    reOpenDate: {
        type: Date,
        default: null
    },
    handOverOfficerName: {
        type: String,
        default: null
    },
    handOverOfficerDesignation: {
        type: String,
        default: null
    },
    newSealNo: {
        type: String,
        default: null
    },
    newOfficerName: {
        type: String,
        default: null
    },
    newOfficerDesignation: {
        type: String,
        default: null
    }
},
    { timestamps: true, versionKey: false }
)
module.exports = mongoose.model("eMalkhana", eMalkhana)