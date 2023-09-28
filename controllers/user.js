const db = require("../models/mongo")
const user = async (req, res) => {
    try {
        let userDetails = req.body, userRegistration
        userRegistration = await db.insertSingleDocument("user", userDetails)
        if (userRegistration) {
            return res.send({ status: 1, msg: "user successfully register", data: userRegistration })
        }
    } catch (error) {
        return res.send(error.message)
    }
}
module.exports = { user }
