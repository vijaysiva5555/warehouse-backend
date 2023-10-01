const db = require("../models/mongo")
const { default: mongoose } = require("mongoose")
const disposalDataDetails = async (req, res) => {
    try {
        let insertDisposalData = req.body, disposalData, checkingRole

        checkingRole = await db.findDocumentExist("user", { _id: new mongoose.Types.ObjectId(insertDisposalData.id), role: 2 })
        if (checkingRole === false) {
            return res.send({ status: 0, msg: "you are not authorized person to enter data" })
        }
        disposalData = await db.insertSingleDocument("disposal", insertDisposalData)
        if (disposalData) {
            return res.send({ status: 1, msg: "packages details inserted successfully", data: disposalData })
        }
    } catch (error) {
        return res.send(error.message)
    }
}
const getdisposalDetails = async (req, res) => {
    try {
        let getdisposalDetails = await db.findDocuments("disposal", {})
        if (getdisposalDetails) {
            return res.send({ status: 1, data: getdisposalDetails })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

const updateDisposalDetails = async (req, res) => {
    try {
        let updateDisposalDetails = req.body, disposalDetailsUpdateById
        if (!mongoose.isValidObjectId(updateDisposalDetails.id)) {
            return res.send({ status: 0, msg: "invalid id" })
        }
        disposalDetailsUpdateById = await db.findByIdAndUpdate("disposal", updateDisposalDetails.id, updateDisposalDetails)
        if (disposalDetailsUpdateById) {
            return res.send({ status: 1, msg: "updated successfully" })
        }
    } catch (error) {
        return res.send(error.message)
    }
}
const disposalDataById = async (req, res) => {
    try {
        let disposalId = req.body, disposalData
        if (!mongoose.isValidObjectId(disposalId  .id)) {
            return res.send({ status: 0, msg: "invalid id" })
        }
        disposalData = await db.findSingleDocument("disposal", { _id: new mongoose.Types.ObjectId( disposalId .id) })
        if ( disposalData !== null) {

            return res.send({ status: 1, data: disposalData})
        }{

            return res.send({ status: 1, data:  disposalData })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

module.exports = { disposalDataDetails, updateDisposalDetails, getdisposalDetails ,disposalDataById }