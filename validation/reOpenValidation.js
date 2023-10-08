const { check, validationResult } = require("express-validator");

const reOpenValidation = [
	check("updateMalkhanasNo")
		.notEmpty()
		.withMessage("updateMalkhanasNo is required"),
	check("reOpenReason").notEmpty().withMessage("reOpenReason is required"),
	check("reOpenDate").notEmpty().withMessage("reOpenDateis required"),
	check("handOverOfficerName")
		.notEmpty()
		.withMessage("handOverOfficerName is required"),
	check("handOverOfficerDesignation")
		.notEmpty()
		.withMessage("handOverOfficerDesignation is required"),
	check("newSealNo").notEmpty().withMessage("newSealNo is required"),
	check("newOfficerName")
		.notEmpty()
		.withMessage("newOfficerName is required"),
	check("newOfficerDesignation")
		.notEmpty()
		.withMessage("newOfficerDesignation is required"),
	(req, res, next) => {
		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.send({ status: 0, msg: errors[0].msg });
		}
		return next();
	},
];
module.exports = { reOpenValidation };
