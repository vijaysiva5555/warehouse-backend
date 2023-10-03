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
routes.post("/register", userValidation.userValidation, userController.user)
routes.post("/login", userValidation.loginnCreator, userController.loginUser)
routes.post("/userDataById", userValidation.checkId, userController.userDataById)

//eMalkhana API
routes.post("/eMalkhana", authorized, eMalkhanaValidation.eMalkhanaValidation, eMalkhanaController.eMalkhanaDetails) // checkAccess([1]),
routes.post("/update", authorized, eMalkhanaValidation.checkId, eMalkhanaController.updateEmakhala)
routes.get("/eMalkhana", eMalkhanaController.getEmakhalaDetails)
routes.post("/eMalkhanaById", authorized, eMalkhanaValidation.checkId, eMalkhanaController.eMalkhanaDataById)

//receipt API
routes.post("/receipt", authorized, receiptValidation.receiptValidation, receiptController.receiptDetails)
routes.get("/receipt", receiptController.getReceiptDetails)
routes.post("/updateReceiptDetails", authorized, receiptValidation.checkId, receiptController.updateReceipt)
routes.post("/receiptById", receiptValidation.checkId, receiptController.receiptDataById)

//disposalDetails API
routes.post("/disposalDetails", authorized, disposalValidation.disposalValidation, disposalController.disposalDataDetails)
routes.get("/disposalDetails", disposalController.getdisposalDetails)
routes.post("/updateDisposalDetails", authorized, disposalValidation.checkId, disposalController.updateDisposalDetails)
routes.get("/disposalById", authorized, disposalValidation.checkId, disposalController.disposalDataById)

module.exports = routes