const db = require("../models/mongo")
const mongoose = require("mongoose")
const insertPreviousData = async (req, res) => {
    try {
        let previousDataInsert = req.body, dataInsert
        dataInsert = await db.insertSingleDocument("previousData", previousDataInsert)
        if (dataInsert) {
            return res.send({ status: 0, msg: "data inserted successfully", data: dataInsert })
        }
    } catch (error) {
        return res.send(error.message)
    }
}
const getPreviousDataDetails = async (req, res) => {
    try {
        let getPreviousDataDetails = await db.findDocuments("previousData", {})
        if (getPreviousDataDetails) {
            return res.send({ status: 1, data: getPreviousDataDetails })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

const updatePreviousData = async (req, res) => {
    try {
        let updatePreviousData = req.body, previousDataUpdateById
        if (!mongoose.isValidObjectId(updatePreviousData .id)) {
            return res.send({ status: 0, msg: "invalid id" })
        }
        previousDataUpdateById = await db.findByIdAndUpdate("previousData", updatePreviousData.id, updatePreviousData)
        if (previousDataUpdateById) {
            return res.send({ status: 1, msg: "updated successfully" })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

module.exports = { insertPreviousData, updatePreviousData, getPreviousDataDetails }