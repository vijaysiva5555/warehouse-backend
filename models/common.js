const fs = require("fs").promises;
const fsWrite = require("fs");
const jwt = require("jsonwebtoken");
const qr = require('qrcode');
const path = require("path")
const folderPath = "./barcodeFolder"

// Create Dir
const createDir = async (path) => {
	await fs.mkdir(path, { recursive: true }, (err) => {
		if (err) throw err;
	});
};

// create File
const createFile = async (filePath, fileData, fileEncoding) => {
	await fs.writeFile(filePath, fileData, { encoding: fileEncoding });
};

const generateQRCode = async ( data, filename) => {
	try {
		const jsonData = JSON.stringify(data);
		const qrCode = await qr.toDataURL(jsonData);
		const qrCodeBuffer = Buffer.from(qrCode.split(',')[1], 'base64');
		const filePath = path.join(folderPath, filename);
		fsWrite.writeFileSync(filePath, qrCodeBuffer);
		console.log('QR code generated successfully!');
		return qrCodeBuffer;
	} catch (err) {
		console.error('Error generating QR code:', err);
	}
};

const checkAccess = function (role) {
	return async (req, res, next) => {
		try {
			let token, verifyAccessToken;
			// Check if the token is present in cookies instead of the Authorization header
			token = req.cookies.userToken;
			if (!token) {
				return res.status(401).send("Unauthorized Access");
			}
			const privateKey = await fs.readFile("privateKey.key", "utf8");
			try {
				// Verify the token using the private key
				verifyAccessToken = jwt.verify(token, privateKey, {
					algorithms: ["RS256"],
				});
			} catch (error) {
				return res.status(401).send("Unauthorized Access");
			}
			// Check if the user's role is allowed
			if (!role.includes(verifyAccessToken.role)) {
				return res.status(401).send("Unauthorized Access");
			}
			// If the token is valid and the role is allowed, proceed to the next middleware or route handler
			next();
		} catch (error) {
			next(error);
		}
	};
};

module.exports = { createDir, createFile, checkAccess, generateQRCode };
