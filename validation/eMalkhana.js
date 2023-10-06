const { check, validationResult } = require('express-validator')

const eMalkhanaValidation = [
    check('status').notEmpty().withMessage('status is required'),
    check('seizingUnitName').notEmpty().withMessage('seizingUnitName is required'),
    check('fileNo').notEmpty().withMessage('fileNo is required'),
    check('importerName').notEmpty().withMessage('importerName is required'),
    check('importerAddress').notEmpty().withMessage('importerAddress is required'),
    check('placeOfSeizure').notEmpty().withMessage(' placeOfSeizure is required'),
    check('seizedItemName').notEmpty().withMessage('seizedItemName is required'),
    check('seizedItemWeight').notEmpty().withMessage('seizedItemWeight is required'),
    check('seizedItemValue').notEmpty().withMessage('seizedItemValue is required'),
    check('seizingOfficerName').notEmpty().withMessage('seizingOfficerName is required'),
    check('seizingOfficerDesignation').notEmpty().withMessage('seizingOfficerDesignation is required'),
    check('seizingOfficerSealNo').notEmpty().withMessage('seizingOfficerSealNo is required'),
    check('createdBy').notEmpty().withMessage('createdBy is required'),

    (req, res, next) => {
        const errors = validationResult(req).array()
        if (errors.length > 0) {
            return res.send({ status: 0, msg: errors[0].msg })
        } return next()
    }]
    const checkId = [
        check('id').notEmpty().withMessage('id should be required'),
        (req, res, next) => {
            const errors = validationResult(req).array()
            if (errors.length > 0) {
                return res.send({ status: 0, msg: errors[0].msg })
            } return next()
        }
    ]
    const checkeMalkhanaNo = [
        check('eMalkhanaNo').notEmpty().withMessage('eMalkhanaNo should be required'),
        (req, res, next) => {
            const errors = validationResult(req).array()
            if (errors.length > 0) {
                return res.send({ status: 0, msg: errors[0].msg })
            } return next()
        }
    ]
    const SeizingUnitWise = [
        check('seizingUnitName').notEmpty().withMessage('seizing Unit Name should be required'),
        (req, res, next) => {
            const errors = validationResult(req).array()
            if (errors.length > 0) {
                return res.send({ status: 0, msg: errors[0].msg })
            } return next()
        }
    ]
    const SeizingItemWise = [
        check('seizedItemName.current').notEmpty().withMessage('seizing Item Name should be required'),
        (req, res, next) => {
            const errors = validationResult(req).array()
            if (errors.length > 0) {
                return res.send({ status: 0, msg: errors[0].msg })
            } return next()
        }
    ]
    const fileNo = [
        check('fileNo').notEmpty().withMessage('file No should be required'),
        (req, res, next) => {
            const errors = validationResult(req).array()
            if (errors.length > 0) {
                return res.send({ status: 0, msg: errors[0].msg })
            } return next()
        }
    ]
    const itemDesc = [
        check('itemDesc.current').notEmpty().withMessage('itemDesc should be required'),
        (req, res, next) => {
            const errors = validationResult(req).array()
            if (errors.length > 0) {
                return res.send({ status: 0, msg: errors[0].msg })
            } return next()
        }
    ]
    const importerName = [
        check('importerName').notEmpty().withMessage('importerName should be required'),
        (req, res, next) => {
            const errors = validationResult(req).array()
            if (errors.length > 0) {
                return res.send({ status: 0, msg: errors[0].msg })
            } return next()
        }
    ]
    const importerAddress = [
        check('importerAddress').notEmpty().withMessage('importerAddress should be required'),
        (req, res, next) => {
            const errors = validationResult(req).array()
            if (errors.length > 0) {
                return res.send({ status: 0, msg: errors[0].msg })
            } return next()
        }
    ]


module.exports = { eMalkhanaValidation,checkId,checkeMalkhanaNo,SeizingUnitWise,SeizingItemWise,fileNo,itemDesc,importerName,importerAddress }