const mongoose = require("mongoose");

const previousDataSchema = (dataType) =>
	new mongoose.Schema(
		{
			data: {
				type: dataType,
			},
			date: {
				type: Date,
			},
			reason: {
				type: String,
				default: null,
			},
		},
		{ _id: false }
	);

module.exports = { previousDataSchema };
