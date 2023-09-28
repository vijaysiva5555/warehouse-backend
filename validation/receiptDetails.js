const { check, validationResult } = require('express-validator')

const receiptValidation = [
    check('id').notEmpty().withMessage('id is required'),
    check('eMalkhanaId').notEmpty().withMessage('eMalkhanaId is required'),
    check('eMalkhanaNo').notEmpty().withMessage(' eMalkhanaNo is required'),
    check('packageDetails').notEmpty().withMessage('packageDetails is required'),
    check('godownName').notEmpty().withMessage('godownName is required'),
    check('godownCode').notEmpty().withMessage('godownCode is required'),
    check('locationOfPackageInGodown').notEmpty().withMessage('locationOfPackageInGodown is required'),
    check('handingOverOfficerName').notEmpty().withMessage('handingOverOfficerName is required'),
    check('handingOverOfficerDesignation').notEmpty().withMessage('handingOverOfficerDesignation is required'),
    check('pendingUnderSection').notEmpty().withMessage('pendingUnderSection is required'),
    check('ripeForDisposal').notEmpty().withMessage('ripeForDisposal is required'),
    (req, res, next) => {
        const errors = validationResult(req).array()
        if (errors.length > 0) {
            return res.send({ status: 0, response: errors[0].msg })
        } return next()
    }]
    const checkId = [
        check('id').notEmpty().withMessage('id should be required'),
        (req, res, next) => {
            const errors = validationResult(req).array()
            if (errors.length > 0) {
                return res.send({ status: 0, response: errors[0].msg })
            } return next()
        }
    ]
module.exports = { receiptValidation,checkId }