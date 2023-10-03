const { default: mongoose } = require("mongoose")
const jwt = require("jsonwebtoken")
const fs = require('fs').promises
const db = require('../models/mongo');

const authorized = async (req, res, next) => {
    try {
        let token, signToken, checkcreator, privateKey
        token = req.cookies.userToken
        if (token == null) {
            return res.send("Token is missing")
        }
        privateKey = await fs.readFile('privateKey.key', 'utf8');
        if (token) {
            signToken = jwt.verify(token, privateKey)
            if (!signToken) {
                return res.send("you are not an authorized person")
            }
            if (signToken) {
                checkcreator = await db.findSingleDocument("user", { email: signToken.email, _id: new mongoose.Types.ObjectId(signToken.userId) })
                if (!checkcreator) {
                    return res.send("unauthorized")
                } else {
                    next()
                }
            }
        }
    } catch (error) {
        return res.send(error.message)
    }
}
module.exports = { authorized }

