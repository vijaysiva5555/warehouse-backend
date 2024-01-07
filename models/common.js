const fs = require("fs").promises;
const qr = require("qrcode");

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

const generateQRCode = async (data, filename) => {
	try {
		const jsonData = JSON.stringify(data);
		const qrCode = await qr.toDataURL(jsonData);
		const qrCodeBuffer = Buffer.from(qrCode.split(",")[1], "base64");
		console.log("QR code generated successfully!");
		return qrCodeBuffer;
	} catch (err) {
		console.error("Error generating QR code:", err);
	}
};

const checkAccess = function (roleArray) {
	return async (_req, res, next) => {
		try {
			const { role } = res.locals.userData;
			if (!roleArray.includes(role)) {
				return res.status(401).send("Unauthorized Access");
			}
			// If the token is valid and the role is allowed, proceed to the next middleware or route handler
			next();
		} catch (error) {
			return res.send({ status: 1, msg: error.message });
		}
	};
};

module.exports = { createDir, createFile, checkAccess, generateQRCode };
