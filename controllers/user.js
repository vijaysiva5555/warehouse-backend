const db = require("../models/mongo")
const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken")
const user = async (req, res) => {
    try {
        let userRegistration = req.body, registration, checkEmail
        checkEmail = await db.findOneDocumentExists("user", { email:userRegistration.email })
        if (checkEmail === true) {
          return res.send({ status: 1, msg:"email Already Exists" })
        }
        userRegistration.password = bcrypt.hashSync(userRegistration.password, 10)
        registration = await db.insertSingleDocument("user", userRegistration)
        if (registration) {
          return res.send({ status: 1, msg: "user successfully register", data: registration })
        }
      } catch (error) {
        return res.send(error.message)
      }
    }
    const loginUser = async (req, res) => {
        try {
          let { email, password } = req.body, checkEmail
          checkEmail = await db.findSingleDocument("user", { email: email })
          if (!checkEmail) {
            return res.send({ status: 0, msg: "you are not registered" })
          }
          bcrypt.compare(password, checkEmail.password, function (err, result) {
            if (result == true) {
              let token = jwt.sign({
                userId: checkEmail._id,
                email: checkEmail.email,
                role:checkEmail.role
              }, process.env.SECREATKEY)
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
      
module.exports = { user,loginUser }
