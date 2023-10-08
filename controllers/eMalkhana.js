const db = require("../models/mongo");
const mongoose = require("mongoose");
const moment = require("moment");
const { uploadToAws, deleteFile, getSignedUrl } = require("../models/aws");
const CONFIG = require("../config/config");

// -------------------------------------- eMalkhana details Insert--------------------------------------------//

const insertEMalkhanaDetails = async (req, res) => {
	const eMalkhanaData = req.body;
	let eMalkhanaInputData;
	let eMalkhanaAllData;
	let currentYear;
	try {
		currentYear = moment().year().toString().substring(2);
		eMalkhanaAllData = await db.findDocuments("eMalkhana", {
			eMalkhanaNo: { $regex: currentYear },
		});
		eMalkhanaData.eMalkhanaNo =
			CONFIG.EMALKHANANO +
			"-" +
			currentYear +
			"-" +
			String(eMalkhanaAllData.length + 1).padStart(4, "0");
		eMalkhanaData.createdBy = res.locals.userData.userId;

		eMalkhanaData.documents = await uploadToAws(
			CONFIG.EMALKHANADOC,
			eMalkhanaData.eMalkhanaNo,
			req.files.documents
		);

		eMalkhanaInputData = await db.insertSingleDocument(
			"eMalkhana",
			eMalkhanaData
		);
		if (eMalkhanaInputData) {
			return res.send({
				status: 1,
				msg: `E Malkhana ${eMalkhanaData.eMalkhanaNo} Generated Successfully`,
			});
		} else {
			return res.send({ status: 0, msg: "Invalid request" });
		}
	} catch (error) {
		return res.send({ status: 0, msg: error.message });
	}
};

// ---------------------------get all eMalkhana details ----------------------------------------//

