const db = require("../models/mongo")
const { default: mongoose } = require("mongoose")
const {getSignedUrl } = require("../models/aws");

//---------disposal data details-----------//
const disposalDataDetails = async (req, res) => {
    try {
        let insertDisposalData = req.body, disposalData, checkingRole
        checkeMalkhanaNo = await db.findOneDocumentExists("disposal", { eMalkhanaNo: insertDisposalData.eMalkhanaNo })
        if (checkeMalkhanaNo === true) {
            return res.send({ status: 0, msg: "E-malkhana NO Alreday Exists" })
        }
        insertDisposalData.createdBy = res.locals.userData.userId
        

        disposalData = await db.insertSingleDocument("disposal", insertDisposalData)
        if (disposalData) {
            await db.updateOneDocument("eMalkhana", { "eMalkhanaNo": disposalData.eMalkhanaNo }, { status: 3 })
            return res.send({ status: 1, msg: "packages details inserted successfully", data: disposalData })
        } else {
            return res.send({ status: 0, msg: "Invalid Request" })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

//--------------get all disposal data----------------//
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

//----------------update all disposal data----------------//
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


//-------------------get disposal data by id----------------//
const disposalDataById = async (req, res) => {
    try {
        let disposalId = req.body, disposalData
        if (!mongoose.isValidObjectId(disposalId.id)) {
            return res.send({ status: 0, msg: "invalid id" })
        }
        disposalData = await db.findSingleDocument("disposal", { _id: new mongoose.Types.ObjectId(disposalId.id) })
        if (disposalData !== null) {

            return res.send({ status: 1, data: disposalData })
        } else {

            return res.send({ status: 0, msg: "data Not found" })
        }
    } catch (error) {
        return res.send(error.message)
    }
}

//------SEARCH DATA--------------//
//search data using emalkhana number

const searchDataUsingeMalkhanaNo = async (req, res) => {
    try {
        let eMalkhanaNo = req.body, checkeMalkhanaNo
        checkeMalkhanaNo = await db.findSingleDocument("disposal", { eMalkhanaNo: eMalkhanaNo.eMalkhanaNo })
        if (checkeMalkhanaNo !== null) {
            return res.send({ status: 1, data: checkeMalkhanaNo })
        } else {
            return res.send({ status: 0, msg: "data Not found" })
        }

    } catch (error) {
        return res.send(error.message)
    }
}

//search details by WackNo 

const searchDataUsingWackNo = async (req, res) => {
    try {
        let whAckNo = req.body, checkwhAckNo
        checkwhAckNo = await db.findSingleDocument("disposal", {
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

const getAllDataByEmalkhanaNo = async (req, res) => {
    try {
        let numberData = req.body, getEmalkhanaData, getReceptData, getDisposalData, allData

        getEmalkhanaData = await db.findSingleDocument("eMalkhana", { eMalkhanaNo: numberData.eMalkhanaNo })
        getReceptData = await db.findSingleDocument("receipt", { eMalkhanaNo: numberData.eMalkhanaNo })
        getDisposalData = await db.findSingleDocument("disposal", { eMalkhanaNo: numberData.eMalkhanaNo })
        if (getEmalkhanaData || getReceptData || getDisposalData) {
            if (getEmalkhanaData.documents.length !== 0) {
                getEmalkhanaData.documents = await Promise.all(getEmalkhanaData.documents.map(async (file) => {
                    return {
                        ...file,
                        actualPath: file.href,
                        href: await getSignedUrl(file.href)
                    }
                }))
            }
            if (getEmalkhanaData.reOpenUploadOrder.length !== 0) {
                getEmalkhanaData.reOpenUploadOrder = await Promise.all(getEmalkhanaData.reOpenUploadOrder.map(async (file) => {
                    return {
                        ...file,
                        actualPath: file.href,
                        href: await getSignedUrl(file.href)
                    }
                }))
            }

            if (getReceptData.barcode.length !== 0) {
                getReceptData.barcode = await Promise.all(getReceptData.barcode.map(async (file) => {
                    return {
                        ...file,
                        actualPath: file.href,
                        href: await getSignedUrl(file.href)
                    }
                }))
            }
            allData = {
                eMalkhanaData: getEmalkhanaData,
                receiptData: getReceptData,
                disposalData: getDisposalData
            }

            return res.send({ status: 1, data: allData })
        }

    } catch (error) {
        return res.send(error.message)
    }
}
const getAllDataBasedOnWhackNo = async (req, res) => {
    try {
        let numberData = req.body, getEmalkhanaData, getReceptData, getDisposalData, allData

        getReceptData = await db.findSingleDocument("receipt", { whAckNo: numberData.whAckNo })
        getEmalkhanaData = await db.findSingleDocument("eMalkhana", { eMalkhanaNo: getReceptData.eMalkhanaNo })
        getDisposalData = await db.findSingleDocument("disposal", { whAckNo: numberData.whAckNo })
        if (getEmalkhanaData || getReceptData || getDisposalData) {
            if (getEmalkhanaData.documents.length !== 0) {
                getEmalkhanaData.documents = await Promise.all(getEmalkhanaData.documents.map(async (file) => {
                    return {
                        ...file,
                        actualPath: file.href,
                        href: await getSignedUrl(file.href)
                    }
                }))
            }
            if (getEmalkhanaData.reOpenUploadOrder.length !== 0) {
                getEmalkhanaData.reOpenUploadOrder = await Promise.all(getEmalkhanaData.reOpenUploadOrder.map(async (file) => {
                    return {
                        ...file,
                        actualPath: file.href,
                        href: await getSignedUrl(file.href)
                    }
                }))
            }

            if (getReceptData.barcode.length !== 0) {
                getReceptData.barcode = await Promise.all(getReceptData.barcode.map(async (file) => {
                    return {
                        ...file,
                        actualPath: file.href,
                        href: await getSignedUrl(file.href)
                    }
                }))
            }
            allData = {
                eMalkhanaData: getEmalkhanaData,
                receiptData: getReceptData,
                disposalData: getDisposalData
            }

            return res.send({ status: 1, data: allData })
        }
        return res.send({ status: 0, msg: "data not found" })

    } catch (error) {
        return res.send(error.message)
    }
}


module.exports = {
    disposalDataDetails, updateDisposalDetails, getdisposalDetails,
    disposalDataById, searchDataUsingeMalkhanaNo, searchDataUsingWackNo, getAllDataByEmalkhanaNo,
    getAllDataBasedOnWhackNo
}