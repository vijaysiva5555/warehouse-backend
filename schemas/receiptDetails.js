const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId
const { previousDataSchema } = require("./previousDataSchema")

const receipt = new mongoose.Schema({
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
        current: {
            type: String,
            require: true
        },
        previousData: [previousDataSchema(String)]
    },
    godownName: {
        current: {
            type: String,
            require: true
        },
        previousData: [previousDataSchema(String)]
    },
    godownCode: {
        current: {
            type: String,
            require: true
        },
        previousData: [previousDataSchema(String)]
    },
    locationOfPackageInGodown: {
        current: {
            type: String,
            require: true
        },
        previousData: [previousDataSchema(String)]
    },
    handingOverOfficerName: {
        current: {
            type: String,
            require: true
        },
        previousData: [previousDataSchema(String)]
    },
    handingOverOfficerDesignation: {
        current: {
            type: String,
            require: true
        },
        previousData: [previousDataSchema(String)]
    },
    pendingUnderSection: {
        current: {
            type: String,
            require: true
        },
        previousData: [previousDataSchema(String)]
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
        type: Array,                       //type: Image,   error image is not defined.
    },
    createdBy: {
        type: objectId,
        ref: "user",
        require: true
    },
},
    { timestamps: true, versionKey: false }
)
module.exports = mongoose.model("receipt", receipt)