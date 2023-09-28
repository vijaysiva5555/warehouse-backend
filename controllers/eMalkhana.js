const db = require("../models/mongo")
const mongoose = require("mongoose")
const common = require("../models/common")
const moment = require("moment")
const path = require("path")

const eMalkhanaDetails = async (req, res) => {
    try {
        let eMalkhanaData = req.body, eMalkhanaInputData, eMalkhanaAllData, currentYear
        currentYear = moment().year().toString().substring(2)
        eMalkhanaAllData = await db.findDocuments("eMalkhana", { 'eMalkhanaNo': { $regex: currentYear } })
        eMalkhanaData.eMalkhanaNo = process.env.EMALKHANANO + '-' + currentYear + '-' + String(eMalkhanaAllData.length + 1).padStart(4, '0')

        eMalkhanaInputData = await db.insertSingleDocument("eMalkhana", eMalkhanaData)
        if (eMalkhanaInputData) {
            if (eMalkhanaData.documents) {                              //file
                folderPath = path.resolve(__dirname, '../fileUploads')
                await common.createDir(folderPath)
                fileName = `${(eMalkhanaInputData._id).toString()}.pdf`
                eMalkhanaData.documents = eMalkhanaData.documents.split(";base64,").pop();
                await common.createFile(
                    `${folderPath}/${fileName}`,
                    eMalkhanaData.documents,
                    "base64"
                );
                await db.findByIdAndUpdate("eMalkhana", eMalkhanaInputData._id, { documents: `/fileUploads/${fileName}` })
            }
            return res.send({ status: 1, msg: "data inserted successfully" })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

const getEmakhalaDetails = async (req, res) => {
    try {
        let getEmakhalaDetails = await db.findDocuments("eMalkhana", {})
        if (getEmakhalaDetails) {
            return res.send({ status: 1, data: getEmakhalaDetails })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

const updateEmakhala = async (req, res) => {
    try {
        let updateEmakhala = req.body,  eMalkhanaUpdateById
        if (!mongoose.isValidObjectId(updateEmakhala.id)) {
            return res.send({ status: 0, msg: "invalid id" })
        }
        eMalkhanaUpdateById = await db.findByIdAndUpdate("eMalkhana", updateEmakhala.id, updateEmakhala)
        if (eMalkhanaUpdateById) {
            return res.send({ status: 1, msg: "updated successfully" })
        }
    } catch (error) {
        return res.send(error.message)
    }
}


module.exports = { eMalkhanaDetails, updateEmakhala, getEmakhalaDetails }