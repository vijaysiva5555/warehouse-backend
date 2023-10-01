const db = require("../models/mongo")
const mongoose = require("mongoose")
const common = require("../models/common")
const moment = require("moment")
const path = require("path")

const eMalkhanaDetails = async (req, res) => {
    try {
        let eMalkhanaData = req.body, eMalkhanaInputData, eMalkhanaAllData, currentYear, folderPath, documentFolderPath, i = 0,
            base64String, base64Pdf, arr = [], fileFolderPath

        currentYear = moment().year().toString().substring(2)
        eMalkhanaAllData = await db.findDocuments("eMalkhana", { 'eMalkhanaNo': { $regex: currentYear } })
        eMalkhanaData.eMalkhanaNo = process.env.EMALKHANANO + '-' + currentYear + '-' + String(eMalkhanaAllData.length + 1).padStart(4, '0')

        const { documents, ...eMalkhanaDataWithoutFile } = eMalkhanaData
        eMalkhanaInputData = await db.insertSingleDocument("eMalkhana", eMalkhanaDataWithoutFile)
        if (eMalkhanaInputData) {
            if (eMalkhanaData.documents) {                              //file
                folderPath = path.resolve(__dirname, '../fileUploads')
                await common.createDir(folderPath)
                documentFolderPath = `${folderPath}/${eMalkhanaInputData._id}`
                await common.createDir(documentFolderPath)
                for (; i < eMalkhanaData.documents.length; i++) {
                    fileName = eMalkhanaData.documents[i].fileName;
                    base64String = eMalkhanaData.documents[i].fileData
                    base64Pdf = base64String.split(";base64,").pop();
                    filePath = `${documentFolderPath}/${fileName}`
                    await common.createFile(
                        filePath, base64Pdf, "base64"
                    )
                    fileFolderPath = filePath.split('\\fileUploads\\').pop();
                    fileFolderPath = filePath.split('/')[1];

                    filePath = {
                        fileName: fileName,
                        filePath: `fileUploads/${fileFolderPath}/${fileName}`
                    }
                    arr.push(filePath)
                }
                await db.findByIdAndUpdate("eMalkhana", eMalkhanaInputData._id, { documents: arr })
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