const { default: mongoose } = require("mongoose");
const db = require("../models/mongo");
const moment = require("moment");
const bwipjs = require("bwip-js");
const { uploadToAws, getSignedUrl } = require("../models/aws");
const CONFIG = require("../config/config");

// ------------------------receipt details post--------------------------//

const insertReceiptDetails = async (req, res) => {
	try {
		const receiptInput = req.body;
		const currentYear = moment().year().toString().substring(2);
		const whAckNoData = await db.findDocuments("receipt", {
			whAckNo: { $regex: currentYear },
		});
		receiptInput.whAckNo =
			CONFIG.WHACKNO +
			"-" +
			currentYear +
			"-" +
			String(whAckNoData.length + 1).padStart(4, "0");

		const checkeMalkhanaNo = await db.findOneDocumentExists("receipt", {
			eMalkhanaNo: receiptInput.eMalkhanaNo,
		});
		if (checkeMalkhanaNo === true) {
			return res.send({ status: 0, msg: "E-malkhana NO Alreday Exists" });
		}
		receiptInput.createdBy = res.locals.userData.userId;
		receiptInput.status = 2; // for E-malkhana

		const options = {
			bcid: "code128",
			text: receiptInput.whAckNo,
			scale: 3,
			height: 5,
		};

		const png = await new Promise((resolve, reject) => {
			bwipjs.toBuffer(options, (err, png) => {
				if (err) {
					reject(err);
				} else {
					resolve(png);
				}
			});
		});

		// Upload the barcode file to AWS
		const barcodeFile = {
			data: png,
			name: `${receiptInput.whAckNo}.png`,
		};

		const barcodeLocation = await uploadToAws(
			CONFIG.BARCODEFILE,
			receiptInput.whAckNo,
			barcodeFile
		);
		receiptInput.barcode = barcodeLocation[0];
		const getPreviousDataByID = await db.findSingleDocument("eMalkhana", {
			eMalkhanaNo: receiptInput.eMalkhanaNo,
		});
		if (getPreviousDataByID === null) {
			return res.send({ status: 0, msg: "Invalid E-Malkhana Number" });
		}
		if (receiptInput.seizedItemName) {
			if (
				getPreviousDataByID.seizedItemName.current !==
				receiptInput.seizedItemName.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.seizedItemName.current,
					date: getPreviousDataByID.updatedAt,
				};
				receiptInput.seizedItemName.previousData = [
					...getPreviousDataByID.seizedItemName.previousData,
					newPreviousData,
				];
			} else {
				delete receiptInput.seizedItemName;
			}
		}

		if (receiptInput.seizedItemWeight) {
			if (
				getPreviousDataByID.seizedItemWeight.current !==
				receiptInput.seizedItemWeight.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.seizedItemWeight.current,
					date: getPreviousDataByID.updatedAt,
				};
				receiptInput.seizedItemWeight.previousData = [
					...getPreviousDataByID.seizedItemWeight.previousData,
					newPreviousData,
				];
			} else {
				delete receiptInput.seizedItemWeight;
			}
		}

		if (receiptInput.seizedItemValue) {
			if (
				getPreviousDataByID.seizedItemValue.current !==
				receiptInput.seizedItemValue.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.seizedItemValue.current,
					date: getPreviousDataByID.updatedAt,
				};
				receiptInput.seizedItemValue.previousData = [
					...getPreviousDataByID.seizedItemValue.previousData,
					newPreviousData,
				];
			} else {
				delete receiptInput.seizedItemValue;
			}
		}

		if (receiptInput.itemDesc) {
			if (
				getPreviousDataByID.itemDesc.current !==
				receiptInput.itemDesc.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.itemDesc.current,
					date: getPreviousDataByID.updatedAt,
				};
				receiptInput.itemDesc.previousData = [
					...getPreviousDataByID.itemDesc.previousData,
					newPreviousData,
				];
			} else {
				delete receiptInput.itemDesc;
			}
		}

		const receiptData = await db.insertSingleDocument(
			"receipt",
			receiptInput
		);
		if (receiptData) {
			await db.findOneAndUpdate(
				"eMalkhana",
				{ eMalkhanaNo: receiptInput.eMalkhanaNo },
				receiptInput
			);

			return res.send({
				status: 1,
				msg: "receipt details inserted successfully",
				data: receiptData,
			});
		}
	} catch (error) {
		return res.send(error.message);
	}
};

// -------------get all receipt details----------------------------------//