const getEmakhalaDetails = async (req, res) => {
	try {
		const getEmakhalaDetails = await db.findDocuments("eMalkhana", {});
		if (getEmakhalaDetails) {
			return res.send({ status: 1, data: getEmakhalaDetails });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

// -----------------------------------------------update emalkhana particular feild data-----------------------------//

const updateMalkhana = async (req, res) => {
	try {
		const updateMalkhanData = req.body;
		if (!mongoose.isValidObjectId(updateMalkhanData.id)) {
			return res.send({ status: 0, msg: "invalid id" });
		}
		const getPreviousDataByID = await db.findSingleDocument("eMalkhana", {
			_id: new mongoose.Types.ObjectId(updateMalkhanData.id),
		});
		const previousDocuments = getPreviousDataByID.documents;
		if (updateMalkhanData.seizedItemName) {
			if (
				getPreviousDataByID.seizedItemName.current !==
				updateMalkhanData.seizedItemName.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.seizedItemName.current,
					date: getPreviousDataByID.updatedAt,
				};
				updateMalkhanData.seizedItemName.previousData = [
					...getPreviousDataByID.seizedItemName.previousData,
					newPreviousData,
				];
			} else {
				delete updateMalkhanData.seizedItemName;
			}
		}

		if (updateMalkhanData.seizedItemWeight) {
			if (
				getPreviousDataByID.seizedItemWeight.current !==
				updateMalkhanData.seizedItemWeight.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.seizedItemWeight.current,
					date: getPreviousDataByID.updatedAt,
				};
				updateMalkhanData.seizedItemWeight.previousData = [
					...getPreviousDataByID.seizedItemWeight.previousData,
					newPreviousData,
				];
			} else {
				delete updateMalkhanData.seizedItemWeight;
			}
		}

		if (updateMalkhanData.seizedItemValue) {
			if (
				getPreviousDataByID.seizedItemValue.current !==
				updateMalkhanData.seizedItemValue.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.seizedItemValue.current,
					date: getPreviousDataByID.updatedAt,
				};
				updateMalkhanData.seizedItemValue.previousData = [
					...getPreviousDataByID.seizedItemValue.previousData,
					newPreviousData,
				];
			} else {
				delete updateMalkhanData.seizedItemValue;
			}
		}

		if (updateMalkhanData.itemDesc) {
			if (
				getPreviousDataByID.itemDesc.current !==
				updateMalkhanData.itemDesc.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.itemDesc.current,
					date: getPreviousDataByID.updatedAt,
				};
				updateMalkhanData.itemDesc.previousData = [
					...getPreviousDataByID.itemDesc.previousData,
					newPreviousData,
				];
			} else {
				delete updateMalkhanData.itemDesc;
			}
		}

		if (Array.isArray(req.files.documents) || req.files.documents != null) {
			updateMalkhanData.documents = await uploadToAws(
				CONFIG.EMALKHANADOC,
				updateMalkhanData.eMalkhanaNo,
				req.files.documents
			);
			updateMalkhanData.documents = [
				...updateMalkhanData.documents,
				...previousDocuments,
			];
		} else {
			delete updateMalkhanData.documents;
		}
		const eMalkhanaUpdateById = await db.findByIdAndUpdate(
			"eMalkhana",
			updateMalkhanData.id,
			updateMalkhanData
		);
		if (eMalkhanaUpdateById) {
			return res.send({ status: 1, msg: "updated successfully" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

// ---------------------------------check emalkhana data by Id----------------------------------------

const eMalkhanaDataById = async (req, res) => {
	try {
		const eMalkhanaId = req.body;
		if (!mongoose.isValidObjectId(eMalkhanaId.id)) {
			return res.send({ status: 0, msg: "invalid id" });
		}
		const eMalkhanaData = await db.findSingleDocument("eMalkhana", {
			_id: new mongoose.Types.ObjectId(eMalkhanaId.id),
		});
		if (eMalkhanaData !== null) {
			eMalkhanaData.documents = await Promise.all(
				eMalkhanaData.documents.map(async (file) => {
					return {
						...file,
						actualPath: file.href,
						href: await getSignedUrl(file.href),
					};
				})
			);
			return res.send({ status: 1, data: eMalkhanaData });
		} else {
			return res.send({ status: 0, msg: "E Malkhana Not found" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

// ----------------------------SEARCH DATA-------------------------------------------------------//
// Search data using emalkhana number

const searchDataUsingeMalkhanaNo = async (req, res) => {
	try {
		const eMalkhanaNo = req.body;
		const checkeMalkhanaNo = await db.findSingleDocument(
			"eMalkhana",
			{ eMalkhanaNo: eMalkhanaNo.eMalkhanaNo },
			{ _id: 1, status: 1 }
		);
		if (checkeMalkhanaNo !== null) {
			return res.send({ status: 1, data: checkeMalkhanaNo });
		} else {
			return res.send({ status: 0, msg: "data Not found" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

// ----------------------Search data using file Number-----------------------//

const searchDataUsingfileNo = async (req, res) => {
	try {
		const fileNo = req.body;
		const checkFileNo = await db.findSingleDocument("eMalkhana", {
			fileNo: fileNo.fileNo,
		});
		if (checkFileNo !== null) {
			if (checkFileNo.documents.length !== 0) {
				checkFileNo.documents = await Promise.all(
					checkFileNo.documents.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}
			if (checkFileNo.reOpenUploadOrder.length !== 0) {
				checkFileNo.reOpenUploadOrder = await Promise.all(
					checkFileNo.reOpenUploadOrder.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}
			return res.send({ status: 1, data: checkFileNo });
		} else {
			return res.send({ status: 0, msg: "data Not found" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

// -------------Search data using Item Description----------------------------------//

const searchDataUsingItemDesc = async (req, res) => {
	try {
		const itemDesc = req.body;
		const checkItemDesc = await db.findSingleDocument("eMalkhana", {
			"itemDesc.current": itemDesc.itemDesc.current,
		});
		if (checkItemDesc !== null) {
			if (checkItemDesc.documents.length !== 0) {
				checkItemDesc.documents = await Promise.all(
					checkItemDesc.documents.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}
			if (checkItemDesc.reOpenUploadOrder.length !== 0) {
				checkItemDesc.reOpenUploadOrder = await Promise.all(
					checkItemDesc.reOpenUploadOrder.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}
			return res.send({ status: 1, data: checkItemDesc });
		} else {
			return res.send({ status: 0, msg: "data Not found" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

// --------------Search data using Importer/Exporter Feild(importerName)------------------//

const searchDataUsingImporterName = async (req, res) => {
	try {
		const importerName = req.body;
		const checkImporterName = await db.findSingleDocument("eMalkhana", {
			importerName: importerName.importerName,
		});
		if (checkImporterName !== null) {
			if (checkImporterName.documents.length !== 0) {
				checkImporterName.documents = await Promise.all(
					checkImporterName.documents.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}
			if (checkImporterName.reOpenUploadOrder.length !== 0) {
				checkImporterName.reOpenUploadOrder = await Promise.all(
					checkImporterName.reOpenUploadOrder.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}
			return res.send({ status: 1, data: checkImporterName });
		} else {
			return res.send({ status: 0, msg: "data not found" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

const searchDataUsingImporterAddress = async (req, res) => {
	try {
		const importerAddress = req.body;
		const checkImporterAddress = await db.findSingleDocument("eMalkhana", {
			importerAddress: importerAddress.importerAddress,
		});
		if (checkImporterAddress !== null) {
			if (checkImporterAddress.documents.length !== 0) {
				checkImporterAddress.documents = await Promise.all(
					checkImporterAddress.documents.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}
			if (checkImporterAddress.reOpenUploadOrder.length !== 0) {
				checkImporterAddress.reOpenUploadOrder = await Promise.all(
					checkImporterAddress.reOpenUploadOrder.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}
			return res.send({ status: 1, data: checkImporterAddress });
		} else {
			return res.send({ status: 0, msg: "data not found" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

// --------------REPORT GENERATION-----------------------------------//
// get report using Seizing Unit Wise

const getReportUsingSeizingUnitWise = async (req, res) => {
	try {
		const seizingUnitName = req.body;
		const seizedUnit = await db.findSingleDocument("eMalkhana", {
			seizingUnitName: seizingUnitName.seizingUnitName,
		});
		if (seizedUnit !== null) {
			if (seizedUnit.documents.length !== 0) {
				seizedUnit.documents = await Promise.all(
					seizedUnit.documents.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}
			if (seizedUnit.reOpenUploadOrder.length !== 0) {
				seizedUnit.reOpenUploadOrder = await Promise.all(
					seizedUnit.reOpenUploadOrder.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}
			return res.send({ status: 1, data: seizedUnit });
		} else {
			return res.send({ status: 0, msg: "data not found" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

// ------------------get report using Seizing Name Wise-----------------//

const getReportUsingSeizingItemWise = async (req, res) => {
	try {
		const seizedItemName = req.body;
		const seizedItem = await db.findSingleDocument("eMalkhana", {
			"seizedItemName.current": seizedItemName.seizedItemName.current,
		});
		if (seizedItem !== null) {
			if (seizedItem.documents.length !== 0) {
				seizedItem.documents = await Promise.all(
					seizedItem.documents.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}
			if (seizedItem.reOpenUploadOrder.length !== 0) {
				seizedItem.reOpenUploadOrder = await Promise.all(
					seizedItem.reOpenUploadOrder.map(async (file) => {
						return {
							...file,
							actualPath: file.href,
							href: await getSignedUrl(file.href),
						};
					})
				);
			}
			return res.send({ status: 1, data: seizedItem });
		} else {
			return res.send({ status: 0, msg: "data not found" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

// ----------------------get Report using Yearwise------------------------------------//
const getReportUsingYearWise = async (req, res) => {
	try {
		const inputYear = req.body.year;

		if (!inputYear) {
			return res.send({
				status: 0,
				msg: "Missing 'createdAt' field in the request body",
			});
		}

		const yearWiseDataRequest = await db.getAggregation("eMalkhana", [
			{
				$addFields: {
					extractedYear: { $year: "$createdAt" },
				},
			},
			{
				$match: {
					extractedYear: parseInt(inputYear),
				},
			},
		]);

		if (yearWiseDataRequest !== null && yearWiseDataRequest.length > 0) {
			return res.send({ status: 1, data: yearWiseDataRequest });
		} else {
			return res.send({
				status: 0,
				msg: "Data not found for the specified year",
			});
		}
	} catch (error) {
		return res.send({ status: 0, msg: error.message });
	}
};

// //------     update data of emalkhana using particular feilds seizedItemWeight, seizedItemValue, itemDesc      --------//

const updateSpecficFieldByid = async (req, res) => {
	try {
		const updateData = req.body;

		if (!mongoose.isValidObjectId(updateData.id)) {
			return res.send({ status: 0, msg: "invalid id" });
		}
		const getPreviousDataByID = await db.findSingleDocument("eMalkhana", {
			_id: new mongoose.Types.ObjectId(updateData.id),
		});

		if (updateData.seizedItemWeight) {
			if (
				getPreviousDataByID.seizedItemWeight.current !==
				updateData.seizedItemWeight.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.seizedItemWeight.current,
					date: getPreviousDataByID.updatedAt,
				};
				updateData.seizedItemWeight.previousData = [
					...getPreviousDataByID.seizedItemWeight.previousData,
					newPreviousData,
				];
			} else {
				delete updateData.seizedItemWeight;
			}
		}

		if (updateData.seizedItemValue) {
			if (
				getPreviousDataByID.seizedItemValue.current !==
				updateData.seizedItemValue.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.seizedItemValue.current,
					date: getPreviousDataByID.updatedAt,
				};
				updateData.seizedItemValue.previousData = [
					...getPreviousDataByID.seizedItemValue.previousData,
					newPreviousData,
				];
			} else {
				delete updateData.seizedItemValue;
			}
		}

		if (updateData.itemDesc) {
			if (
				getPreviousDataByID.itemDesc.current !==
				updateData.itemDesc.current
			) {
				const newPreviousData = {
					data: getPreviousDataByID.itemDesc.current,
					date: getPreviousDataByID.updatedAt,
				};
				updateData.itemDesc.previousData = [
					...getPreviousDataByID.itemDesc.previousData,
					newPreviousData,
				];
			} else {
				delete updateData.itemDesc;
			}
		}

		const eMalkhanaUpdateById = await db.findByIdAndUpdate(
			"eMalkhana",
			updateData.id,
			updateData
		);
		if (eMalkhanaUpdateById) {
			return res.send({ status: 1, msg: "updated successfully" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

// delete file Api
const deleteDocumentBasedOnEmalkhanaNo = async (req, res) => {
	try {
		const filedata = req.body;
		const updatefile = await db.updateOneDocument(
			"eMalkhana",
			{ _id: filedata.id },
			{
				$pull: { documents: { href: filedata.href } },
			}
		);
		if (updatefile !== null) {
			await deleteFile(filedata.href);

			return res.send({ status: 1, msg: "file Deleted Sucessfully" });
		} else {
			return res.send({ status: 0, msg: "invalid Request" });
		}
	} catch (error) {
		return res.send({ status: 0, msg: error.message });
	}
};

// _____Re-open UPDATE API------------------//

const reOpenUpdateUsingMultipleeMalkhanaNo = async (req, res) => {
	try {
		let {
			inputReOpenData,
			updateInputReOpenData,
			updateMalkhanasNo = [],
			reOpenReason,
			reOpenUploadOrder,
			reOpenDate,
			handOverOfficerName,
			handOverOfficerDesignation,
			newSealNo,
			newOfficerName,
			newOfficerDesignation,
			updatesGivenData,
		} = req.body;

		updatesGivenData = {
			reOpenReason,
			reOpenUploadOrder,
			reOpenDate,
			handOverOfficerName,
			handOverOfficerDesignation,
			newSealNo,
			newOfficerName,
			newOfficerDesignation,
			...inputReOpenData,
		};
		if (req.files) {
			await Promise.all(
				updateMalkhanasNo.map(async (ele) => {
					updatesGivenData.reOpenUploadOrder = await uploadToAws(
						CONFIG.REOPENUPLOADORDERDOC,
						ele,
						req.files.reOpenUploadOrder
					);
				})
			);
		}

		updatesGivenData.status = 4;
		updatesGivenData.createdBy = res.locals.userData.userId;
		updateInputReOpenData = await db.updateManyDocuments(
			"eMalkhana",
			{ eMalkhanaNo: { $in: updateMalkhanasNo } },
			{ $set: updatesGivenData }
		);

		if (updateInputReOpenData) {
			res.send({ status: 1, msg: "data updated succesfully" });
		} else {
			res.send({ status: 0, msg: "data not found" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

//= ================================emalkhana data & receipt data using emalkhanaid

const getReceiptMalkhanaDataById = async (req, res) => {
	try {
		const numberData = req.body;
		let allData;

		const getEmalkhanaData = await db.findSingleDocument("eMalkhana", {
			_id: new mongoose.Types.ObjectId(numberData.id),
		});
		const getReceiptData = await db.findSingleDocument("receipt", {
			eMalkhanaId: new mongoose.Types.ObjectId(numberData.id),
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
			allData = {
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

const getAllDataByEmalkhanaId = async (req, res) => {
	try {
		const numberData = req.body;
		let allData;

		const getEmalkhanaData = await db.findSingleDocument("eMalkhana", {
			_id: new mongoose.Types.ObjectId(numberData.id),
		});
		const getReceptData = await db.findSingleDocument("receipt", {
			eMalkhanaId: new mongoose.Types.ObjectId(numberData.id),
		});
		const getDisposalData = await db.findSingleDocument("disposal", {
			eMalkhanaId: new mongoose.Types.ObjectId(numberData.id),
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
			allData = {
				eMalkhanaData: getEmalkhanaData,
				receiptData: getReceptData,
				DisposalData: getDisposalData,
			};

			return res.send({ status: 1, data: allData });
		} else {
			return res.send({ status: 0, msg: "no data found" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

// ------------ Get emalkhana number using status -----------------//
const getAlleMalkhanaNoUsingStatus = async (req, res) => {
	try {
		const inputData = req.query;
		const getData = await db.findDocuments(
			"eMalkhana",
			{ status: inputData.status },
			{ _id: 0, eMalkhanaNo: 1 }
		);
		if (getData.length !== 0) {
			return res.send({
				status: 1,
				msg: "get data successfully",
				data: getData,
			});
		} else {
			return res.send({ status: 0, msg: "data not found" });
		}
	} catch (error) {
		return res.send(error.message);
	}
};

module.exports = {
	insertEMalkhanaDetails,
	updateMalkhana,
	getEmakhalaDetails,
	eMalkhanaDataById,
	searchDataUsingeMalkhanaNo,
	searchDataUsingfileNo,
	searchDataUsingItemDesc,
	searchDataUsingImporterName,
	searchDataUsingImporterAddress,
	getReportUsingSeizingItemWise,
	getReportUsingSeizingUnitWise,
	deleteDocumentBasedOnEmalkhanaNo,
	reOpenUpdateUsingMultipleeMalkhanaNo,
	getReportUsingYearWise,
	getReceiptMalkhanaDataById,
	getAllDataByEmalkhanaId,
	updateSpecficFieldByid,
	getAlleMalkhanaNoUsingStatus,
};
