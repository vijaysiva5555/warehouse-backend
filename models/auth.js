const { default: mongoose } = require("mongoose")
const jwt = require("jsonwebtoken")
const db = require('../models/mongo');

const authorized = async (req, res, next) => {
    try {
        let token, decodedToken, signToken, checkcreator
        token = req.headers.authorization
        if (!token) {
            return res.send("Token is missing")
        }
        token = token.substring(7)
        if (token) {
            // decodedToken=jwt.decode(token)
            signToken = jwt.verify(token,process.env.SECREATKEY)
            if (!signToken) {
                return res.send("you are not an authorized person")
            }
            if (signToken) {
                checkcreator = await db.findSingleDocument("user",{ email: signToken.email, _id: new mongoose.Types.ObjectId(signToken.userId) })
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

