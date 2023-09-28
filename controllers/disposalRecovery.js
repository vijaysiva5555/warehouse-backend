const db = require("../models/mongo")
const mongoose = require("mongoose")
const disposalRecoveryDetails = async (req, res) => {
    try {
        let recoveryInputData = req.body, disposalData
        disposalData = await db.insertSingleDocument("disposalRecovery", recoveryInputData)
        if (disposalData) {
            return res.send({ status: 1, msg: "data inserted successfully" })
        }
    } catch (error) {
        return res.send(error.message)
    }
}
const getdisposalRecoveryDetails = async (req, res) => {
    try {
        let getdisposalRecoveryDetails = await db.findDocuments("disposalRecovery", {})
        if (getdisposalRecoveryDetails) {
            return res.send({ status: 1, data: getdisposalRecoveryDetails })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

const updateDisposalRecoveryDetails = async (req, res) => {
    try {
        let updateDisposalRecoveryDetails = req.body, disposalRecoveryDetailsUpdateById
        if (!mongoose.isValidObjectId(updateDisposalRecoveryDetails.id)) {
            return res.send({ status: 0, msg: "invalid id" })
        }
        disposalRecoveryDetailsUpdateById = await db.findByIdAndUpdate("disposalRecovery", updateDisposalRecoveryDetails.id, updateDisposalRecoveryDetails)
        if (disposalRecoveryDetailsUpdateById) {
            return res.send({ status: 1, msg: "updated successfully" })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

module.exports = { disposalRecoveryDetails, updateDisposalRecoveryDetails, getdisposalRecoveryDetails }