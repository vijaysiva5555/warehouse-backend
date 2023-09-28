const { check, validationResult } = require('express-validator')

const disposalValidation = [
    check('whAckNo').notEmpty().withMessage('whAckNo is required'),
    check('eMalkhanaId').notEmpty().withMessage('eMalkhanaId is required'),
    check('eMalkhanaNo').notEmpty().withMessage('eMalkhanaNo is required'),
    check('disposalMethod').notEmpty().withMessage('disposalMethod is required'),
    check('disposalType').notEmpty().withMessage('disposalType is required'),
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
module.exports = {disposalValidation,checkId }