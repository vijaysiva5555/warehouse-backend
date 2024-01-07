const express = require("express")
const routes = express.Router()
const { authorized } = require("../models/auth")
const { checkAccess } = require("../models/common")
const { createAccountLimiter } = require("../models/rateLimiter")

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
routes.post("/register", createAccountLimiter, userValidation.userValidation, userController.register)
routes.post("/login", createAccountLimiter, userValidation.loginnCreator, userController.loginUser)
routes.post("/userDataById", createAccountLimiter, userValidation.checkId,checkAccess([2]),authorized, userController.userDataById)
routes.get("/getUserList", createAccountLimiter, userController.getUserList)
routes.post("/changePassword", createAccountLimiter, userValidation.changePasswordValidation, userController.changePassword)

// -------------------------eMalkhana API-------------------------------//
// post api
routes.post("/insertEMalkhana",createAccountLimiter, checkAccess([3]),authorized ,eMalkhanaValidation.eMalkhanaValidation, eMalkhanaController.insertEMalkhanaDetails) // checkAccess([2]),   //done

// get api
routes.get("/eMalkhana",createAccountLimiter,checkAccess([2]),authorized, eMalkhanaController.getEmakhalaDetails)
routes.post("/getDataUsingeMalkhanaById",createAccountLimiter,checkAccess([2]),authorized, eMalkhanaValidation.checkId, eMalkhanaController.eMalkhanaDataById)
routes.get("/geteMalkhanaNoUsingStatus",createAccountLimiter,checkAccess([2]),authorized, eMalkhanaController.getAlleMalkhanaNoUsingStatus)
routes.get("/geteWhNoUsingStatus", createAccountLimiter,checkAccess([2]),authorized,eMalkhanaController.getAllWhNoUsingStatus)
routes.get("/getfileNoUsingStatus",createAccountLimiter,checkAccess([2]),authorized, eMalkhanaController.getAllFileNoUsingStatus)

// search  GET API
routes.post("/getDataByeMalkhanaNo",createAccountLimiter,checkAccess([2]),authorized, eMalkhanaValidation.checkeMalkhanaNo, eMalkhanaController.searchDataUsingeMalkhanaNo)

// search  GET API
routes.post("/getDataByeMalkhanaNo",createAccountLimiter,checkAccess([2]),authorized, eMalkhanaValidation.checkeMalkhanaNo, eMalkhanaController.searchDataUsingeMalkhanaNo)
routes.post("/getDataByFileNo",createAccountLimiter,checkAccess([2]),authorized, eMalkhanaValidation.searchItem, eMalkhanaController.searchDataUsingfileNo)
routes.post("/getDataByPartyName",createAccountLimiter,checkAccess([2]),authorized, eMalkhanaValidation.searchItem, eMalkhanaController.searchDataUsingPartyName)
routes.post("/getDataByItemDesc",createAccountLimiter,checkAccess([2]),authorized, eMalkhanaValidation.searchItem, eMalkhanaController.searchDataUsingItemDesc)
routes.post("/getReceiptMalkhanaDataById",createAccountLimiter,checkAccess([2]),authorized, eMalkhanaValidation.checkId, eMalkhanaController.getReceiptMalkhanaDataById)
routes.post("/getAllDataByEmalkhanaId",createAccountLimiter,checkAccess([2]),authorized, eMalkhanaValidation.checkId, eMalkhanaController.getAllDataByEmalkhanaId)

// REPORT GENERATED GET API
routes.post("/seizedUnitwise", createAccountLimiter,checkAccess([2]),authorized,eMalkhanaValidation.searchItem, eMalkhanaController.getReportUsingSeizingUnitWise)
routes.post("/seizedItemName",createAccountLimiter,checkAccess([2]),authorized, eMalkhanaValidation.searchItem, eMalkhanaController.getReportUsingSeizingItemWise)
routes.post("/getYearWiseData", createAccountLimiter,checkAccess([2]),authorized,eMalkhanaValidation.yearWiseValid, eMalkhanaController.getReportUsingYearWise)

// updateAPI
routes.post("/updateSpecficFieldByid",createAccountLimiter,checkAccess([1]),authorized, eMalkhanaValidation.eMalkhanaValidationSpecificFeilds, eMalkhanaController.updateSpecficFieldByid)
routes.post("/updateEmalkhana",createAccountLimiter,checkAccess([1]),authorized, eMalkhanaValidation.eMalkhanaValidationSpecificFeilds, eMalkhanaController.updateMalkhana)
routes.post("/deleteDocumentBasedOnEmalkhanaNo",checkAccess([1]),authorized,createAccountLimiter, eMalkhanaValidation.deleteDocumentBasedOnEmalkhanaNo, eMalkhanaController.deleteDocumentBasedOnEmalkhanaNo)


