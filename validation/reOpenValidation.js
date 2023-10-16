const { check, validationResult } = require("express-validator");

const reOpenValidation = [
	check("updateWhAckNos")
		.notEmpty()
		.withMessage("updateWhAckNos is required"),
	check("reOpenReason").notEmpty().withMessage("reOpenReason is required"),
	check("reOpenDate").notEmpty().withMessage("reOpenDateis required"),
	check("handOverOfficerName")
		.notEmpty()
		.withMessage("handOverOfficerName is required"),
	check("handOverOfficerDesignation")
		.notEmpty()
		.withMessage("handOverOfficerDesignation is required"),
	(req, res, next) => {
		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.send({ status: 0, msg: errors[0].msg });
		}
		return next();
	},
];
module.exports = { reOpenValidation };
