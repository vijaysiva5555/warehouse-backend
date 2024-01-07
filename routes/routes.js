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
routes.post("/login", createAccountLimiter, userValidation.loginnCreator, userController.loginUser)
routes.post("/createUser", authorized, checkAccess([1]), userValidation.userValidation, userController.createUser)
routes.post("/userDataById", createAccountLimiter, userValidation.checkId, authorized, checkAccess([2]), userController.userDataById)
routes.get("/getUserList", authorized, checkAccess([1]), createAccountLimiter, userController.getUserList)
routes.post("/manageUser", authorized, checkAccess([1]), createAccountLimiter, userController.manageUser)
routes.post("/changePassword", authorized, createAccountLimiter, userValidation.changePasswordValidation, userController.changePassword)

// -------------------------eMalkhana API-------------------------------//
// post api
routes.post("/insertEMalkhana", createAccountLimiter, authorized, checkAccess([1, 3]), eMalkhanaValidation.eMalkhanaValidation, eMalkhanaController.insertEMalkhanaDetails) // checkAccess([2]),   //done

// get api
routes.get("/eMalkhana", createAccountLimiter, authorized, checkAccess([1]), eMalkhanaController.getEmakhalaDetails)
routes.post("/getDataUsingeMalkhanaById", createAccountLimiter, authorized, eMalkhanaValidation.checkId, eMalkhanaController.eMalkhanaDataById)
routes.get("/geteMalkhanaNoUsingStatus", createAccountLimiter, authorized, checkAccess([1]), eMalkhanaController.getAlleMalkhanaNoUsingStatus)
routes.get("/geteWhNoUsingStatus", createAccountLimiter, authorized, checkAccess([1]), eMalkhanaController.getAllWhNoUsingStatus)
routes.get("/getfileNoUsingStatus", createAccountLimiter, authorized, checkAccess([1]), eMalkhanaController.getAllFileNoUsingStatus)

// search  GET API
routes.post("/getDataByeMalkhanaNo", createAccountLimiter, authorized, eMalkhanaValidation.checkeMalkhanaNo, eMalkhanaController.searchDataUsingeMalkhanaNo)

// search  GET API
routes.post("/getDataByeMalkhanaNo", createAccountLimiter, authorized, checkAccess([1, 2]), eMalkhanaValidation.checkeMalkhanaNo, eMalkhanaController.searchDataUsingeMalkhanaNo)
routes.post("/getDataByFileNo", createAccountLimiter, authorized, checkAccess([1, 2]), eMalkhanaValidation.searchItem, eMalkhanaController.searchDataUsingfileNo)
routes.post("/getDataByPartyName", createAccountLimiter, authorized, checkAccess([1, 2]), eMalkhanaValidation.searchItem, eMalkhanaController.searchDataUsingPartyName)
routes.post("/getDataByItemDesc", createAccountLimiter, authorized, checkAccess([1, 2]), eMalkhanaValidation.searchItem, eMalkhanaController.searchDataUsingItemDesc)
routes.post("/getReceiptMalkhanaDataById", createAccountLimiter, authorized, checkAccess([1, 2]), eMalkhanaValidation.checkId, eMalkhanaController.getReceiptMalkhanaDataById)
routes.post("/getAllDataByEmalkhanaId", createAccountLimiter, authorized, checkAccess([1, 2]), eMalkhanaValidation.checkId, eMalkhanaController.getAllDataByEmalkhanaId)

// REPORT GENERATED GET API
routes.post("/seizedUnitwise", createAccountLimiter, authorized, checkAccess([1, 2]), eMalkhanaValidation.searchItem, eMalkhanaController.getReportUsingSeizingUnitWise)
routes.post("/seizedItemName", createAccountLimiter, authorized, checkAccess([1, 2]), eMalkhanaValidation.searchItem, eMalkhanaController.getReportUsingSeizingItemWise)
routes.post("/getYearWiseData", createAccountLimiter, authorized, checkAccess([1, 2]), eMalkhanaValidation.yearWiseValid, eMalkhanaController.getReportUsingYearWise)

// updateAPI
routes.post("/updateSpecficFieldByid", createAccountLimiter, authorized, checkAccess([1]), eMalkhanaValidation.eMalkhanaValidationSpecificFeilds, eMalkhanaController.updateSpecficFieldByid)
routes.post("/updateEmalkhana", createAccountLimiter, authorized, checkAccess([1, 3]), eMalkhanaValidation.eMalkhanaValidationSpecificFeilds, eMalkhanaController.updateMalkhana)
routes.post("/deleteDocumentBasedOnEmalkhanaNo", authorized, checkAccess([1, 3]), createAccountLimiter, eMalkhanaValidation.deleteDocumentBasedOnEmalkhanaNo, eMalkhanaController.deleteDocumentBasedOnEmalkhanaNo)


