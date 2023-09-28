const { check, validationResult } = require('express-validator')

const previousDataValidation = [
    check('date').notEmpty().withMessage('date is required'),
    check('data').notEmpty().withMessage('data is required'),
    check('reason').notEmpty().withMessage('reason is required'),
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
module.exports = { previousDataValidation,checkId }