const express = require("express")
const routes = express.Router()
const {authorized} = require("../models/auth")

//import controller
const userController = require("../controllers/user")
const receiptController = require("../controllers/receiptDetails")
const eMalkhanaController = require("../controllers/eMalkhana")
const disposalController = require("../controllers/disposalDetails")
const disposalRecovery = require("../controllers/disposalRecovery")
const updateController = require("../controllers/updateData")
const previousController = require("../controllers/previousData")
//import validation
const userValidation = require("../validation/user")
const receiptValidation = require("../validation/receiptDetails")
const eMalkhanaValidation = require("../validation/eMalkhana")
const disposalValidation = require("../validation/disposalDetails")
const disposalRecoveryValidation = require("../validation/disposalRecoveryValidation")
const updateValidation = require("../validation/updateData")
const previousDataValidation = require("../validation/previousData")

//import API
//User API
routes.post("/user", userValidation.userValidation, userController.user)
routes.post("/login", userValidation.loginnCreator, userController.loginUser)

//eMalkhana API
routes.post("/eMalkhana",authorized,eMalkhanaValidation.eMalkhanaValidation,eMalkhanaController.eMalkhanaDetails)
routes.post("/update",authorized,eMalkhanaValidation.checkId,eMalkhanaController.updateEmakhala)
routes.get("/eMalkhana",eMalkhanaController.getEmakhalaDetails )

//receipt API
routes.post("/receipt",authorized,receiptValidation.receiptValidation,receiptController.receiptDetails)
routes.get("/receipt",receiptController.getReceiptDetails)
routes.post("/updateReceiptDetails",authorized,receiptValidation.checkId,receiptController.updateReceipt)

//disposalDetails API
routes.post("/disposalDetails",authorized,disposalValidation.disposalValidation,disposalController.disposalDataDetails)
routes.get("/disposalDetails",disposalController.getdisposalDetails)
routes.post("/updateDisposalDetails",authorized,disposalValidation.checkId,disposalController.updateDisposalDetails)

//disposalDataRecovery API
routes.post("/recoveryData",authorized,disposalRecoveryValidation.disposalRecoveryValidation,disposalRecovery.disposalRecoveryDetails)
routes.get("/recoveryData",disposalRecovery.getdisposalRecoveryDetails)
routes.post("/updateRecoveryDataDetails",authorized,disposalRecoveryValidation.checkId,disposalRecovery.updateDisposalRecoveryDetails)

//updateData API
routes.post("/updateData",authorized,updateValidation.updateDataValidation,updateController.insertUpdateData)
routes.get("/updateData",updateController.getUpdateDataDetails)
routes.post("/updateDataDetails",authorized,updateValidation.checkId,updateController.updateData)

//previousData API
routes.post("/previousData",authorized,previousDataValidation.previousDataValidation,previousController.insertPreviousData)
routes.get("/previousData",previousController.getPreviousDataDetails)
routes.post("/updatePreviousDataDetails",authorized,previousDataValidation.checkId,previousController.updatePreviousData)

module.exports = routes