// --------------------------REOPEN UPDATE API---------------------------------------------------//
routes.post("/updateReOpenApi", createAccountLimiter, authorized, checkAccess([1]), reOpenValidation.reOpenValidation, eMalkhanaController.reOpenUpdateUsingMultipleMalkhanaNo)

// ------------------------------------receipt API---------------------------------//
// post API
routes.post("/insertReceipt", authorized, checkAccess([1]), createAccountLimiter, receiptController.insertReceiptDetails)

// get API
routes.get("/receipt", createAccountLimiter, authorized, checkAccess([1, 2]), receiptController.getReceiptDetails)
routes.post("/receiptById", createAccountLimiter, authorized, checkAccess([1, 2]), receiptValidation.checkId, receiptController.receiptDataById)

// SEARCH Data get API
routes.post("/receiptDetailsByeMalkhanaNo", createAccountLimiter, authorized, checkAccess([1, 2]), receiptValidation.checkeMalkhanaNo, receiptController.searchDataUsingeMalkhanaNo)
routes.post("/wackNo", createAccountLimiter, authorized, checkAccess([1, 2]), receiptValidation.whAckNo, receiptController.searchDataUsingWackNo)
routes.post("/checkAdjucationOrderNo", createAccountLimiter, authorized, checkAccess([1, 2]), receiptValidation.searchItem, receiptController.searchDataByAdjucationOrderNo)
routes.post("/getAllDataBasedOnEmalkhanaNumber", createAccountLimiter, authorized, checkAccess([1, 2]), receiptValidation.checkeMalkhanaNo, receiptController.getAllDataBasedOnEmalkhanaNumber)
routes.post("/getEmalkhanaDataBasedonWhackNo", createAccountLimiter, authorized, checkAccess([1, 2]), receiptValidation.whAckNo, receiptController.getEmalkhanaDataBasedonWhackNo)


// REPORT GENERATION get API
routes.post("/godownName", createAccountLimiter, authorized, checkAccess([1, 2]), receiptValidation.searchItem, receiptController.getReportDataByGodownName)
routes.post("/godownCode", createAccountLimiter, authorized, checkAccess([1, 2]), receiptValidation.searchItem, receiptController.getReportDataByGodownCode)
routes.post("/pendingSection", createAccountLimiter, authorized, checkAccess([1, 2]), receiptValidation.searchItem, receiptController.reportOfPendingUnderSection)
routes.post("/ripeDisposal", createAccountLimiter, authorized, checkAccess([1, 2]), receiptValidation.searchItem, receiptController.reportOfRipeForDisposal)
routes.post("/reportsBasedOnDate", createAccountLimiter, authorized, checkAccess([1, 2]), receiptValidation.reportsBasedOnDate, receiptController.reportsBasedOnDate)

// update API
routes.post("/updateReceiptData", createAccountLimiter, authorized, checkAccess([1, 2]), receiptValidation.receiptUpdateValidation, receiptController.updateReceipt)
routes.post("/updateSpecificFieldsReceiptData", createAccountLimiter, authorized, checkAccess([1]), receiptValidation.receiptValidationSpecificFeilds, receiptController.updateReceiptSpecificFields)

// -------------------------------------------DISPOSAL DETAILS API-----------------------------------------//
// POST API
routes.post("/disposalDetails", createAccountLimiter, authorized, checkAccess([1, 2]), disposalValidation.disposalValidation, disposalController.disposalDataDetails)

// GET API
routes.get("/disposalDetails", createAccountLimiter, authorized, checkAccess([1, 2]), disposalController.getdisposalDetails)
routes.post("/disposalById", createAccountLimiter, authorized, checkAccess([1, 2]), disposalValidation.checkId, disposalController.disposalDataById)

// UPDATE API
routes.post("/updateDisposalDetails", createAccountLimiter, authorized, checkAccess([1, 2]), disposalValidation.checkId, disposalController.updateDisposalDetails)

// SEARCH DATA GET API
routes.post("/disposalDataUsingeMalkhanaNo", createAccountLimiter, authorized, checkAccess([1, 2]), disposalValidation.checkeMalkhanaNo, disposalController.searchDataUsingeMalkhanaNo)
routes.post("/disposalDetailsByWackNo", createAccountLimiter, authorized, checkAccess([1, 2]), disposalValidation.whAckNo, disposalController.searchDataUsingWackNo)
routes.post("/getAllDataByEmalkhanaNo", createAccountLimiter, authorized, checkAccess([1, 2]), disposalValidation.checkeMalkhanaNo, disposalController.getAllDataByEmalkhanaNo)
routes.post("/getAllDataBasedOnWhackNo", createAccountLimiter, authorized, checkAccess([1, 2]), disposalValidation.whAckNo, disposalController.getAllDataBasedOnWhackNo)



module.exports = routes