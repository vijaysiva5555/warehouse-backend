const { default: mongoose } = require("mongoose")
const db = require("../models/mongo")
const moment = require("moment")
const bwipjs = require('bwip-js');
const fs = require('fs');

//------------------------receipt details post--------------------------//

const insertReceiptDetails = async (req, res) => {
    try {
        let receiptInput = req.body, receiptData, checkingRole, whAckNoData, currentYear, checkeMalkhanaNo, getPreviousDataByID
        currentYear = moment().year().toString().substring(2)
        whAckNoData = await db.findDocuments("receipt", { 'whAckNo': { $regex: currentYear } })
        receiptInput.whAckNo = process.env.WHACKNO + '-' + currentYear + '-' + String(whAckNoData.length + 1).padStart(4, '0')

        checkeMalkhanaNo = await db.findOneDocumentExists("receipt", { eMalkhanaNo: receiptInput.eMalkhanaNo })
        if (checkeMalkhanaNo === true) {
            return res.send({ status: 0, msg: "E-malkhana NO Alreday Exists" })
        }
        receiptInput.createdBy = res.locals.userData.userId
        receiptInput.status = 2   // for E-malkhana

        const options = {
            bcid: 'code128',
            text: receiptInput.whAckNo,
            scale: 3,
            height: 5,
          };
          
          // Specify the full path to the directory where you want to save the barcode image
          const barcodeFolderPath = "./barcodeFolder";
          
          // Generate the barcode
          bwipjs.toBuffer(options, (err, png) => {
            if (err) {
              console.error(err);
            } else {
              // Check if the directory exists, and create it if not
              if (!fs.existsSync(barcodeFolderPath)) {
                fs.mkdirSync(barcodeFolderPath, { recursive: true });
              }
          
              // Save the barcode image to a file in the specified directory
              const barcodeFilePath = `${barcodeFolderPath}/${receiptInput.whAckNo}.png`;
              fs.writeFileSync(barcodeFilePath, png);
              console.log('Barcode generated and saved as', barcodeFilePath);
              receiptInput.barcode = `/${barcodeFilePath.substring(2)}`;
            }
          });
          
          
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
        } else {

            return res.send({ status: 0, msg: "data Not found" })
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
        } else {
            return res.send({ status: 0, msg: "data Not found" })
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
        } else {
            return res.send({ status: 0, msg: "data Not found" })
        }

    } catch (error) {
        return res.send(error.message)
    }
}

//search data by adjucationOrderNo

const searchDataByAdjucationOrderNo = async (req, res) => {
    try {
        let adjucationOrderNo = req.body, checkAdjucationOrderNo
        checkAdjucationOrderNo = await db.findSingleDocument("receipt", {
            adjucationOrderNo: adjucationOrderNo.adjucationOrderNo
        })
        if (checkAdjucationOrderNo !== null) {
            return res.send({ status: 1, data: checkAdjucationOrderNo })
        } else {
            return res.send({ status: 0, msg: "data Not found" })
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
        godownItem = await db.findSingleDocument("receipt", { "godownName.current": godownName.godownName.current })
        if (godownItem !== null) {
            return res.send({ status: 1, data: godownItem })
        } else {
            return res.send({ status: 0, msg: "data Not found" })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

//get report details by Godown code

const getReportDataByGodownCode = async (req, res) => {
    try {
        let godownCode = req.body, getGodownCode
        getGodownCode = await db.findSingleDocument("receipt", { "godownCode.current": godownCode.godownCode.current })
        if (getGodownCode !== null) {
            return res.send({ status: 1, data: getGodownCode })
        } else {
            return res.send({ status: 0, msg: "data Not found" })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

// get report details by Pending under section wise

const reportOfPendingUnderSection = async (req, res) => {
    try {
        let pendingUnderSection = req.body, pendingSection
        pendingSection = await db.findSingleDocument("receipt", { "pendingUnderSection.current": pendingUnderSection.pendingUnderSection.current })
        if (pendingSection !== null) {
            return res.send({ status: 1, data: pendingSection })
        } else {
            return res.send({ status: 0, msg: "data Not found" })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

//----- get report details by Ripe For Disposal----//

const reportOfRipeForDisposal = async (req, res) => {
    try {
        let ripeForDisposal = req.body, ripeDisposal
        ripeDisposal = await db.findSingleDocument("receipt", { ripeForDisposal: ripeForDisposal.ripeForDisposal })
        if (ripeDisposal !== null) {
            return res.send({ status: 1, data: ripeDisposal })
        } else {
            return res.send({ status: 0, msg: "data Not found" })
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
            if (getPreviousDataByID.packageDetails.current !== updateReceptData.packageDetails.current) {
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
            if (getPreviousDataByID.godownName.current !== updateReceptData.godownName.current) {
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
            if (getPreviousDataByID.godownCode.current !== updateReceptData.godownCode.current) {
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
            if (getPreviousDataByID.locationOfPackageInGodown.current !== updateReceptData.locationOfPackageInGodown.current) {
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
            if (getPreviousDataByID.handingOverOfficerName.current !== updateReceptData.handingOverOfficerName.current) {
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
            if (getPreviousDataByID.handingOverOfficerDesignation.current !== updateReceptData.handingOverOfficerDesignation.current) {
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

            if (getPreviousDataByID.pendingUnderSection.current !== updateReceptData.pendingUnderSection.current) {
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