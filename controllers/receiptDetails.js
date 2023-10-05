const { default: mongoose } = require("mongoose")
const db = require("../models/mongo")
const moment = require("moment")
const { check } = require("express-validator")
const { checkeMalkhanaNo } = require("../validation/receiptDetails")

//------------------------receipt details post--------------------------//

const insertReceiptDetails = async (req, res) => {
    try {
        let receiptInput = req.body, receiptData, checkingRole, whAckNoData, currentYear, checkeMalkhanaNo, getPreviousDataByID,
            malkhanaUpdateData = {}
        currentYear = moment().year().toString().substring(2)
        whAckNoData = await db.findDocuments("receipt", { 'whAckNo': { $regex: currentYear } })
        receiptInput.whAckNo = process.env.WHACKNO + '-' + currentYear + '-' + String(whAckNoData.length + 1).padStart(4, '0')

        checkeMalkhanaNo = await db.findOneDocumentExists("receipt", { eMalkhanaNo: receiptInput.eMalkhanaNo })
        if (checkeMalkhanaNo === true) {
            return res.send({ status: 0, msg: "E-malkhana NO Alreday Exists" })
        }

        //  // BARCODE ----
        //  const options = {
        //     bcid: 'code128', // Barcode type (e.g., code128, qrCode, etc.)
        //     text:  "Hi there",// receiptInput.whAckNo, // Text/data to encode in the barcode
        //     scale: 3, // Scaling factor (increase to make the barcode larger)
        //     height: 5, // Height of the barcode
        //   };

        //   // Generate the barcode
        //   let barcodeFilePath = ""
        //   bwipjs.toBuffer(options, (err, png) => {
        //     if (err) {
        //       console.error(err);
        //     } else {
        //       // Save the barcode image to a file or send it as a response
        //       barcodeFilePath = 'barcode.png';
        //       fs.writeFileSync(barcodeFilePath, png);
        //       console.log('Barcode generated and saved as barcode.png');
        //       receiptInput.barcode = barcodeFilePath
        //     }
        //   });
        getPreviousDataByID = await db.findSingleDocument("eMalkhana", { eMalkhanaNo: receiptInput.eMalkhanaNo })
        if (getPreviousDataByID === null) {
            return res.send({ status: 0, msg: "Invalid E-Malkhana Number" })
        }
        if (receiptInput.seizedItemName) {
            foundObject = getPreviousDataByID.seizedItemName.previousData.filter(obj => obj["data"] === receiptInput.seizedItemName.current);
            if (foundObject.length === 0) {
                newPreviousData = {
                    data: getPreviousDataByID.seizedItemName.current,
                    date: getPreviousDataByID.updatedAt
                }
                receiptInput.seizedItemName.previousData = [...getPreviousDataByID.seizedItemName.previousData, newPreviousData]
            } else {
                delete receiptInput.seizedItemName
            }
        }

        if (receiptInput.seizedItemWeight) {
            foundObject = getPreviousDataByID.seizedItemWeight.previousData.filter(obj => obj["data"] === receiptInput.seizedItemWeight.current);
            if (foundObject.length === 0) {
                newPreviousData = {
                    data: getPreviousDataByID.seizedItemWeight.current,
                    date: getPreviousDataByID.updatedAt
                }
                receiptInput.seizedItemWeight.previousData = [...getPreviousDataByID.seizedItemWeight.previousData, newPreviousData]
            } else {
                delete receiptInput.seizedItemWeight
            }
        }

        if (receiptInput.seizedItemValue) {
            foundObject = getPreviousDataByID.seizedItemValue.previousData.filter(obj => obj["data"] === receiptInput.seizedItemValue.current);
            if (foundObject.length === 0) {
                newPreviousData = {
                    data: getPreviousDataByID.seizedItemValue.current,
                    date: getPreviousDataByID.updatedAt
                }
                receiptInput.seizedItemValue.previousData = [...getPreviousDataByID.seizedItemValue.previousData, newPreviousData]
            } else {
                delete receiptInput.seizedItemValue
            }
        }

        if (receiptInput.itemDesc) {
            foundObject = getPreviousDataByID.itemDesc.previousData.filter(obj => obj["data"] === receiptInput.itemDesc.current);
            if (foundObject.length === 0) {
                newPreviousData = {
                    data: getPreviousDataByID.itemDesc.current,
                    date: getPreviousDataByID.updatedAt
                }
                receiptInput.itemDesc.previousData = [...getPreviousDataByID.itemDesc.previousData, newPreviousData]
            } else {
                delete receiptInput.itemDesc
            }
        }

        receiptData = await db.insertSingleDocument("receipt", receiptInput)
        if (receiptData) {
            await db.findOneAndUpdate("eMalkhana", { eMalkhanaNo: receiptInput.eMalkhanaNo }, receiptInput)

            return res.send({ status: 1, msg: "receipt details inserted successfully", data: receiptData })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

//-------------get all receipt details----------------------------------//

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

// // ------------------------------update  all receipt details-------------------------------------------//

// const updateAllReceiptDetails = async (req, res) => {
//     try {
//         let updateAllReceiptDetails = req.body, receiptUpdateById
//         if (!mongoose.isValidObjectId(updateAllReceiptDetails.id)) {
//             return res.send({ status: 0, msg: "invalid id" })
//         }
//         receiptUpdateById = await db.findByIdAndUpdate("receipt", updateAllReceiptDetails.id, updateAllReceiptDetails)
//         if (receiptUpdateById) {
//             return res.send({ status: 1, msg: "updated successfully" })
//         }
//     } catch (error) {
//         return res.send(error.message)
//     }
// }

// ----------------------get Receipt details using id--------------------------------------------------------------------

const receiptDataById = async (req, res) => {
    try {
        let receiptId = req.body, receiptData
        if (!mongoose.isValidObjectId(receiptId.id)) {
            return res.send({ status: 0, msg: "invalid id" })
        }
        receiptData = await db.findSingleDocument("receipt", { _id: new mongoose.Types.ObjectId(receiptId.id) })
        if (receiptData !== null) {

            return res.send({ status: 1, data: receiptData })
        } {

            return res.send({ status: 1, data: receiptData })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

//------------------------------------------SEARCH DATA-----------------------------------------------//
//----search data by eMalkhanaNo

const searchDataUsingeMalkhanaNo = async (req, res) => {
    try {
        let eMalkhanaNo = req.body, checkeMalkhanaNo
        checkeMalkhanaNo = await db.findSingleDocument("receipt", { eMalkhanaNo: eMalkhanaNo.eMalkhanaNo })
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

//--------------search data by WackNo 

const searchDataUsingWackNo = async (req, res) => {
    try {
        let whAckNo = req.body, checkwhAckNo
        checkwhAckNo = await db.findSingleDocument("receipt", {
            whAckNo: whAckNo.whAckNo
        })
        if (checkwhAckNo !== null) {
            return res.send({ status: 1, data: checkwhAckNo })
        }
        {
            return res.send({ status: 1, data: checkwhAckNo })
        }

    } catch (error) {
        return res.send(error.message)
    }
}

//search data by adjucationOrderNo

const searchDataByAdjucationOrderNo = async (req, res) => {
    try {
        let adjucationOrderNo = req.body, checkAdjucationOrderNo
        checkwhAckNo = await db.findSingleDocument("receipt", {
            adjucationOrderNo: adjucationOrderNo.adjucationOrderNo
        })
        if (checkAdjucationOrderNo !== null) {
            return res.send({ status: 1, data: checkAdjucationOrderNo })
        }
        {
            return res.send({ status: 1, data: checkAdjucationOrderNo })
        }

    } catch (error) {
        return res.send(error.message)
    }
}

//-------------------REPORT GENERATION-------------------------------------//
//get report details by Godown name

const getReportDataByGodownName = async (req, res) => {
    try {
        let godownName = req.body, godownItem
        godownItem = await db.findDocuments("receipt", { godownName: godownName.godownName })
        if (godownItem !== null) {
            return res.send({ status: 1, data: godownItem })
        }
        {
            return res.send({ status: 1, data: godownItem })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

//get report details by Godown code

const getReportDataByGodownCode = async (req, res) => {
    try {
        let godownCode = req.body, getGodownCode
        getGodownCode = await db.findDocuments("receipt", { godownCode: godownCode.godownCode })
        if (getGodownCode !== null) {
            return res.send({ status: 1, data: getGodownCode })
        }
        {
            return res.send({ status: 1, data: getGodownCode })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

// get report details by Pending under section wise

const reportOfPendingUnderSection = async (req, res) => {
    try {
        let pendingUnderSection = req.body, pendingSection
        pendingSection = await db.findDocuments("receipt", { pendingUnderSection: pendingUnderSection.pendingUnderSection })
        if (pendingSection !== null) {
            return res.send({ status: 1, data: pendingSection })
        }
        {
            return res.send({ status: 1, data: pendingSection })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

//----- get report details by Ripe For Disposal----//

const reportOfRipeForDisposal = async (req, res) => {
    try {
        let ripeForDisposal = req.body, ripeDisposal
        ripeDisposal = await db.findDocuments("receipt", { ripeForDisposal: ripeForDisposal.ripeForDisposal })
        if (ripeDisposal !== null) {
            return res.send({ status: 1, data: ripeDisposal })
        }
        {
            return res.send({ status: 1, data: ripeDisposal })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

//update data Details of package received,Name/code of the godown,Location of package inside the godown, Pending under section .

const updateReceipt = async (req, res) => {
    try {
        let updateReceptData = req.body, receiptUpdateById, getPreviousDataByID, foundObject
        if (!mongoose.isValidObjectId(updateReceptData.id)) {
            return res.send({ status: 0, msg: "invalid id" })
        }
        getPreviousDataByID = await db.findSingleDocument("receipt", { _id: new mongoose.Types.ObjectId(updateReceptData.id) })
        if (updateReceptData.packageDetails) {
            foundObject = getPreviousDataByID.packageDetails.previousData.filter(obj => obj["data"] === updateReceptData.packageDetails.current);
            if (foundObject.length === 0) {
                newPreviousData = {
                    data: getPreviousDataByID.packageDetails.current,
                    date: getPreviousDataByID.updatedAt
                }
                updateReceptData.packageDetails.previousData = [...getPreviousDataByID.packageDetails.previousData, newPreviousData]
            } else {
                delete updateReceptData.packageDetails
            }
        }

        if (updateReceptData.godownName) {
            foundObject = getPreviousDataByID.godownName.previousData.filter(obj => obj["data"] === updateReceptData.godownName.current);
            if (foundObject.length === 0) {
                newPreviousData = {
                    data: getPreviousDataByID.godownName.current,
                    date: getPreviousDataByID.updatedAt
                }
                updateReceptData.godownName.previousData = [...getPreviousDataByID.godownName.previousData, newPreviousData]
            } else {
                delete updateReceptData.godownName
            }
        }

        if (updateReceptData.godownCode) {
            foundObject = getPreviousDataByID.godownCode.previousData.filter(obj => obj["data"] === updateReceptData.godownCode.current);
            if (foundObject.length === 0) {
                newPreviousData = {
                    data: getPreviousDataByID.godownCode.current,
                    date: getPreviousDataByID.updatedAt
                }
                updateReceptData.godownCode.previousData = [...getPreviousDataByID.godownCode.previousData, newPreviousData]
            } else {
                delete updateReceptData.godownCode
            }
        }

        if (updateReceptData.locationOfPackageInGodown) {
            foundObject = getPreviousDataByID.locationOfPackageInGodown.previousData.filter(obj => obj["data"] === updateReceptData.locationOfPackageInGodown.current);
            if (foundObject.length === 0) {
                newPreviousData = {
                    data: getPreviousDataByID.locationOfPackageInGodown.current,
                    date: getPreviousDataByID.updatedAt
                }
                updateReceptData.locationOfPackageInGodown.previousData = [...getPreviousDataByID.locationOfPackageInGodown.previousData, newPreviousData]
            } else {
                delete updateReceptData.locationOfPackageInGodown
            }
        }

        if (updateReceptData.handingOverOfficerName) {
            foundObject = getPreviousDataByID.handingOverOfficerName.previousData.filter(obj => obj["data"] === updateReceptData.handingOverOfficerName.current);
            if (foundObject.length === 0) {
                newPreviousData = {
                    data: getPreviousDataByID.handingOverOfficerName.current,
                    date: getPreviousDataByID.updatedAt
                }
                updateReceptData.handingOverOfficerName.previousData = [...getPreviousDataByID.handingOverOfficerName.previousData, newPreviousData]
            } else {
                delete updateReceptData.handingOverOfficerName
            }
        }

        if (updateReceptData.handingOverOfficerDesignation) {
            foundObject = getPreviousDataByID.handingOverOfficerDesignation.previousData.filter(obj => obj["data"] === updateReceptData.handingOverOfficerDesignation.current);
            if (foundObject.length === 0) {
                newPreviousData = {
                    data: getPreviousDataByID.handingOverOfficerDesignation.current,
                    date: getPreviousDataByID.updatedAt
                }
                updateReceptData.handingOverOfficerDesignation.previousData = [...getPreviousDataByID.handingOverOfficerDesignation.previousData, newPreviousData]
            } else {
                delete updateReceptData.handingOverOfficerDesignation
            }
        }

        if (updateReceptData.pendingUnderSection) {
            foundObject = getPreviousDataByID.pendingUnderSection.previousData.filter(obj => obj["data"] === updateReceptData.pendingUnderSection.current);
            if (foundObject.length === 0) {
                newPreviousData = {
                    data: getPreviousDataByID.pendingUnderSection.current,
                    date: getPreviousDataByID.updatedAt
                }
                updateReceptData.pendingUnderSection.previousData = [...getPreviousDataByID.pendingUnderSection.previousData, newPreviousData]
            } else {
                delete updateReceptData.pendingUnderSection
            }
        }

        receiptUpdateById = await db.findByIdAndUpdate("receipt", updateReceptData.id, updateReceptData)
        if (receiptUpdateById) {
            return res.send({ status: 1, msg: "updated successfully" })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

const getAllDataBasedOnEmalkhanaNumber = async (req, res) => {
    try {
        let numberData = req.body, getEmalkhanaData, getReceptData, allData

        getEmalkhanaData = await db.findSingleDocument("eMalkhana", { eMalkhanaNo: numberData.eMalkhanaNo })
        getReceptData = await db.findSingleDocument("receipt", { eMalkhanaNo: numberData.eMalkhanaNo })
        if (getEmalkhanaData || getReceptData) {
            allData = {
                eMalkhanaData: getEmalkhanaData,
                receiptData: getReceptData
            }

            return res.send({ status: 1, data: allData })
        }

    } catch (error) {
        return res.send(error.message)
    }
}

const getEmalkhanaDataBasedonWhackNo = async (req, res) => {
    try {
        let numberData = req.body, getEmalkhanaData, getReceptData, allData

        getReceptData = await db.findSingleDocument("receipt", { whAckNo: numberData.whAckNo })
        getEmalkhanaData = await db.findSingleDocument("eMalkhana", { eMalkhanaNo: getReceptData.eMalkhanaNo })
        if (getEmalkhanaData || getReceptData) {
            allData = {
                eMalkhanaData: getEmalkhanaData,
                receiptData: getReceptData
            }

            return res.send({ status: 1, data: allData })
        }

    } catch (error) {
        return res.send(error.message)
    }
}

module.exports = {
    insertReceiptDetails,
    // updateAllReceiptDetails,
    getReceiptDetails,
    receiptDataById,
    searchDataUsingeMalkhanaNo,
    searchDataUsingWackNo,
    searchDataByAdjucationOrderNo,
    getReportDataByGodownName,
    getReportDataByGodownCode,
    reportOfPendingUnderSection,
    reportOfRipeForDisposal,
    updateReceipt,
    getAllDataBasedOnEmalkhanaNumber,
    getEmalkhanaDataBasedonWhackNo
}