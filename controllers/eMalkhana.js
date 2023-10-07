const db = require("../models/mongo")
const mongoose = require("mongoose")
const common = require("../models/common")
const moment = require("moment")
const AWS = require("aws-sdk");
const { uploadToAws, deleteFile } = require("../models/aws")
const config = require("../config/config")

//-------------------------------------- eMalkhana details Insert--------------------------------------------//

const insertEMalkhanaDetails = async (req, res) => {
    let eMalkhanaData = req.body, eMalkhanaInputData, eMalkhanaAllData, currentYear
    try {
        currentYear = moment().year().toString().substring(2)
        eMalkhanaAllData = await db.findDocuments("eMalkhana", { 'eMalkhanaNo': { $regex: currentYear } })
        eMalkhanaData.eMalkhanaNo = process.env.EMALKHANANO + '-' + currentYear + '-' + String(eMalkhanaAllData.length + 1).padStart(4, '0')
        eMalkhanaData.createdBy = res.locals.userData.userId

        eMalkhanaData.documents = await uploadToAws(config.EMALKHANADOC, eMalkhanaData.eMalkhanaNo, req.files.documents)

        eMalkhanaInputData = await db.insertSingleDocument("eMalkhana", eMalkhanaData)
        if (eMalkhanaInputData) {
            return res.send({ status: 1, msg: "data inserted successfully" })
        } else {
            return res.send({ status: 0, msg: "Invalid request" })
        }
    } catch (error) {
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
            if (getPreviousDataByID.seizedItemName.current !== updateMalkhanData.seizedItemName.current) {
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

            if (getPreviousDataByID.seizedItemWeight.current !== updateMalkhanData.seizedItemWeight.current) {
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
            if (getPreviousDataByID.seizedItemValue.current !== updateMalkhanData.seizedItemValue.current) {
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
            if (getPreviousDataByID.itemDesc.current !== updateMalkhanData.itemDesc.current) {
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
        } else {

            return res.send({ status: 0, msg: "data not found" })
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
        checkeMalkhanaNo = await db.findSingleDocument("eMalkhana", { eMalkhanaNo: eMalkhanaNo.eMalkhanaNo }, { _id: 1, status: 1 })
        if (checkeMalkhanaNo !== null) {
            return res.send({ status: 1, data: checkeMalkhanaNo })
        } else {
            return res.send({ status: 0, msg: "data Not found" })
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
        } else {
            return res.send({ status: 0, msg: "data Not found" })
        }

    } catch (error) {
        return res.send(error.message)
    }
}

//-------------Search data using Item Description----------------------------------//

const searchDataUsingItemDesc = async (req, res) => {
    try {
        let itemDesc = req.body, checkItemDesc
        checkItemDesc = await db.findSingleDocument("eMalkhana", { "itemDesc.current": itemDesc.itemDesc.current })
        if (checkItemDesc !== null) {
            return res.send({ status: 1, data: checkItemDesc })
        } else {
            return res.send({ status: 0, msg: "data Not found" })
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
        } else {
            return res.send({ status: 0, msg: "data not found" })
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
        } else {
            return res.send({ status: 0, msg: "data not found" })
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
        seizedUnit = await db.findSingleDocument("eMalkhana", { seizingUnitName: seizingUnitName.seizingUnitName })
        if (seizedUnit !== null) {
            return res.send({ status: 1, data: seizedUnit })
        } else {
            return res.send({ status: 0, msg: "data not found" })
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
        } else {
            return res.send({ status: 0, msg: "data not found" })
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

//delete file Api
const deleteDocumentBasedOnEmalkhanaNo = async (req, res) => {
    try {
        let filedata = req.body, updatefile
        updatefile = await db.updateOneDocument("eMalkhana", { "eMalkhanaNo": filedata.eMalkhanaNo }, {
            $pull: { documents: filedata.documents }
        })
        if (updatefile !== null) {
            await deleteFile(filedata.documents)

            return res.send({ status: 1, msg: "file Deleted Sucessfully" })

        } else {
            return res.send({ status: 0, msg: "invalid Request" })
        }
    } catch (error) {
        return res.send(error.message)
    }
}


//_____Re-open UPDATE API------------------//

const reOpenUpdateUsingMultipleeMalkhanaNo = async (req, res) => {
    try {
        let { inputReOpenData, updateInputReOpenData, updateMalkhanasNo = [], reOpenReason, reOpenUploadOrder, reOpenDate, handOverOfficerName
            , handOverOfficerDesignation, newSealNo, newOfficerName, newOfficerDesignation, updatesGivenData } = req.body

        updatesGivenData = {
            reOpenReason,
            reOpenUploadOrder,
            reOpenDate,
            handOverOfficerName,
            handOverOfficerDesignation,
            newSealNo,
            newOfficerName,
            newOfficerDesignation,
            ...inputReOpenData,
        }
        if (req.files) {
            await Promise.all(updateMalkhanasNo.map(async (ele) => {
                updatesGivenData.reOpenUploadOrder = await uploadToAws(config.REOPENUPLOADORDERDOC, ele, req.files.reOpenUploadOrder);
            }));
        }

        // updatesGivenData.reOpenUploadOrder = await uploadToAws(config.REOPENUPLOADORDERDOC,)
        updatesGivenData.status = 4
        updatesGivenData.createdBy = res.locals.userData.userId
        updateInputReOpenData = await db.updateManyDocuments("eMalkhana", { eMalkhanaNo: { $in: updateMalkhanasNo } }, { $set: updatesGivenData },)

        if (updateInputReOpenData) {
            res.send({ status: 1, msg: "data updated succesfully" })
        } else {
            res.send({ status: 0, msg: "data not found" })
        }


    } catch (error) {
        return res.send(error.message)
    }

}


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
    //updateReopenDataUsingeMalkhanaNo,
    deleteDocumentBasedOnEmalkhanaNo,
    reOpenUpdateUsingMultipleeMalkhanaNo

}