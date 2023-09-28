const { default: mongoose } = require("mongoose")
const db = require("../models/mongo")
const moment = require("moment")
const receiptDetails = async (req, res) => {
    try {
        let receiptInput = req.body, receiptData, checkingRole, whAckNoData, currentYear
        currentYear = moment().year().toString().substring(2)
        whAckNoData = await db.findDocuments("receipt", { 'whAckNo': { $regex: currentYear } })
        receiptInput.whAckNo = process.env.WHACKNO + '-' + currentYear + '-' + String(whAckNoData.length + 1).padStart(4, '0')

        checkingRole = await db.findDocumentExist("user", { _id: new mongoose.Types.ObjectId(receiptInput.id), role: 2 })
        if (checkingRole === false) {
            return res.send({ status: 0, msg: "you are not an authorized person to fill details" })
        }
        receiptData = await db.insertSingleDocument("receipt", receiptInput)
        if (receiptData) {
            return res.send({ status: 1, msg: "receipt details inserted successfully", data: receiptData })
        }
    } catch (error) {
        return res.send(error.message)
    }
}
const getReceiptDetails = async (req, res) => {
    try {
        let getReceiptDetails = await db.findDocuments("receipt", {})
        if (getReceiptDetails) {
            return res.send({ status: 1, data: getReceiptDetails })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

const updateReceipt = async (req, res) => {
    try {
        let updateReceipt = req.body, receiptUpdateById
        if (!mongoose.isValidObjectId(updateReceipt.id)) {
            return res.send({ status: 0, msg: "invalid id" })
        }
        receiptUpdateById = await db.findByIdAndUpdate("receipt", updateReceipt.id, updateReceipt)
        if (receiptUpdateById) {
            return res.send({ status: 1, msg: "updated successfully" })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

module.exports = { receiptDetails, updateReceipt, getReceiptDetails }