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
        type: Object,
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
        type: Object,
        require: true
    },
    seizedItemWeight: {
        type: Object,
        require: true
    },
    seizedItemValue: {
        type: Object,
        require: true
    },
    itemDesc: {
        type:Object
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
        type: Object,
        default: null
    },
    newOfficerName: {
        type: Object,
        default: null
    },
    newOfficerDesignation: {
        type: Object,
        default: null
    }
},
    { timestamps: true, versionKey: false }
)
module.exports = mongoose.model("eMalkhana", eMalkhana)