const mongoose = require("mongoose");
const { previousDataSchema } = require("./previousDataSchema");
const { ObjectId } = require("mongodb");

const partyDetailsSchema = new mongoose.Schema(
	{
		partyName: {
			type: String,
			require: true,
		},
		partyAddress: {
			type: String,
			require: true,
		},
		iecNo: {
			type: String,
		},
	},
	{ _id: false }
);

const eMalkhana = new mongoose.Schema(
	{
		eMalkhanaNo: {
			type: String,
			require: true,
			unique: true,
		},
		status: {
			type: Number, // 1= eMalkhana generated,2 = receiptGenerated,3 = disposalStarted,4 = reopened
			require: true,
		},
		seizingUnitName: {
			type: Object,
			require: true,
		},
		fileNo: {
			type: String,
			require: true,
		},
		partyDetails: [partyDetailsSchema],
		placeOfSeizure: {
			type: String,
			require: true,
		},
		yearOfSeizure: {
			type: String,
			require: true,
		},
		seizedItemName: {
			current: {
				type: String,
				require: true,
			},
			previousData: [previousDataSchema(String)],
		},
		seizedItemWeight: {
			current: {
				type: String,
				require: true,
			},
			previousData: [previousDataSchema(String)],
		},
		seizedItemValue: {
			current: {
				type: String,
				require: true,
			},
			previousData: [previousDataSchema(String)],
		},
		seizedItemUnit: {
			current: {
				type: String,
				require: true,
			},
			previousData: [previousDataSchema(String)],
		},
		itemDesc: {
			current: {
				type: String,
				require: true,
			},
			previousData: [previousDataSchema(String)],
		},
		pendingUnderSection: {
			current: {
				type: String,
				require: true,
			},
			previousData: [previousDataSchema(String)],
		},
		seizingOfficerName: {
			type: String,
			require: true,
		},
		seizingOfficerDesignation: {
			type: String,
			require: true,
		},
		seizingOfficerSealNo: {
			type: String,
			require: true,
		},
		documents: {
			type: Array,
		},
		reOpenUploadOrder: {
			type: Array,
			default: null,
		},
		reOpenDate: {
			type: Date,
		},
		reOpenReason: {
			type: String,
		},
		reOpenOrderNo: {
			type: String,
		},
		handOverOfficerName: {
			type: String,
			default: null,
		},
		handOverOfficerDesignation: {
			type: String,
			default: null,
		},
		newSealNo: {
			type: Object,
			default: null,
		},
		newOfficerName: {
			type: Object,
			default: null,
		},
		newOfficerDesignation: {
			type: Object,
			default: null,
		},
		createdBy: {
			type: ObjectId,
			require: true,
			ref: "user",
		},
		preOpenTrail: {
			type: Number,
		}, // [note: '0 or 1']
		preOpenTrailDetails: {
			type: String,
		},
		sampleDrawn: {
			type: Number,
		}, // [note: '0 or 1']
		sampleDrawnDetails: {
			type: String,
		},
	},
	{ timestamps: true, versionKey: false }
);
module.exports = mongoose.model("eMalkhana", eMalkhana);
