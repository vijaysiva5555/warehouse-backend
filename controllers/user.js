const db = require("../models/mongo")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const fs = require('fs').promises
const mongoose = require("mongoose")

const register = async (req, res) => {
    try {
        let userRegistration = req.body, registration, checkEmail
        checkEmail = await db.findOneDocumentExists("user", { email: userRegistration.email })
        if (checkEmail === true) {
            return res.send({ status: 1, msg: "email Already Exists" })
        }
        userRegistration.password = bcrypt.hashSync(userRegistration.password, 10)
        registration = await db.insertSingleDocument("user", userRegistration)
        if (registration) {
            return res.send({ status: 1, msg: "user successfully register" })
        }
    } catch (error) {
        return res.send(error.message)
    }
}
const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body, checkEmail, privateKey
        checkEmail = await db.findSingleDocument("user", { email: email })
        if (!checkEmail) {
            return res.send({ status: 0, msg: "you are not registered" })
        }
        privateKey = await fs.readFile('privateKey.key', 'utf8');
        bcrypt.compare(password, checkEmail.password, function (err, result) {
            if (result == true) {
                let token = jwt.sign({
                    userId: checkEmail._id,
                    email: checkEmail.email,
                    role: checkEmail.role
                }, privateKey, { algorithm: 'RS256' })
                if (token) {
                    return res.send({ status: 1, msg: "login succesfully", data: token })
                }
            } else if (err) {
                return res.send({ status: 0, msg: "invalid credentials" })
            }
            return res.send({ status: 0, msg: "invalid credentials" })
        })
    } catch (error) {
        return res.send(error.message)
    }
}
const userDataById = async (req, res) => {
    try {
        let userId = req.body, userData
        if (!mongoose.isValidObjectId(userId.id)) {
            return res.send({ status: 0, msg: "invalid id" })
        }
        userData = await db.findSingleDocument("user", { _id: new mongoose.Types.ObjectId(userId.id) }, { password: 0 })
        if (userData !== null) {

            return res.send({ status: 1, data: userData })
        }
        return res.send({ status: 1, data: [] })
    } catch (error) {
        return res.send(error.message)
    }
}

module.exports = { register, loginUser, userDataById }
