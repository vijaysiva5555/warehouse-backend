const { check, validationResult } = require("express-validator");

const eMalkhanaValidation = [
	check("status").notEmpty().withMessage("status is required"),
	check("seizingUnitName")
		.notEmpty()
		.withMessage("seizingUnitName is required"),
	check("fileNo").notEmpty().withMessage("fileNo is required"),
	check("placeOfSeizure")
		.notEmpty()
		.withMessage(" placeOfSeizure is required"),
	check("itemDesc.current")
		.isString()
		.withMessage("itemDesc-current is required"),
	check("seizedItemName.current")
		.notEmpty()
		.withMessage("seizedItemName-current is required"),
	check("seizedItemWeight.current")
		.notEmpty()
		.withMessage("seizedItemWeight-current is required"),
	check("seizedItemValue.current")
		.notEmpty()
		.withMessage("seizedItemValue-current is required"),
	check("seizingOfficerName")
		.notEmpty()
		.withMessage("seizingOfficerName is required"),
	check("seizingOfficerDesignation")
		.notEmpty()
		.withMessage("seizingOfficerDesignation is required"),
	check("seizingOfficerSealNo")
		.notEmpty()
		.withMessage("seizingOfficerSealNo is required"),
	check("partyDetails.*.partyName")
		.notEmpty()
		.withMessage("partyName is required"),
	check("partyDetails.*.partyAddress")
		.notEmpty()
		.withMessage("partyAddress is required"),

	(req, res, next) => {
		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.send({ status: 0, msg: errors[0].msg });
		}
		return next();
	},
];
const checkId = [
	check("id").notEmpty().withMessage("id should be required"),
	(req, res, next) => {
		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.send({ status: 0, msg: errors[0].msg });
		}
		return next();
	},
];
const checkeMalkhanaNo = [
	check("eMalkhanaNo")
		.notEmpty()
		.withMessage("eMalkhanaNo should be required"),
	(req, res, next) => {
		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.send({ status: 0, msg: errors[0].msg });
		}
		return next();
	},
];
const SeizingUnitWise = [
	check("seizingUnitName")
		.notEmpty()
		.withMessage("seizing Unit Name should be required"),
	(req, res, next) => {
		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.send({ status: 0, msg: errors[0].msg });
		}
		return next();
	},
];
const SeizingItemWise = [
	check("seizedItemName.current")
		.notEmpty()
		.withMessage("seizing Item Name should be required"),
	(req, res, next) => {
		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.send({ status: 0, msg: errors[0].msg });
		}
		return next();
	},
];
const fileNo = [
	check("fileNo").notEmpty().withMessage("file No should be required"),
	(req, res, next) => {
		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.send({ status: 0, msg: errors[0].msg });
		}
		return next();
	},
];
const searchItem = [
	check("searchItem").notEmpty().withMessage("searchItem should be required"),
	(req, res, next) => {
		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.send({ status: 0, msg: errors[0].msg });
		}
		return next();
	},
];
const importerName = [
	check("importerName")
		.notEmpty()
		.withMessage("importerName should be required"),
	(req, res, next) => {
		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.send({ status: 0, msg: errors[0].msg });
		}
		return next();
	},
];
const importerAddress = [
	check("importerAddress")
		.notEmpty()
		.withMessage("importerAddress should be required"),
	(req, res, next) => {
		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.send({ status: 0, msg: errors[0].msg });
		}
		return next();
	},
];

const yearWiseValid = [
	check("year").notEmpty().withMessage("year should be required"),
	(req, res, next) => {
		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.send({ status: 0, msg: errors[0].msg });
		}
		return next();
	},
];

const deleteDocumentBasedOnEmalkhanaNo = [
	check("id").notEmpty().withMessage("ID should be required"),
	check("href").notEmpty().withMessage("File Path should be required"),
	(req, res, next) => {
		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.send({ status: 0, msg: errors[0].msg });
		}
		return next();
	},
];

const eMalkhanaValidationSpecificFeilds = [
	check("id").notEmpty().withMessage("id is required"),
	check("seizedItemWeight.current")
		.notEmpty()
		.withMessage("seizedItemWeight-current is required"),
	check("seizedItemValue.current")
		.notEmpty()
		.withMessage("seizedItemValue-current is required"),

	(req, res, next) => {
		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.send({ status: 0, msg: errors[0].msg });
		}
		return next();
	},
];

module.exports = {
	eMalkhanaValidation,
	checkId,
	checkeMalkhanaNo,
	SeizingUnitWise,
	SeizingItemWise,
	eMalkhanaValidationSpecificFeilds,
	fileNo,
	searchItem,
	importerName,
	importerAddress,
	deleteDocumentBasedOnEmalkhanaNo,
	yearWiseValid,
};
