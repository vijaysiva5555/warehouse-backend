const { check, validationResult } = require('express-validator')

const userValidation = [
    check('role').notEmpty().withMessage('role is required'),
    check('name').notEmpty().withMessage('name is required'),
    check('email').notEmpty().withMessage('email is required'),
    check('password').notEmpty().withMessage('password is required'),

    (req, res, next) => {
        const errors = validationResult(req).array()
        if (errors.length > 0) {
            return res.send({ status: 0, msg: errors[0].msg })
        } return next()
    }]
    const loginnCreator = [
        check('email').notEmpty().isEmail().withMessage('Email should be required and in proper format'),
        check('password').notEmpty().withMessage('Password should be required'),
        (req, res, next) => {
            const errors = validationResult(req).array()
            if (errors.length > 0) {
                return res.send({ status: 0, msg: errors[0].msg })
            } return next()
        }
    ]
    const checkId = [
        check('id').notEmpty().withMessage('id should be required'),
        (req, res, next) => {
            const errors = validationResult(req).array()
            if (errors.length > 0) {
                return res.send({ status: 0, msg: errors[0].msg })
            } return next()
        }
    ]
module.exports = { userValidation ,loginnCreator,checkId }