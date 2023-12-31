const db = require("../models/mongo");
const { default: mongoose } = require("mongoose");
const { uploadToAws, getSignedUrl } = require("../models/aws");
const CONFIG = require("../config/config");

// ---------disposal data details-----------//
const disposalDataDetails = async (req, res) => {
	try {
		const insertDisposalData = req.body;
		const checkeMalkhanaNo = await db.findOneDocumentExists("disposal", {
			eMalkhanaNo: insertDisposalData.eMalkhanaNo,
		});
		if (checkeMalkhanaNo === true) {
			return res.send({
				status: 0,
				msg: "Disposal details are Already entered for this entry",
			});
		}
		insertDisposalData.createdBy = res.locals.userData.userId;
		if(req.files.reOpenUploadOrder != null){
			insertDisposalData.reOpenUploadOrder = await uploadToAws(
				CONFIG.DISPOSALDOC,
				insertDisposalData.eMalkhanaNo,
				req.files.reOpenUploadOrder
			);
		}

		const disposalData = await db.insertSingleDocument(
			"disposal",
			insertDisposalData
		);
		if (disposalData) {
			await db.updateOneDocument(
				"eMalkhana",
				{ eMalkhanaNo: disposalData.eMalkhanaNo },
				{ status: 3 }
			);
			return res.send({
				status: 1,
				msg: "packages details inserted successfully",
				data: disposalData,
			});
		} else {
			return res.send({ status: 0, msg: "Invalid Request" });
		}
	} catch (error) {
		return res.send({ status: 0, msg: error.message });
	}
};

// --------------get all disposal data----------------//
const getdisposalDetails = async (req, res) => {
	try {
		const getdisposalDetails = await db.findDocuments("disposal", {});
		if (getdisposalDetails) {
			return res.send({ status: 1, data: getdisposalDetails });
		}
	} catch (error) {
		return res.send({ status: 0, msg: error.message });
	}
};

// ----------------update all disposal data----------------//
const updateDisposalDetails = async (req, res) => {
	try {
		const updateDisposalDetails = req.body;
		if (!mongoose.isValidObjectId(updateDisposalDetails.id)) {
			return res.send({ status: 0, msg: "invalid id" });
		}
		const previousData = await db.findSingleDocument("disposal", {
			_id: new mongoose.Types.ObjectId(updateDisposalDetails.id),
		});
		if (
			Array.isArray(req.files.reOpenUploadOrder) ||
			req.files.reOpenUploadOrder != null
		) {
			updateDisposalDetails.reOpenUploadOrder = await uploadToAws(
				CONFIG.DISPOSALDOC,
				previousData.eMalkhanaNo,
				req.files.reOpenUploadOrder
			);
			updateDisposalDetails.reOpenUploadOrder = [
				...updateDisposalDetails.reOpenUploadOrder,
				...previousData.reOpenUploadOrder,
			];
		} else {
			delete updateDisposalDetails.reOpenUploadOrder;
		}
		const disposalDetailsUpdateById = await db.findByIdAndUpdate(
			"disposal",
			updateDisposalDetails.id,
			updateDisposalDetails
		);
		if (disposalDetailsUpdateById) {
			return res.send({ status: 1, msg: "updated successfully" });
		}
	} catch (error) {
		return res.send({ status: 0, msg: error.message });
	}
};

// -------------------get disposal data by id----------------//
const disposalDataById = async (req, res) => {
	try {
		const disposalId = req.body;
		if (!mongoose.isValidObjectId(disposalId.id)) {
			return res.send({ status: 0, msg: "invalid id" });
		}
		const disposalData = await db.findSingleDocument("disposal", {
			_id: new mongoose.Types.ObjectId(disposalId.id),
		});
		if (disposalData !== null) {
			disposalData.reOpenUploadOrder = await Promise.all(
				disposalData.reOpenUploadOrder.map(async (file) => {
					return {
						...file,
						actualPath: file.href,
						href: await getSignedUrl(file.href),
					};
				})
			);
			return res.send({ status: 1, data: disposalData });
		} else {
			return res.send({ status: 0, msg: "data Not found" });
		}
	} catch (error) {
		return res.send({ status: 0, msg: error.message });
	}
};

// ------SEARCH DATA--------------//
// search data using emalkhana number

const searchDataUsingeMalkhanaNo = async (req, res) => {
	try {
		const eMalkhanaNo = req.body;
		const checkeMalkhanaNo = await db.findSingleDocument("disposal", {
			eMalkhanaNo: eMalkhanaNo.eMalkhanaNo,
		});
		if (checkeMalkhanaNo !== null) {
			checkeMalkhanaNo.reOpenUploadOrder = await Promise.all(
				checkeMalkhanaNo.reOpenUploadOrder.map(async (file) => {
					return {
						...file,
						actualPath: file.href,
						href: await getSignedUrl(file.href),
					};
				})
			);
			return res.send({ status: 1, data: checkeMalkhanaNo });
		} else {
			return res.send({ status: 0, msg: "data Not found" });
		}
	} catch (error) {
		return res.send({ status: 0, msg: error.message });
	}
};

