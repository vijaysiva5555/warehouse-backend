const { check, validationResult } = require('express-validator')

const receiptValidation = [
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
    const godownName = [
        check('godownName').notEmpty().withMessage('godown Name should be required'),
        (req, res, next) => {
            const errors = validationResult(req).array()
            if (errors.length > 0) {
                return res.send({ status: 0, msg: errors[0].msg })
            } return next()
        }
    ]
    const godownCode = [
        check('godownCode').notEmpty().withMessage('godown Code should be required'),
        (req, res, next) => {
            const errors = validationResult(req).array()
            if (errors.length > 0) {
                return res.send({ status: 0, msg: errors[0].msg })
            } return next()
        }
    ]
    const pendingSection = [
        check('pendingUnderSection').notEmpty().withMessage('pending UnderSection should be required'),
        (req, res, next) => {
            const errors = validationResult(req).array()
            if (errors.length > 0) {
                return res.send({ status: 0, msg: errors[0].msg })
            } return next()
        }
    ]
    const ripeDisposal = [
        check('ripeForDisposal').notEmpty().withMessage('ripe For Disposal should be required'),
        (req, res, next) => {
            const errors = validationResult(req).array()
            if (errors.length > 0) {
                return res.send({ status: 0, msg: errors[0].msg })
            } return next()
        }
    ]
    const checkIdFeilds = [
        check('id').notEmpty().withMessage('id should be required'),
        (req, res, next) => {
            const errors = validationResult(req).array()
            if (errors.length > 0) {
                return res.send({ status: 0,msg: errors[0].msg })
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
    const whAckNo = [
        check('whAckNo').notEmpty().withMessage('whAckNo should be required'),
        (req, res, next) => {
            const errors = validationResult(req).array()
            if (errors.length > 0) {
                return res.send({ status: 0, msg: errors[0].msg })
            } return next()
        }
    ]
    const adjucationOrderNo = [
        check('adjucationOrderNo ').notEmpty().withMessage('adjucationOrderNo should be required'),
        (req, res, next) => {
            const errors = validationResult(req).array()
            if (errors.length > 0) {
                return res.send({ status: 0, msg: errors[0].msg })
            } return next()
        }
    ]
    
module.exports = { receiptValidation,checkId,godownCode,godownName,pendingSection,ripeDisposal,checkIdFeilds,checkeMalkhanaNo,whAckNo,adjucationOrderNo}