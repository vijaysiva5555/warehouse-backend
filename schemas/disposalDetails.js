const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const disposalRecoveryObject = new mongoose.Schema(
	{
		realizedAmount: {
			type: String,
		},
		jpcFixedPrice: {
			type: String,
		},
		disposalDate: {
			type: Date,
		},
	},
	{ _id: false }
);

const disposalDetails = new mongoose.Schema(
	{
		whAckNo: {
			type: String,
			ref: "receipt",
			require: true,
		},
		eMalkhanaId: {
			type: ObjectId,
			ref: "eMalkhana",
			require: true,
		},
		eMalkhanaNo: {
			type: String,
			require: true,
		},
		disposalMethod: {
			type: String,
			require: true,
		},
		disposalAuctionOrder: {
			type: String,
			default: null,
		},
		disposalType: {
			type: String,
			require: true,
		},
		disposalRecovery: [disposalRecoveryObject],
		reOpenUploadOrder: {
			type: Array,
			require: true,
		},
		createdBy: {
			type: ObjectId,
			require: true,
			ref: "user",
		},
	},
	{ timestamps: true, versionKey: false }
);

module.exports = mongoose.model("disposal", disposalDetails);