// search details by WackNo

const searchDataUsingWackNo = async (req, res) => {
	try {
		const whAckNo = req.body;
		const checkwhAckNo = await db.findSingleDocument("disposal", {
			whAckNo: whAckNo.whAckNo,
		});
		if (checkwhAckNo !== null) {
			checkwhAckNo.reOpenUploadOrder = await Promise.all(
				checkwhAckNo.reOpenUploadOrder.map(async (file) => {
					return {
						...file,
						actualPath: file.href,
						href: await getSignedUrl(file.href),
					};
				})
			);
			return res.send({ status: 1, data: checkwhAckNo });
		} else {
			return res.send({ status: 0, msg: "data Not found" });
		}
	} catch (error) {
		return res.send({ status: 0, msg: error.message });
	}
};

const getAllDataByEmalkhanaNo = async (req, res) => {
	try {
		const numberData = req.body;

		const getEmalkhanaData = await db.findSingleDocument("eMalkhana", {
			eMalkhanaNo: numberData.eMalkhanaNo,
		});
		const getReceptData = await db.findSingleDocument("receipt", {
			eMalkhanaNo: numberData.eMalkhanaNo,
		});
		const getDisposalData = await db.findSingleDocument("disposal", {
			eMalkhanaNo: numberData.eMalkhanaNo,
		});
		if (getEmalkhanaData || getReceptData || getDisposalData) {
			if (getEmalkhanaData.documents.length !== 0) {
				getEmalkhanaData.documents = await Promise.all(
					getEmalkhanaData.documents.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}
			if (getEmalkhanaData.reOpenUploadOrder.length !== 0) {
				getEmalkhanaData.reOpenUploadOrder = await Promise.all(
					getEmalkhanaData.reOpenUploadOrder.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}

			if (
				getReceptData != null &&
				Object.keys(getReceptData).length > 0
			) {
				if (getReceptData.qrCode.length !== 0) {
					getReceptData.qrCode = await Promise.all(
						getReceptData.qrCode.map(async (file) => {
							return {
								...file,
								actualPath: file.href,
								href: await getSignedUrl(file.href),
							};
						})
					);
				}
			}

			if (
				getDisposalData != null &&
				Object.keys(getDisposalData).length > 0
			) {
				if (getDisposalData.reOpenUploadOrder.length !== 0) {
					getDisposalData.reOpenUploadOrder = await Promise.all(
						getDisposalData.reOpenUploadOrder.map(async (file) => {
							return {
								...file,
								actualPath: file.href,
								href: await getSignedUrl(file.href),
							};
						})
					);
				}
			}

			const allData = {
				eMalkhanaData: getEmalkhanaData,
				receiptData: getReceptData,
				disposalData: getDisposalData,
			};

			return res.send({ status: 1, data: allData });
		}
	} catch (error) {
		return res.send({ status: 0, msg: error.message });
	}
};
const getAllDataBasedOnWhackNo = async (req, res) => {
	try {
		const numberData = req.body;

		const getReceptData = await db.findSingleDocument("receipt", {
			whAckNo: numberData.whAckNo,
		});
		const getEmalkhanaData = await db.findSingleDocument("eMalkhana", {
			eMalkhanaNo: getReceptData.eMalkhanaNo,
		});
		const getDisposalData = await db.findSingleDocument("disposal", {
			whAckNo: numberData.whAckNo,
		});
		if (getEmalkhanaData || getReceptData || getDisposalData) {
			if (getEmalkhanaData.documents.length !== 0) {
				getEmalkhanaData.documents = await Promise.all(
					getEmalkhanaData.documents.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}
			if (getEmalkhanaData.reOpenUploadOrder.length !== 0) {
				getEmalkhanaData.reOpenUploadOrder = await Promise.all(
					getEmalkhanaData.reOpenUploadOrder.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}

			if (getReceptData.qrCode.length !== 0) {
				getReceptData.qrCode = await Promise.all(
					getReceptData.qrCode.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}

			if (
				getDisposalData != null &&
				Object.keys(getDisposalData).length > 0
			) {
				if (getDisposalData.reOpenUploadOrder.length !== 0) {
					getDisposalData.reOpenUploadOrder = await Promise.all(
						getDisposalData.reOpenUploadOrder.map(async (file) => {
							return {
								...file,
								actualPath: file.href,
								href: await getSignedUrl(file.href),
							};
						})
					);
				}
			}

			const allData = {
				eMalkhanaData: getEmalkhanaData,
				receiptData: getReceptData,
				disposalData: getDisposalData,
			};

			return res.send({ status: 1, data: allData });
		}
		return res.send({ status: 0, msg: "data not found" });
	} catch (error) {
		return res.send({ status: 0, msg: error.message });
	}
};

module.exports = {
	disposalDataDetails,
	updateDisposalDetails,
	getdisposalDetails,
	disposalDataById,
	searchDataUsingeMalkhanaNo,
	searchDataUsingWackNo,
	getAllDataByEmalkhanaNo,
	getAllDataBasedOnWhackNo,
};
