const { check, validationResult } = require('express-validator')

const disposalRecoveryValidation = [
    check('disposalRecovery').notEmpty().withMessage('disposalRecovery is required'),
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
module.exports = {disposalRecoveryValidation,checkId }