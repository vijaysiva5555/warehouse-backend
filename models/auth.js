const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const db = require("../models/mongo");

const authorized = async (req, res, next) => {
  try {
    let token, signToken, checkcreator, privateKey;
    token = req.cookies.userToken;
    if (token == null) {
      return res.status(401).send("Unauthorized Access");
    }
    privateKey = await fs.readFile("privateKey.key", "utf8");
    if (token) {
      signToken = jwt.verify(token, privateKey);
      if (!signToken) {
        return res.status(401).send("Unauthorized Access");
      }
      if (signToken) {
        checkcreator = await db.findSingleDocument("user", {
          email: signToken.email,
          _id: new mongoose.Types.ObjectId(signToken.userId),
        });
        if (!checkcreator) {
          return res.status(401).send("Unauthorized Access");
        } else {
          res.locals.userData = signToken;
          next();
        }
      }
    }
  } catch (error) {
    return res.status(401).send("Unauthorized Access");
  }
};
module.exports = { authorized };
