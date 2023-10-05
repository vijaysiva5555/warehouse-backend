const mongoose = require("mongoose")
const { previousDataSchema } = require("./previousDataSchema")

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
        current: {
            type: String,
            require: true
        },
        previousData: [previousDataSchema(String)]
    },
    seizedItemWeight: {
        current: {
            type: Number,
            require: true
        },
        previousData: [previousDataSchema(Number)]
    },
    seizedItemValue: [{
        current: {
            type: Number,
            require: true
        },
        previousData: [previousDataSchema(Number)]
    }],
    itemDesc: [{
        current: {
            type: String,
            require: true
        },
        previousData: [previousDataSchema(String)]
    }],
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