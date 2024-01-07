const db = require("../models/mongo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const mongoose = require("mongoose");

const createUser = async (req, res) => {
	try {
		const userRegistration = req.body;
		const checkEmail = await db.findOneDocumentExists("user", {
			email: userRegistration.email,
		});
		if (checkEmail === true) {
			return res.send({ status: 1, msg: "This Email Already Exists" });
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
			return res.send({ status: 1, msg: "User created successfully" });
		}
	} catch (error) {
		return res.send({ status: 0, msg: error.message });
	}
};
const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		const checkEmail = await db.findSingleDocument("user", {
			email, status: 2
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

const changePassword = async (req, res) => {
	try {
		let { currentPassword, password, id, confirmPassword } = req.body, userData, updatePassword;
		userData = await db.findSingleDocument("user", { _id: new mongoose.Types.ObjectId(id) });
		if (!userData) {
			return res.send({ status: 0, msg: "Invalid Request" })
		}
		if (password !== confirmPassword) {
			return res.send({ status: 0, msg: "password & confirm Password not match" })
		}
		bcrypt.compare(currentPassword, userData.password,async function (err, result) {
			if (result === false) {
				return res.send({ status: 0, msg: "Current password is wrong" })
			} else if (result === true) {
				password = bcrypt.hashSync(password, 10)
				updatePassword = await db.findByIdAndUpdate("user", id, { password: password });
				if (updatePassword.matchedCount == 1 && updatePassword.modifiedCount == 1) {
					return res.send({ status: 1, msg: 'Password changed successfully' });
				} else {
					return res.send({ status: 0, msg: 'Failed to change password' });
				}
			}
		})
	} catch (error) {
		return res.send({ status: 0, msg: error.message });
	}
}

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

const getUserList = async (req, res) => {
	const getUserList = await db.findDocuments("user", { role: { $ne: 1 } }, { password: 0, updatedAt: 0 })
	try {
		if (getUserList) {
			return res.send({ status: 1, data: getUserList });
		} else {
			return res.send({ status: 1, data: [] });
		}
	} catch (error) {
		return res.send({ status: 0, msg: error.message });
	}

};
module.exports = { createUser, loginUser, userDataById, getUserList, changePassword };
