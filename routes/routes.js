const express = require("express")
const routes = express.Router()
const { authorized } = require("../models/auth")
const { checkAccess } = require("../models/common")

// import controller
const userController = require("../controllers/user")
const receiptController = require("../controllers/receiptDetails")
const eMalkhanaController = require("../controllers/eMalkhana")
const disposalController = require("../controllers/disposalDetails")

// import validation
const userValidation = require("../validation/user")
const receiptValidation = require("../validation/receiptDetails")
const eMalkhanaValidation = require("../validation/eMalkhana")
const disposalValidation = require("../validation/disposalDetails")
const reOpenValidation = require("../validation/reOpenValidation")

// import API

// User API
routes.post("/login", userValidation.loginnCreator, userController.loginUser)
routes.post("/userDataById", userValidation.checkId, userController.userDataById)
routes.post("/createUser", authorized, userValidation.userValidation, userController.createUser)

// -------------------------eMalkhana API-------------------------------//
// post api
routes.post("/insertEMalkhana", authorized, eMalkhanaValidation.eMalkhanaValidation, eMalkhanaController.insertEMalkhanaDetails) // checkAccess([2]),   //done

// get api
routes.get("/eMalkhana", eMalkhanaController.getEmakhalaDetails)
routes.post("/getDataUsingeMalkhanaById", eMalkhanaValidation.checkId, eMalkhanaController.eMalkhanaDataById)
routes.get("/geteMalkhanaNoUsingStatus", eMalkhanaController.getAlleMalkhanaNoUsingStatus)
routes.get("/geteWhNoUsingStatus", eMalkhanaController.getAllWhNoUsingStatus)
routes.get("/getfileNoUsingStatus", eMalkhanaController.getAllFileNoUsingStatus)

// search  GET API
routes.post("/getDataByeMalkhanaNo", eMalkhanaValidation.checkeMalkhanaNo, eMalkhanaController.searchDataUsingeMalkhanaNo)

// search  GET API
routes.post("/getDataByeMalkhanaNo", eMalkhanaValidation.checkeMalkhanaNo, eMalkhanaController.searchDataUsingeMalkhanaNo)
routes.post("/getDataByFileNo", eMalkhanaValidation.searchItem, eMalkhanaController.searchDataUsingfileNo)
routes.post("/getDataByPartyName", eMalkhanaValidation.searchItem, eMalkhanaController.searchDataUsingPartyName)
routes.post("/getDataByItemDesc", eMalkhanaValidation.searchItem, eMalkhanaController.searchDataUsingItemDesc)
routes.post("/getReceiptMalkhanaDataById", eMalkhanaValidation.checkId, eMalkhanaController.getReceiptMalkhanaDataById)
routes.post("/getAllDataByEmalkhanaId", eMalkhanaValidation.checkId, eMalkhanaController.getAllDataByEmalkhanaId)

// REPORT GENERATED GET API
routes.post("/seizedUnitwise", eMalkhanaValidation.searchItem, eMalkhanaController.getReportUsingSeizingUnitWise)
routes.post("/seizedItemName", eMalkhanaValidation.searchItem, eMalkhanaController.getReportUsingSeizingItemWise)
routes.post("/getYearWiseData", eMalkhanaValidation.yearWiseValid, eMalkhanaController.getReportUsingYearWise)

// updateAPI
routes.post("/updateSpecficFieldByid", eMalkhanaValidation.eMalkhanaValidationSpecificFeilds, eMalkhanaController.updateSpecficFieldByid)
routes.post("/updateEmalkhana", eMalkhanaValidation.eMalkhanaValidationSpecificFeilds, eMalkhanaController.updateMalkhana)
routes.post("/deleteDocumentBasedOnEmalkhanaNo", eMalkhanaValidation.deleteDocumentBasedOnEmalkhanaNo, eMalkhanaController.deleteDocumentBasedOnEmalkhanaNo)


// --------------------------REOPEN UPDATE API---------------------------------------------------//
routes.post("/updateReOpenApi", authorized, reOpenValidation.reOpenValidation, eMalkhanaController.reOpenUpdateUsingMultipleMalkhanaNo)

// ------------------------------------receipt API---------------------------------//
// post API
routes.post("/insertReceipt", authorized, receiptValidation.receiptValidation, receiptController.insertReceiptDetails)

// get API
routes.get("/receipt", receiptController.getReceiptDetails)
routes.post("/receiptById", receiptValidation.checkId, receiptController.receiptDataById)

// SEARCH Data get API
routes.post("/receiptDetailsByeMalkhanaNo", receiptValidation.checkeMalkhanaNo, receiptController.searchDataUsingeMalkhanaNo)
routes.post("/wackNo", receiptValidation.whAckNo, receiptController.searchDataUsingWackNo)
routes.post("/checkAdjucationOrderNo", receiptValidation.searchItem, receiptController.searchDataByAdjucationOrderNo)
routes.post("/getAllDataBasedOnEmalkhanaNumber", receiptValidation.checkeMalkhanaNo, receiptController.getAllDataBasedOnEmalkhanaNumber)
routes.post("/getEmalkhanaDataBasedonWhackNo", receiptValidation.whAckNo, receiptController.getEmalkhanaDataBasedonWhackNo)


// REPORT GENERATION get API
routes.post("/godownName", receiptValidation.searchItem, receiptController.getReportDataByGodownName)
routes.post("/godownCode", receiptValidation.searchItem, receiptController.getReportDataByGodownCode)
routes.post("/pendingSection", receiptValidation.searchItem, receiptController.reportOfPendingUnderSection)
routes.post("/ripeDisposal", receiptValidation.searchItem, receiptController.reportOfRipeForDisposal)
routes.post("/reportsBasedOnDate", receiptValidation.reportsBasedOnDate, receiptController.reportsBasedOnDate)

// update API
routes.post("/updateReceiptData", receiptValidation.receiptUpdateValidation, receiptController.updateReceipt)
routes.post("/updateSpecificFieldsReceiptData", receiptValidation.receiptValidationSpecificFeilds, receiptController.updateReceiptSpecificFields)

// -------------------------------------------DISPOSAL DETAILS API-----------------------------------------//
// POST API
routes.post("/disposalDetails", authorized, disposalValidation.disposalValidation, disposalController.disposalDataDetails)

// GET API
routes.get("/disposalDetails", disposalController.getdisposalDetails)
routes.post("/disposalById", disposalValidation.checkId, disposalController.disposalDataById)

// UPDATE API
routes.post("/updateDisposalDetails", disposalValidation.checkId, disposalController.updateDisposalDetails)

// SEARCH DATA GET API
routes.post("/disposalDataUsingeMalkhanaNo", disposalValidation.checkeMalkhanaNo, disposalController.searchDataUsingeMalkhanaNo)
routes.post("/disposalDetailsByWackNo", disposalValidation.whAckNo, disposalController.searchDataUsingWackNo)
routes.post("/getAllDataByEmalkhanaNo", disposalValidation.checkeMalkhanaNo, disposalController.getAllDataByEmalkhanaNo)
routes.post("/getAllDataBasedOnWhackNo", disposalValidation.whAckNo, disposalController.getAllDataBasedOnWhackNo)



module.exports = routes