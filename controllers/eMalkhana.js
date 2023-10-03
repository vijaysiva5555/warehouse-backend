const db = require("../models/mongo")
const mongoose = require("mongoose")
const common = require("../models/common")
const moment = require("moment")
const path = require("path")

const eMalkhanaDetails = async (req, res) => {
    let eMalkhanaData = req.body, eMalkhanaFiles = req.files.documents, eMalkhanaInputData, eMalkhanaAllData, currentYear, folderPath, documentFolderPath, i = 0,
        arr = [], fileFolderPath
    try {
        currentYear = moment().year().toString().substring(2)
        eMalkhanaAllData = await db.findDocuments("eMalkhana", { 'eMalkhanaNo': { $regex: currentYear } })
        eMalkhanaData.eMalkhanaNo = process.env.EMALKHANANO + '-' + currentYear + '-' + String(eMalkhanaAllData.length + 1).padStart(4, '0')

        eMalkhanaInputData = await db.insertSingleDocument("eMalkhana", eMalkhanaData)
        if (eMalkhanaInputData) {
            if (eMalkhanaFiles.length > 0) {                              //file
                folderPath = path.resolve(__dirname, '../fileUploads')
                await common.createDir(folderPath)
                documentFolderPath = `${folderPath}/${eMalkhanaInputData._id}`
                await common.createDir(documentFolderPath)
                for (; i < eMalkhanaFiles.length; i++) {
                    fileName = eMalkhanaFiles[i].name;
                    fileFolderPath = path.join(__dirname, `../fileUploads/${eMalkhanaInputData._id}/`, fileName)
                    await eMalkhanaFiles[i].mv(fileFolderPath)
                    filePath = {
                        fileName,
                        filePath: `fileUploads/${eMalkhanaInputData._id}/${fileName}`
                    }
                    arr.push(filePath)
                }
                await db.findByIdAndUpdate("eMalkhana", eMalkhanaInputData._id, { documents: arr })
            }
            return res.send({ status: 1, msg: "data inserted successfully" })
        }
    } catch (error) {
        if (eMalkhanaInputData) {
            await db.deleteOneDocument("eMalkhana", { _id: eMalkhanaInputData._id })
        }
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
        let updateEmakhala = req.body, eMalkhanaUpdateById
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
const eMalkhanaDataById = async (req, res) => {
    try {
        let eMalkhanaId = req.body, eMalkhanaData
        if (!mongoose.isValidObjectId(eMalkhanaId.id)) {
            return res.send({ status: 0, msg: "invalid id" })
        }
        eMalkhanaData = await db.findSingleDocument("eMalkhana", { _id: new mongoose.Types.ObjectId(eMalkhanaId.id) })
        if (eMalkhanaData !== null) {

            return res.send({ status: 1, data: eMalkhanaData })
        } {

            return res.send({ status: 1, data: eMalkhanaData })
        }
    } catch (error) {
        return res.send(error.message)
    }
}


module.exports = { eMalkhanaDetails, updateEmakhala, getEmakhalaDetails, eMalkhanaDataById }