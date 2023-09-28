const { check, validationResult } = require('express-validator')

const userValidation = [
    check('role').notEmpty().withMessage('role is required'),
    check('name').notEmpty().withMessage('name is required'),
    (req, res, next) => {
        const errors = validationResult(req).array()
        if (errors.length > 0) {
            return res.send({ status: 0, response: errors[0].msg })
        } return next()
    }]
module.exports = { userValidation }