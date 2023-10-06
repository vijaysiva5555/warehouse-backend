const db = require("../models/mongo")
const mongoose = require("mongoose")
const common = require("../models/common")
const moment = require("moment")
const path = require("path")
const aws = require('aws-sdk')

//-------------------------------------- eMalkhana details Post--------------------------------------------//


const insertEMalkhanaDetails = async (req, res) => {
    let eMalkhanaData = req.body, eMalkhanaInputData, eMalkhanaAllData, currentYear
    try {
        currentYear = moment().year().toString().substring(2)
        eMalkhanaAllData = await db.findDocuments("eMalkhana", { 'eMalkhanaNo': { $regex: currentYear } })
        eMalkhanaData.eMalkhanaNo = process.env.EMALKHANANO + '-' + currentYear + '-' + String(eMalkhanaAllData.length + 1).padStart(4, '0')



        eMalkhanaInputData = await db.insertSingleDocument("eMalkhana", eMalkhanaData)
        if (eMalkhanaInputData) {
            // if (eMalkhanaFiles.length > 0) {                              //file
            //     folderPath = path.resolve(__dirname, '../fileUploads')
            //     await common.createDir(folderPath)
            //     documentFolderPath = `${folderPath}/${eMalkhanaInputData._id}`
            //     await common.createDir(documentFolderPath)
            //     for (; i < eMalkhanaFiles.length; i++) {
            //         fileName = eMalkhanaFiles[i].name;
            //         fileFolderPath = path.join(__dirname, `../fileUploads/${eMalkhanaInputData._id}/`, fileName)
            //         await eMalkhanaFiles[i].mv(fileFolderPath)
            //         filePath = {
            //             fileName,
            //             filePath: `fileUploads/${eMalkhanaInputData._id}/${fileName}`
            //         }
            //         arr.push(filePath)
            //     }
            //     await db.findByIdAndUpdate("eMalkhana", eMalkhanaInputData._id, { documents: arr })
            // }
            return res.send({ status: 1, msg: "data inserted successfully" })
        }
    } catch (error) {
        // if (eMalkhanaInputData) {
        //     await db.deleteOneDocument("eMalkhana", { _id: eMalkhanaInputData._id })
        // }
        return res.send(error.message)
    }
}

// ---------------------------get all eMalkhana details ----------------------------------------//

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

//-----------------------------------------------update emalkhana particular feild data-----------------------------//