const getReceiptDetails = async (req, res) => {
	try {
		const getReceiptDetails = await db.findDocuments("receipt", {});
		if (getReceiptDetails) {
			return res.send({ status: 1, data: getReceiptDetails });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

// // ------------------------------update specific feilds all receipt details-------------------------------------------//
const updateReceiptSpecificFeilds = async (req, res) => {
	try {
		const updateData = req.body;
		if (!mongoose.isValidObjectId(updateData.id)) {
			return res.send({ status: 0, msg: "invalid id" });
		}
		const getPreviousDataByID = await db.findSingleDocument("receipt", {
			_id: new mongoose.Types.ObjectId(updateData.id),
		});
		if (getPreviousDataByID === null) {
			return res.send({ status: 0, msg: "Invalid ReceiptID" });
		}
		if (updateData.packageDetails) {
			if (
				getPreviousDataByID.packageDetails.current !==
				updateData.packageDetails.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.packageDetails.current,
					date: getPreviousDataByID.updatedAt,
				};
				updateData.packageDetails.previousData = [
					...getPreviousDataByID.packageDetails.previousData,
					newPreviousData,
				];
			} else {
				delete updateData.packageDetails;
			}
		}

		if (updateData.godownName) {
			if (
				getPreviousDataByID.godownName.current !==
				updateData.godownName.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.godownName.current,
					date: getPreviousDataByID.updatedAt,
				};
				updateData.godownName.previousData = [
					...getPreviousDataByID.godownName.previousData,
					newPreviousData,
				];
			} else {
				delete updateData.godownName;
			}
		}

		if (updateData.godownCode) {
			if (
				getPreviousDataByID.godownCode.current !==
				updateData.godownCode.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.godownCode.current,
					date: getPreviousDataByID.updatedAt,
				};
				updateData.godownCode.previousData = [
					...getPreviousDataByID.godownCode.previousData,
					newPreviousData,
				];
			} else {
				delete updateData.godownCode;
			}
		}

		if (updateData.locationOfPackageInGodown) {
			if (
				getPreviousDataByID.locationOfPackageInGodown.current !==
				updateData.locationOfPackageInGodown.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.locationOfPackageInGodown.current,
					date: getPreviousDataByID.updatedAt,
				};
				updateData.locationOfPackageInGodown.previousData = [
					...getPreviousDataByID.locationOfPackageInGodown
						.previousData,
					newPreviousData,
				];
			} else {
				delete updateData.locationOfPackageInGodown;
			}
		}

		if (updateData.handingOverOfficerName) {
			if (
				getPreviousDataByID.handingOverOfficerName.current !==
				updateData.handingOverOfficerName.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.handingOverOfficerName.current,
					date: getPreviousDataByID.updatedAt,
				};
				updateData.handingOverOfficerName.previousData = [
					...getPreviousDataByID.handingOverOfficerName.previousData,
					newPreviousData,
				];
			} else {
				delete updateData.handingOverOfficerName;
			}
		}

		if (updateData.handingOverOfficerDesignation) {
			if (
				getPreviousDataByID.handingOverOfficerDesignation.current !==
				updateData.handingOverOfficerDesignation.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.handingOverOfficerDesignation
						.current,
					date: getPreviousDataByID.updatedAt,
				};
				updateData.handingOverOfficerDesignation.previousData = [
					...getPreviousDataByID.handingOverOfficerDesignation
						.previousData,
					newPreviousData,
				];
			} else {
				delete updateData.handingOverOfficerDesignation;
			}
		}

		if (updateData.pendingUnderSection) {
			if (
				getPreviousDataByID.pendingUnderSection.current !==
				updateData.pendingUnderSection.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.pendingUnderSection.current,
					date: getPreviousDataByID.updatedAt,
				};
				updateData.pendingUnderSection.previousData = [
					...getPreviousDataByID.pendingUnderSection.previousData,
					newPreviousData,
				];
			} else {
				delete updateData.pendingUnderSection;
			}
		}

		const updateReceiptData = await db.findByIdAndUpdate(
			"receipt",
			updateData.id,
			updateData
		);
		if (updateReceiptData) {
			return res.send({ status: 1, msg: "Updateted Sucessfully" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

// ----------------------get Receipt details using id--------------------------------------------------------------------

const receiptDataById = async (req, res) => {
	try {
		const receiptId = req.body;
		if (!mongoose.isValidObjectId(receiptId.id)) {
			return res.send({ status: 0, msg: "invalid id" });
		}
		const receiptData = await db.findSingleDocument("receipt", {
			_id: new mongoose.Types.ObjectId(receiptId.id),
		});
		if (receiptData !== null) {
			if (receiptData.barcode.length !== 0) {
				receiptData.barcode = await Promise.all(
					receiptData.barcode.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}

			return res.send({ status: 1, data: receiptData });
		} else {
			return res.send({ status: 0, msg: "data Not found" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

// ------------------------------------------SEARCH DATA-----------------------------------------------//
// ----search data by eMalkhanaNo

const searchDataUsingeMalkhanaNo = async (req, res) => {
	try {
		const eMalkhanaNo = req.body;
		const checkeMalkhanaNo = await db.findSingleDocument("receipt", {
			eMalkhanaNo: eMalkhanaNo.eMalkhanaNo,
		});
		if (checkeMalkhanaNo !== null) {
			if (checkeMalkhanaNo.barcode.length !== 0) {
				checkeMalkhanaNo.barcode = await Promise.all(
					checkeMalkhanaNo.barcode.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}
			return res.send({ status: 1, data: checkeMalkhanaNo });
		} else {
			return res.send({ status: 0, msg: "data Not found" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

// --------------search data by WackNo

const searchDataUsingWackNo = async (req, res) => {
	try {
		const whAckNo = req.body;
		const checkwhAckNo = await db.findSingleDocument("receipt", {
			whAckNo: whAckNo.whAckNo,
		});
		if (checkwhAckNo !== null) {
			if (checkwhAckNo.barcode.length !== 0) {
				checkwhAckNo.barcode = await Promise.all(
					checkwhAckNo.barcode.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}
			return res.send({ status: 1, data: checkwhAckNo });
		} else {
			return res.send({ status: 0, msg: "data Not found" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

// search data by adjucationOrderNo

const searchDataByAdjucationOrderNo = async (req, res) => {
	try {
		const adjucationOrderNo = req.body;
		const checkAdjucationOrderNo = await db.findSingleDocument("receipt", {
			adjucationOrderNo: adjucationOrderNo.adjucationOrderNo,
		});
		if (checkAdjucationOrderNo !== null) {
			if (checkAdjucationOrderNo.barcode.length !== 0) {
				checkAdjucationOrderNo.barcode = await Promise.all(
					checkAdjucationOrderNo.barcode.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}
			return res.send({ status: 1, data: checkAdjucationOrderNo });
		} else {
			return res.send({ status: 0, msg: "data Not found" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

// -------------------REPORT GENERATION-------------------------------------//
// get report details by Godown name

const getReportDataByGodownName = async (req, res) => {
	try {
		const godownName = req.body;
		const godownItem = await db.findSingleDocument("receipt", {
			"godownName.current": godownName.godownName.current,
		});
		if (godownItem !== null) {
			if (godownItem.barcode.length !== 0) {
				godownItem.barcode = await Promise.all(
					godownItem.barcode.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}
			return res.send({ status: 1, data: godownItem });
		} else {
			return res.send({ status: 0, msg: "data Not found" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

// get report details by Godown code

const getReportDataByGodownCode = async (req, res) => {
	try {
		const godownCode = req.body;
		const getGodownCode = await db.findSingleDocument("receipt", {
			"godownCode.current": godownCode.godownCode.current,
		});
		if (getGodownCode !== null) {
			if (getGodownCode.barcode.length !== 0) {
				getGodownCode.barcode = await Promise.all(
					getGodownCode.barcode.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}
			return res.send({ status: 1, data: getGodownCode });
		} else {
			return res.send({ status: 0, msg: "data Not found" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

// get report details by Pending under section wise

const reportOfPendingUnderSection = async (req, res) => {
	try {
		const pendingUnderSection = req.body;
		const pendingSection = await db.findSingleDocument("receipt", {
			"pendingUnderSection.current":
				pendingUnderSection.pendingUnderSection.current,
		});
		if (pendingSection !== null) {
			if (pendingSection.barcode.length !== 0) {
				pendingSection.barcode = await Promise.all(
					pendingSection.barcode.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}
			return res.send({ status: 1, data: pendingSection });
		} else {
			return res.send({ status: 0, msg: "data Not found" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

// ----- get report details by Ripe For Disposal----//

const reportOfRipeForDisposal = async (req, res) => {
	try {
		const ripeForDisposal = req.body;
		const ripeDisposal = await db.findSingleDocument("receipt", {
			ripeForDisposal: ripeForDisposal.ripeForDisposal,
		});
		if (ripeDisposal !== null) {
			if (ripeDisposal.barcode.length !== 0) {
				ripeDisposal.barcode = await Promise.all(
					ripeDisposal.barcode.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}
			return res.send({ status: 1, data: ripeDisposal });
		} else {
			return res.send({ status: 0, msg: "data Not found" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

// update data Details of package received,Name/code of the godown,Location of package inside the godown, Pending under section .

const updateReceipt = async (req, res) => {
	try {
		const updateReceptData = req.body;
		if (!mongoose.isValidObjectId(updateReceptData.id)) {
			return res.send({ status: 0, msg: "invalid id" });
		}
		const getPreviousDataByID = await db.findSingleDocument("receipt", {
			_id: new mongoose.Types.ObjectId(updateReceptData.id),
		});
		if (getPreviousDataByID === null) {
			return res.send({ status: 0, msg: "Invalid ReceiptID" });
		}
		if (updateReceptData.packageDetails) {
			if (
				getPreviousDataByID.packageDetails.current !==
				updateReceptData.packageDetails.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.packageDetails.current,
					date: getPreviousDataByID.updatedAt,
				};
				updateReceptData.packageDetails.previousData = [
					...getPreviousDataByID.packageDetails.previousData,
					newPreviousData,
				];
			} else {
				delete updateReceptData.packageDetails;
			}
		}

		if (updateReceptData.godownName) {
			if (
				getPreviousDataByID.godownName.current !==
				updateReceptData.godownName.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.godownName.current,
					date: getPreviousDataByID.updatedAt,
				};
				updateReceptData.godownName.previousData = [
					...getPreviousDataByID.godownName.previousData,
					newPreviousData,
				];
			} else {
				delete updateReceptData.godownName;
			}
		}

		if (updateReceptData.godownCode) {
			if (
				getPreviousDataByID.godownCode.current !==
				updateReceptData.godownCode.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.godownCode.current,
					date: getPreviousDataByID.updatedAt,
				};
				updateReceptData.godownCode.previousData = [
					...getPreviousDataByID.godownCode.previousData,
					newPreviousData,
				];
			} else {
				delete updateReceptData.godownCode;
			}
		}

		if (updateReceptData.locationOfPackageInGodown) {
			if (
				getPreviousDataByID.locationOfPackageInGodown.current !==
				updateReceptData.locationOfPackageInGodown.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.locationOfPackageInGodown.current,
					date: getPreviousDataByID.updatedAt,
				};
				updateReceptData.locationOfPackageInGodown.previousData = [
					...getPreviousDataByID.locationOfPackageInGodown
						.previousData,
					newPreviousData,
				];
			} else {
				delete updateReceptData.locationOfPackageInGodown;
			}
		}

		if (updateReceptData.handingOverOfficerName) {
			if (
				getPreviousDataByID.handingOverOfficerName.current !==
				updateReceptData.handingOverOfficerName.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.handingOverOfficerName.current,
					date: getPreviousDataByID.updatedAt,
				};
				updateReceptData.handingOverOfficerName.previousData = [
					...getPreviousDataByID.handingOverOfficerName.previousData,
					newPreviousData,
				];
			} else {
				delete updateReceptData.handingOverOfficerName;
			}
		}

		if (updateReceptData.handingOverOfficerDesignation) {
			if (
				getPreviousDataByID.handingOverOfficerDesignation.current !==
				updateReceptData.handingOverOfficerDesignation.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.handingOverOfficerDesignation
						.current,
					date: getPreviousDataByID.updatedAt,
				};
				updateReceptData.handingOverOfficerDesignation.previousData = [
					...getPreviousDataByID.handingOverOfficerDesignation
						.previousData,
					newPreviousData,
				];
			} else {
				delete updateReceptData.handingOverOfficerDesignation;
			}
		}

		if (updateReceptData.pendingUnderSection) {
			if (
				getPreviousDataByID.pendingUnderSection.current !==
				updateReceptData.pendingUnderSection.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.pendingUnderSection.current,
					date: getPreviousDataByID.updatedAt,
				};
				updateReceptData.pendingUnderSection.previousData = [
					...getPreviousDataByID.pendingUnderSection.previousData,
					newPreviousData,
				];
			} else {
				delete updateReceptData.pendingUnderSection;
			}
		}

		const getEmalkhanaPreviousData = await db.findSingleDocument(
			"eMalkhana",
			{ eMalkhanaNo: getPreviousDataByID.eMalkhanaNo }
		);
		if (getEmalkhanaPreviousData === null) {
			return res.send({ status: 0, msg: "Invalid E-Malkhana Number" });
		}
		if (updateReceptData.seizedItemName) {
			if (
				getEmalkhanaPreviousData.seizedItemName.current !==
				updateReceptData.seizedItemName.current
			) {
				const newPreviousData = {
					data: getEmalkhanaPreviousData.seizedItemName.current,
					date: getEmalkhanaPreviousData.updatedAt,
				};
				updateReceptData.seizedItemName.previousData = [
					...getEmalkhanaPreviousData.seizedItemName.previousData,
					newPreviousData,
				];
			} else {
				delete updateReceptData.seizedItemName;
			}
		}

		if (updateReceptData.seizedItemWeight) {
			if (
				getEmalkhanaPreviousData.seizedItemWeight.current !==
				updateReceptData.seizedItemWeight.current
			) {
				const newPreviousData = {
					data: getEmalkhanaPreviousData.seizedItemWeight.current,
					date: getEmalkhanaPreviousData.updatedAt,
				};
				updateReceptData.seizedItemWeight.previousData = [
					...getEmalkhanaPreviousData.seizedItemWeight.previousData,
					newPreviousData,
				];
			} else {
				delete updateReceptData.seizedItemWeight;
			}
		}

		if (updateReceptData.seizedItemValue) {
			if (
				getEmalkhanaPreviousData.seizedItemValue.current !==
				updateReceptData.seizedItemValue.current
			) {
				const newPreviousData = {
					data: getEmalkhanaPreviousData.seizedItemValue.current,
					date: getEmalkhanaPreviousData.updatedAt,
				};
				updateReceptData.seizedItemValue.previousData = [
					...getEmalkhanaPreviousData.seizedItemValue.previousData,
					newPreviousData,
				];
			} else {
				delete updateReceptData.seizedItemValue;
			}
		}

		if (updateReceptData.itemDesc) {
			if (
				getEmalkhanaPreviousData.itemDesc.current !==
				updateReceptData.itemDesc.current
			) {
				const newPreviousData = {
					data: getEmalkhanaPreviousData.itemDesc.current,
					date: getEmalkhanaPreviousData.updatedAt,
				};
				updateReceptData.itemDesc.previousData = [
					...getEmalkhanaPreviousData.itemDesc.previousData,
					newPreviousData,
				];
			} else {
				delete updateReceptData.itemDesc;
			}
		}

		const receiptUpdateById = await db.findByIdAndUpdate(
			"receipt",
			updateReceptData.id,
			updateReceptData
		);
		if (receiptUpdateById) {
			await db.findOneAndUpdate(
				"eMalkhana",
				{ eMalkhanaNo: getEmalkhanaPreviousData.eMalkhanaNo },
				updateReceptData
			);

			return res.send({ status: 1, msg: "updated successfully" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

const getAllDataBasedOnEmalkhanaNumber = async (req, res) => {
	try {
		const numberData = req.body;

		const getEmalkhanaData = await db.findSingleDocument("eMalkhana", {
			eMalkhanaNo: numberData.eMalkhanaNo,
		});
		const getReceiptData = await db.findSingleDocument("receipt", {
			eMalkhanaNo: numberData.eMalkhanaNo,
		});
		if (getEmalkhanaData || getReceiptData) {
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

			if (getReceiptData.barcode.length !== 0) {
				getReceiptData.barcode = await Promise.all(
					getReceiptData.barcode.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}
			const allData = {
				eMalkhanaData: getEmalkhanaData,
				receiptData: getReceiptData,
			};

			return res.send({ status: 1, data: allData });
		} else {
			return res.send({ status: 0, msg: "no data found" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

const getEmalkhanaDataBasedonWhackNo = async (req, res) => {
	try {
		const numberData = req.body;

		const getReceptData = await db.findSingleDocument("receipt", {
			whAckNo: numberData.whAckNo,
		});
		const getEmalkhanaData = await db.findSingleDocument("eMalkhana", {
			eMalkhanaNo: getReceptData.eMalkhanaNo,
		});
		if (getEmalkhanaData || getReceptData) {
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

			if (getReceptData.barcode.length !== 0) {
				getReceptData.barcode = await Promise.all(
					getReceptData.barcode.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}
			const allData = {
				eMalkhanaData: getEmalkhanaData,
				receiptData: getReceptData,
			};

			return res.send({ status: 1, data: allData });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

module.exports = {
	insertReceiptDetails,
	// updateAllReceiptDetails,
	getReceiptDetails,
	receiptDataById,
	searchDataUsingeMalkhanaNo,
	searchDataUsingWackNo,
	searchDataByAdjucationOrderNo,
	getReportDataByGodownName,
	getReportDataByGodownCode,
	reportOfPendingUnderSection,
	reportOfRipeForDisposal,
	updateReceipt,
	getAllDataBasedOnEmalkhanaNumber,
	getEmalkhanaDataBasedonWhackNo,
	updateReceiptSpecificFeilds,
};
