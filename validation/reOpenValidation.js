const { check, validationResult } = require("express-validator");

const reOpenValidation = [
	check("updateEmalkhanas").notEmpty().withMessage("E-Malkhana Numbers are required to Reopen"),
	check("reOpenReason").notEmpty().withMessage("Reason is required for reopen"),
	check("reOpenDate").notEmpty().withMessage("Reopen date is required"),
	check("handOverOfficerName")
		.notEmpty()
		.withMessage("Receiving Officer Name is required"),
	check("handOverOfficerDesignation")
		.notEmpty()
		.withMessage("Receiving Officer Designation is required"),
	check("preOpenTrail").notEmpty().withMessage("Pre OpenTrail is required"),
	check("preOpenTrailDetails")
		.exists()
		.isString()
		.withMessage("PreOpen Trail Details is required if preopen trail is yes"),
	check("sampleDrawn").notEmpty().withMessage("Sample Drawn is required"),
	check("sampleDrawnDetails")
		.exists()
		.isString()
		.withMessage("Sample Drawn Details is required if Sample Drawn is Yes"),
	(req, res, next) => {
		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.send({ status: 0, msg: errors[0].msg });
		}
		return next();
	},
];
module.exports = { reOpenValidation };