const updateMalkhana = async (req, res) => {
    try {
        let updateMalkhanData = req.body, eMalkhanaUpdateById, getPreviousDataByID, foundObject
        if (!mongoose.isValidObjectId(updateMalkhanData.id)) {
            return res.send({ status: 0, msg: "invalid id" })
        }
        getPreviousDataByID = await db.findSingleDocument("eMalkhana", { _id: new mongoose.Types.ObjectId(updateMalkhanData.id) })
        if (updateMalkhanData.seizedItemName) {
            foundObject = getPreviousDataByID.seizedItemName.previousData.filter(obj => obj["data"] === updateMalkhanData.seizedItemName.current);
            if (foundObject.length === 0) {
                newPreviousData = {
                    data: getPreviousDataByID.seizedItemName.current,
                    date: getPreviousDataByID.updatedAt
                }
                updateMalkhanData.seizedItemName.previousData = [...getPreviousDataByID.seizedItemName.previousData, newPreviousData]
            } else {
                delete updateMalkhanData.seizedItemName
            }
        }

        if (updateMalkhanData.seizedItemWeight) {
            foundObject = getPreviousDataByID.seizedItemWeight.previousData.filter(obj => obj["data"] === updateMalkhanData.seizedItemWeight.current);
            if (foundObject.length === 0) {
                newPreviousData = {
                    data: getPreviousDataByID.seizedItemWeight.current,
                    date: getPreviousDataByID.updatedAt
                }
                updateMalkhanData.seizedItemWeight.previousData = [...getPreviousDataByID.seizedItemWeight.previousData, newPreviousData]
            } else {
                delete updateMalkhanData.seizedItemWeight
            }
        }

        if (updateMalkhanData.seizedItemValue) {
            foundObject = getPreviousDataByID.seizedItemValue.previousData.filter(obj => obj["data"] === updateMalkhanData.seizedItemValue.current);
            if (foundObject.length === 0) {
                newPreviousData = {
                    data: getPreviousDataByID.seizedItemValue.current,
                    date: getPreviousDataByID.updatedAt
                }
                updateMalkhanData.seizedItemValue.previousData = [...getPreviousDataByID.seizedItemValue.previousData, newPreviousData]
            } else {
                delete updateMalkhanData.seizedItemValue
            }
        }

        if (updateMalkhanData.itemDesc) {
            foundObject = getPreviousDataByID.itemDesc.previousData.filter(obj => obj["data"] === updateMalkhanData.itemDesc.current);
            if (foundObject.length === 0) {
                newPreviousData = {
                    data: getPreviousDataByID.itemDesc.current,
                    date: getPreviousDataByID.updatedAt
                }
                updateMalkhanData.itemDesc.previousData = [...getPreviousDataByID.itemDesc.previousData, newPreviousData]
            } else {
                delete updateMalkhanData.itemDesc
            }
        }

        eMalkhanaUpdateById = await db.findByIdAndUpdate("eMalkhana", updateMalkhanData.id, updateMalkhanData)
        if (eMalkhanaUpdateById) {
            return res.send({ status: 1, msg: "updated successfully" })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

//---------------------------------check emalkhana data by Id----------------------------------------

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

//----------------------------SEARCH DATA-------------------------------------------------------//
//Search data using emalkhana number

const searchDataUsingeMalkhanaNo = async (req, res) => {
    try {
        let eMalkhanaNo = req.body, checkeMalkhanaNo
        checkeMalkhanaNo = await db.findSingleDocument("eMalkhana", { eMalkhanaNo: eMalkhanaNo.eMalkhanaNo })
        if (checkeMalkhanaNo !== null) {
            return res.send({ status: 1, data: checkeMalkhanaNo })
        }
        {
            return res.send({ status: 1, data: checkeMalkhanaNo })
        }

    } catch (error) {
        return res.send(error.message)
    }
}

//----------------------Search data using file Number-----------------------//

const searchDataUsingfileNo = async (req, res) => {
    try {
        let fileNo = req.body, checkFileNo
        checkFileNo = await db.findSingleDocument("eMalkhana", { fileNo: fileNo.fileNo })
        if (checkFileNo !== null) {
            return res.send({ status: 1, data: checkFileNo })
        }
        {
            return res.send({ status: 1, data: checkFileNo })
        }

    } catch (error) {
        return res.send(error.message)
    }
}

//-------------Search data using Item Description----------------------------------//

const searchDataUsingItemDesc = async (req, res) => {
    try {
        let itemDesc = req.body, checkItemDesc
        checkItemDesc = await db.findSingleDocument("eMalkhana", {"itemDesc.current": itemDesc.itemDesc.current })
        if (checkItemDesc !== null) {
            return res.send({ status: 1, data: checkItemDesc })
        }
        {
            return res.send({ status: 1, data: checkItemDesc })
        }

    } catch (error) {
        return res.send(error.message)
    }
}

//--------------Search data using Importer/Exporter Feild(importerName)------------------//

const searchDataUsingImporterName = async (req, res) => {
    try {
        let importerName = req.body, checkImporterName
        checkImporterName = await db.findSingleDocument("eMalkhana", { importerName: importerName.importerName })
        if (checkImporterName !== null) {
            return res.send({ status: 1, data: checkImporterName })
        }
        {
            return res.send({ status: 1, data: checkImporterName })
        }

    } catch (error) {
        return res.send(error.message)
    }
}

const searchDataUsingImporterAddress = async (req, res) => {
    try {
        let importerAddress = req.body, checkImporterAddress
        checkImporterAddress = await db.findSingleDocument("eMalkhana", { importerAddress: importerAddress.importerAddress })
        if (checkImporterAddress !== null) {
            return res.send({ status: 1, data: checkImporterAddress })
        }
        {
            return res.send({ status: 1, data: checkImporterAddress })
        }

    } catch (error) {
        return res.send(error.message)
    }
}

//--------------REPORT GENERATION-----------------------------------//
//get report using Seizing Unit Wise

const getReportUsingSeizingUnitWise = async (req, res) => {
    try {
        let seizingUnitName = req.body, seizedUnit
        seizedUnit = await db.findSingleDocument("eMalkhana", {seizingUnitName: seizingUnitName.seizingUnitName })
        if (seizedUnit !== null) {
            return res.send({ status: 1, data: seizedUnit })
        }
        {
            return res.send({ status: 1, data: seizedUnit })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

//------------------get report using Seizing Name Wise-----------------//

const getReportUsingSeizingItemWise = async (req, res) => {
    try {
        let seizedItemName = req.body, seizedItem
        seizedItem = await db.findSingleDocument("eMalkhana", { "seizedItemName.current": seizedItemName.seizedItemName.current })
        if (seizedItem !== null) {
            return res.send({ status: 1, data: seizedItem })
        }
        {
            return res.send({ status: 1, data: seizedItem })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

// //------     update data of emalkhana using particular feilds seizedItemWeight, seizedItemValue, itemDesc      --------// 

// const updateeMalkhanaDataByFeilds = async (req, res) => {
//     try {
//         const { eMalkhanaNo, seizedItemWeight, seizedItemValue, itemDesc } = req.body;
//         const seizureToUpdate = await db.findDocumentExist("eMalkhana", { eMalkhanaNo });
//         if (!seizureToUpdate) {
//             return res.send({ status: 0, msg: "eMalkhana no is not found" });
//         }
//         const updateResult = await db.updateOneDocument(
//             "eMalkhana",
//             { eMalkhanaNo },
//             {
//                 $set: {
//                     seizedItemWeight: seizedItemWeight !== undefined ? seizedItemWeight : seizureToUpdate.seizedItemWeight,
//                     seizedItemValue: seizedItemValue !== undefined ? seizedItemValue : seizureToUpdate.seizedItemValue,
//                     itemDesc: itemDesc !== undefined ? itemDesc : seizureToUpdate.itemDesc,
//                 },
//             }
//         )
//         if (!req.body.seizedItemWeight && !req.body.seizedItemValue && !req.body.itemDesc) {
//             return res.send('Please insert data need to be updated');
//         }
//         if (updateResult) {
//             return res.send({ status: 1, msg: "data updated successfully" })
//         }
//     }
//     catch (error) {
//         return res.send(error.message)
//     }
// }

//---------------Re-open API-----------------------------------------------//

// const updateReopenDataUsingeMalkhanaNo = async (req, res) => {
//     try {
//         const { eMalkhanaNo, newSealNo, newOfficerName, newOfficerDesignation } = req.body;
//         const seizureToUpdate = await db.findDocumentExist("eMalkhana", { eMalkhanaNo });
//         if (!seizureToUpdate) {
//             return res.send({ status: 0, msg: "eMalkhana no is not found" });
//         }
//         const updateResult = await db.updateOneDocument(
//             "eMalkhana",
//             { eMalkhanaNo },
//             {
//                 $set: {
//                     newSealNo: newSealNo !== undefined ? newSealNo : seizureToUpdate.newSealNo,
//                     newOfficerName: newOfficerName !== undefined ? newOfficerName : seizureToUpdate.newOfficerName,
//                     newOfficerDesignation: newOfficerDesignation !== undefined ? newOfficerDesignation : seizureToUpdate.newOfficerDesignation,
//                 },
//             }
//         )
//         if (!req.body.newSealNo && !req.body.newOfficerName && !req.body.newOfficerDesignation) {
//             return res.send('Please insert data need to be updated');
//         }
//         if (updateResult) {
//             return res.send({ status: 1, msg: "data updated successfully" })
//         }
//     }
//     catch (error) {
//         return res.send(error.message)
//     }
// }

module.exports = {
    insertEMalkhanaDetails,
    updateMalkhana,
    getEmakhalaDetails,
    eMalkhanaDataById,
    searchDataUsingeMalkhanaNo,
    searchDataUsingfileNo,
    searchDataUsingItemDesc,
    searchDataUsingImporterName,
    searchDataUsingImporterAddress,
    getReportUsingSeizingItemWise,
    getReportUsingSeizingUnitWise,
    // updateeMalkhanaDataByFeilds,
    //updateReopenDataUsingeMalkhanaNo

}