// --------------------------REOPEN UPDATE API---------------------------------------------------//
routes.post("/updateReOpenApi", createAccountLimiter,checkAccess([1]),authorized,reOpenValidation.reOpenValidation, eMalkhanaController.reOpenUpdateUsingMultipleMalkhanaNo)

// ------------------------------------receipt API---------------------------------//
// post API
routes.post("/insertReceipt",checkAccess([1]),authorized,createAccountLimiter, receiptController.insertReceiptDetails)

// get API
routes.get("/receipt",createAccountLimiter,checkAccess([2]),authorized, receiptController.getReceiptDetails)
routes.post("/receiptById", createAccountLimiter,checkAccess([2]),authorized,receiptValidation.checkId, receiptController.receiptDataById)

// SEARCH Data get API
routes.post("/receiptDetailsByeMalkhanaNo", createAccountLimiter,checkAccess([2]),authorized,receiptValidation.checkeMalkhanaNo, receiptController.searchDataUsingeMalkhanaNo)
routes.post("/wackNo",createAccountLimiter,checkAccess([2]),authorized, receiptValidation.whAckNo, receiptController.searchDataUsingWackNo)
routes.post("/checkAdjucationOrderNo",createAccountLimiter,checkAccess([2]),authorized, receiptValidation.searchItem, receiptController.searchDataByAdjucationOrderNo)
routes.post("/getAllDataBasedOnEmalkhanaNumber",createAccountLimiter, checkAccess([2]),authorized,receiptValidation.checkeMalkhanaNo, receiptController.getAllDataBasedOnEmalkhanaNumber)
routes.post("/getEmalkhanaDataBasedonWhackNo",createAccountLimiter,checkAccess([2]),authorized, receiptValidation.whAckNo, receiptController.getEmalkhanaDataBasedonWhackNo)


// REPORT GENERATION get API
routes.post("/godownName",createAccountLimiter,checkAccess([2]),authorized, receiptValidation.searchItem, receiptController.getReportDataByGodownName)
routes.post("/godownCode", createAccountLimiter,checkAccess([2]),authorized,receiptValidation.searchItem, receiptController.getReportDataByGodownCode)
routes.post("/pendingSection",createAccountLimiter,checkAccess([2]),authorized, receiptValidation.searchItem, receiptController.reportOfPendingUnderSection)
routes.post("/ripeDisposal",createAccountLimiter,checkAccess([2]),authorized, receiptValidation.searchItem, receiptController.reportOfRipeForDisposal)
routes.post("/reportsBasedOnDate", createAccountLimiter,checkAccess([2]),authorized,receiptValidation.reportsBasedOnDate, receiptController.reportsBasedOnDate)

// update API
routes.post("/updateReceiptData", createAccountLimiter,checkAccess([1]),authorized,receiptValidation.receiptUpdateValidation, receiptController.updateReceipt)
routes.post("/updateSpecificFieldsReceiptData", createAccountLimiter,checkAccess([1]),authorized,receiptValidation.receiptValidationSpecificFeilds, receiptController.updateReceiptSpecificFields)

// -------------------------------------------DISPOSAL DETAILS API-----------------------------------------//
// POST API
routes.post("/disposalDetails",createAccountLimiter, checkAccess([1]),authorized, disposalValidation.disposalValidation, disposalController.disposalDataDetails)

// GET API
routes.get("/disposalDetails",createAccountLimiter,checkAccess([2]),authorized, disposalController.getdisposalDetails)
routes.post("/disposalById",createAccountLimiter,checkAccess([2]),authorized, disposalValidation.checkId, disposalController.disposalDataById)

// UPDATE API
routes.post("/updateDisposalDetails",createAccountLimiter,checkAccess([1]),authorized, disposalValidation.checkId, disposalController.updateDisposalDetails)

// SEARCH DATA GET API
routes.post("/disposalDataUsingeMalkhanaNo",createAccountLimiter,checkAccess([2]),authorized, disposalValidation.checkeMalkhanaNo, disposalController.searchDataUsingeMalkhanaNo)
routes.post("/disposalDetailsByWackNo",createAccountLimiter, checkAccess([2]),authorized,disposalValidation.whAckNo, disposalController.searchDataUsingWackNo)
routes.post("/getAllDataByEmalkhanaNo",createAccountLimiter,checkAccess([2]),authorized, disposalValidation.checkeMalkhanaNo, disposalController.getAllDataByEmalkhanaNo)
routes.post("/getAllDataBasedOnWhackNo",createAccountLimiter,checkAccess([2]),authorized, disposalValidation.whAckNo, disposalController.getAllDataBasedOnWhackNo)



module.exports = routes