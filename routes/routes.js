const express = require("express")
const routes = express.Router()
const { authorized } = require("../models/auth")
const { checkAccess } = require("../models/common")

//import controller
const userController = require("../controllers/user")
const receiptController = require("../controllers/receiptDetails")
const eMalkhanaController = require("../controllers/eMalkhana")
const disposalController = require("../controllers/disposalDetails")

//import validation
const userValidation = require("../validation/user")
const receiptValidation = require("../validation/receiptDetails")
const eMalkhanaValidation = require("../validation/eMalkhana")
const disposalValidation = require("../validation/disposalDetails")

//import API

//User API
routes.post("/register", userValidation.userValidation, userController.register)
routes.post("/login", userValidation.loginnCreator, userController.loginUser)
routes.post("/userDataById", userValidation.checkId, userController.userDataById)

//-------------------------eMalkhana API-------------------------------//
//post api
routes.post("/insertEMalkhana",eMalkhanaValidation.eMalkhanaValidation, eMalkhanaController.insertEMalkhanaDetails) // checkAccess([2]),   //done

//get api
routes.get("/eMalkhana", eMalkhanaController.getEmakhalaDetails)
routes.post("/getDataUsingeMalkhanaById", eMalkhanaValidation.checkId, eMalkhanaController.eMalkhanaDataById)

//search  GET API
routes.post("/getDataByeMalkhanaNo", eMalkhanaValidation.checkeMalkhanaNo, eMalkhanaController.searchDataUsingeMalkhanaNo)
routes.post("/getDataByFileNo", eMalkhanaValidation.fileNo, eMalkhanaController.searchDataUsingfileNo)
routes.post("/getDataByImporterName", eMalkhanaValidation.importerName, eMalkhanaController.searchDataUsingImporterName)
routes.post("/getDataByImporterAddress", eMalkhanaValidation.importerAddress, eMalkhanaController.searchDataUsingImporterAddress)
routes.post("/getDataByItemDesc", eMalkhanaValidation.itemDesc, eMalkhanaController.searchDataUsingItemDesc)

//REPORT GENERATED GET API
routes.post("/seizedUnitwise", eMalkhanaValidation.SeizingUnitWise, eMalkhanaController.getReportUsingSeizingUnitWise)
routes.post("/seizedItemName", eMalkhanaValidation.SeizingItemWise, eMalkhanaController.getReportUsingSeizingItemWise)

//updateAPI
routes.post("/updateEmalkhana",eMalkhanaValidation.checkId, eMalkhanaController.updateMalkhana)
// routes.post("/feilds", eMalkhanaValidation.checkeMalkhanaNo, eMalkhanaController.updateeMalkhanaDataByFeilds)

//--------------------------REOPEN UPDATE API---------------------------------------------------//

//routes.post("/updateApi",eMalkhanaController.updateReopenDataUsingeMalkhanaNo)



//------------------------------------receipt API---------------------------------//
//post API
routes.post("/insertReceipt", receiptValidation.receiptValidation, receiptController.insertReceiptDetails)

//get API
routes.get("/receipt", receiptController.getReceiptDetails)
routes.get("/receiptById", receiptValidation.checkId, receiptController.receiptDataById)

//SEARCH Data get API
routes.get("/receiptDetailsByeMalkhanaNo", receiptValidation.checkeMalkhanaNo, receiptController.searchDataUsingeMalkhanaNo)
routes.get("/wackNo", receiptValidation.whAckNo, receiptController.searchDataUsingWackNo)
routes.get("/adjudiction", receiptController.searchDataByAdjucationOrderNo)
routes.post("/getAllDataBasedOnEmalkhanaNumber",receiptValidation.checkeMalkhanaNo, receiptController.getAllDataBasedOnEmalkhanaNumber)
routes.post("/getEmalkhanaDataBasedonWhackNo",receiptValidation.whAckNo, receiptController.getEmalkhanaDataBasedonWhackNo)


//REPORT GENERATION get API
routes.post("/godownName", receiptValidation.godownName, receiptController.getReportDataByGodownName)
routes.post("/godownCode", receiptValidation.godownCode, receiptController.getReportDataByGodownCode)
routes.post("/pendingSection", receiptValidation.pendingSection, receiptController.reportOfPendingUnderSection)
routes.post("/ripeDisposal", receiptValidation.ripeDisposal, receiptController.reportOfRipeForDisposal)

//update API
// routes.post("/updateAllReceiptDetailsDetails", authorized, receiptValidation.checkId, receiptController.updateAllReceiptDetails)
routes.post("/updateFeilds", receiptValidation.checkIdFeilds, receiptController.updateReceipt)

//-------------------------------------------DISPOSAL DETAILS API-----------------------------------------//
// POST API
routes.post("/disposalDetails", authorized, disposalValidation.disposalValidation, disposalController.disposalDataDetails)

//GET API
routes.get("/disposalDetails", disposalController.getdisposalDetails)
routes.post("/disposalById", authorized, disposalValidation.checkId, disposalController.disposalDataById)

//UPDATE API
routes.post("/updateDisposalDetails", authorized, disposalValidation.checkId, disposalController.updateDisposalDetails)

//SEARCH DATA GET API
routes.post("/disposalDataUsingeMalkhanaNo", disposalValidation.checkeMalkhanaNo, disposalController.searchDataUsingeMalkhanaNo)
routes.post("disposalDetailsByWackNo", disposalValidation.whAckNo, disposalController.searchDataUsingWackNo)



module.exports = routes