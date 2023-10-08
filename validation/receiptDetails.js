const { check, validationResult } = require("express-validator");

const receiptValidation = [
	check("eMalkhanaId").notEmpty().withMessage("eMalkhanaId is required"),
	check("eMalkhanaNo").notEmpty().withMessage(" eMalkhanaNo is required"),
	check("packageDetails.current")
		.notEmpty()
		.withMessage("packageDetails is required"),
	check("godownName.current")
		.notEmpty()
		.withMessage("godownName is required"),
	check("godownCode.current")
		.notEmpty()
		.withMessage("godownCode is required"),
	check("locationOfPackageInGodown.current")
		.notEmpty()
		.withMessage("locationOfPackageInGodown is required"),
	check("handingOverOfficerName.current")
		.notEmpty()
		.withMessage("handingOverOfficerName is required"),
	check("handingOverOfficerDesignation.current")
		.notEmpty()
		.withMessage("handingOverOfficerDesignation is required"),
	check("pendingUnderSection.current")
		.notEmpty()
		.withMessage("pendingUnderSection is required"),
	check("ripeForDisposal")
		.notEmpty()
		.withMessage("ripeForDisposal is required"),
	check("itemDesc.current")
		.notEmpty()
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
const godownName = [
	check("godownName")
		.notEmpty()
		.withMessage("godown Name should be required"),
	(req, res, next) => {
		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.send({ status: 0, msg: errors[0].msg });
		}
		return next();
	},
];
const godownCode = [
	check("godownCode")
		.notEmpty()
		.withMessage("godown Code should be required"),
	(req, res, next) => {
		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.send({ status: 0, msg: errors[0].msg });
		}
		return next();
	},
];
const pendingSection = [
	check("pendingUnderSection")
		.notEmpty()
		.withMessage("pending UnderSection should be required"),
	(req, res, next) => {
		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.send({ status: 0, msg: errors[0].msg });
		}
		return next();
	},
];
const ripeDisposal = [
	check("ripeForDisposal")
		.notEmpty()
		.withMessage("ripe For Disposal should be required"),
	(req, res, next) => {
		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.send({ status: 0, msg: errors[0].msg });
		}
		return next();
	},
];
const checkIdFeilds = [
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
const whAckNo = [
	check("whAckNo").notEmpty().withMessage("whAckNo should be required"),
	(req, res, next) => {
		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.send({ status: 0, msg: errors[0].msg });
		}
		return next();
	},
];
const adjucationOrderNo = [
	check("adjucationOrderNo")
		.notEmpty()
		.withMessage("adjucationOrderNo should be required"),
	(req, res, next) => {
		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.send({ status: 0, msg: errors[0].msg });
		}
		return next();
	},
];

const receiptUpdateValidation = [
	check("id").notEmpty().withMessage("id is required"),
	// check('eMalkhanaId').notEmpty().withMessage('eMalkhanaId is required'),
	// check('eMalkhanaNo').notEmpty().withMessage(' eMalkhanaNo is required'),
	check("packageDetails.current")
		.notEmpty()
		.withMessage("packageDetails is required"),
	check("godownName.current")
		.notEmpty()
		.withMessage("godownName is required"),
	check("godownCode.current")
		.notEmpty()
		.withMessage("godownCode is required"),
	check("locationOfPackageInGodown.current")
		.notEmpty()
		.withMessage("locationOfPackageInGodown is required"),
	check("handingOverOfficerName.current")
		.notEmpty()
		.withMessage("handingOverOfficerName is required"),
	check("handingOverOfficerDesignation.current")
		.notEmpty()
		.withMessage("handingOverOfficerDesignation is required"),
	check("pendingUnderSection.current")
		.notEmpty()
		.withMessage("pendingUnderSection is required"),
	// check('ripeForDisposal').notEmpty().withMessage('ripeForDisposal is required'),
	check("itemDesc.current")
		.notEmpty()
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

	(req, res, next) => {
		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.send({ status: 0, msg: errors[0].msg });
		}
		return next();
	},
];

const receiptValidationSpecificFeilds = [
	check("id").notEmpty().withMessage("id is required"),
	check("packageDetails.current")
		.notEmpty()
		.withMessage("packageDetails is required"),
	check("godownName.current")
		.notEmpty()
		.withMessage("godownName is required"),
	check("godownCode.current")
		.notEmpty()
		.withMessage("godownCode is required"),
	check("locationOfPackageInGodown.current")
		.notEmpty()
		.withMessage("locationOfPackageInGodown is required"),
	check("handingOverOfficerName.current")
		.notEmpty()
		.withMessage("handingOverOfficerName is required"),
	check("handingOverOfficerDesignation.current")
		.notEmpty()
		.withMessage("handingOverOfficerDesignation is required"),
	check("pendingUnderSection.current")
		.notEmpty()
		.withMessage("pendingUnderSection is required"),

	(req, res, next) => {
		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.send({ status: 0, msg: errors[0].msg });
		}
		return next();
	},
];

module.exports = {
	receiptValidation,
	checkId,
	godownCode,
	godownName,
	pendingSection,
	ripeDisposal,
	checkIdFeilds,
	checkeMalkhanaNo,
	whAckNo,
	adjucationOrderNo,
	receiptUpdateValidation,
	receiptValidationSpecificFeilds,
};
