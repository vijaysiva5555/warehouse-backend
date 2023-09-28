const db = require("../models/mongo")
const mongoose = require("mongoose")
const insertUpdateData = async (req, res) => {
    try {
        let updateDataInsert = req.body, dataInsert
        dataInsert = await db.insertSingleDocument("updateData", updateDataInsert)
        if (dataInsert) {
            return res.send({ status: 0, msg: "data inserted successfully", data: dataInsert })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

const getUpdateDataDetails = async (req, res) => {
    try {
        let getUpdateDataDetails = await db.findDocuments("updateData", {})
        if (getUpdateDataDetails) {
            return res.send({ status: 1, data: getUpdateDataDetails })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

const updateData = async (req, res) => {
    try {
        let updateData = req.body, dataUpdateById
        if (!mongoose.isValidObjectId(updateData.id)) {
            return res.send({ status: 0, msg: "invalid id" })
        }
        dataUpdateById = await db.findByIdAndUpdate("updateData", updateData.id, updateData)
        if (dataUpdateById) {
            return res.send({ status: 1, msg: "updated successfully" })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

module.exports = { insertUpdateData, updateData, getUpdateDataDetails }