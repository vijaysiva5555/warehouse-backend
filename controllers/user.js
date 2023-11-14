const db = require("../models/mongo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const mongoose = require("mongoose");

const register = async (req, res) => {
	try {
		const userRegistration = req.body;
		const checkEmail = await db.findOneDocumentExists("user", {
			email: userRegistration.email,
		});
		if (checkEmail === true) {
			return res.send({ status: 1, msg: "email Already Exists" });
		}
		userRegistration.password = bcrypt.hashSync(
			userRegistration.password,
			10
		);
		const registration = await db.insertSingleDocument(
			"user",
			userRegistration
		);
		if (registration) {
			return res.send({ status: 1, msg: "user successfully register" });
		}
	} catch (error) {
		return res.send({ status: 0, msg: error.message });
	}
};
const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		const checkEmail = await db.findSingleDocument("user", {
			email,
		});
		if (!checkEmail) {
			return res.send({ status: 0, msg: "you are not registered" });
		}
		const privateKey = await fs.readFile("privateKey.key", "utf8");
		bcrypt.compare(password, checkEmail.password, function (err, result) {
			if (result === true) {
				const token = jwt.sign(
					{
						userId: checkEmail._id,
						email: checkEmail.email,
						role: checkEmail.role,
					},
					privateKey,
					{ algorithm: "RS256" }
				);
				if (token) {
					return res.send({
						status: 1,
						msg: "login succesfully",
						data: token,
					});
				}
			} else if (err) {
				return res.send({ status: 0, msg: "invalid credentials" });
			}
			return res.send({ status: 0, msg: "invalid credentials" });
		});
	} catch (error) {
		return res.send({ status: 0, msg: error.message });
	}
};
const userDataById = async (req, res) => {
	try {
		const userId = req.body;
		if (!mongoose.isValidObjectId(userId.id)) {
			return res.send({ status: 0, msg: "invalid id" });
		}
		const userData = await db.findSingleDocument(
			"user",
			{ _id: new mongoose.Types.ObjectId(userId.id) },
			{ password: 0 }
		);
		if (userData !== null) {
			return res.send({ status: 1, data: userData });
		}
		return res.send({ status: 1, data: [] });
	} catch (error) {
		return res.send({ status: 0, msg: error.message });
	}
};

module.exports = { register, loginUser, userDataById };
