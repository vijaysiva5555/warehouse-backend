const mongoose = require("mongoose");

const previousDataSchema = (dataType) =>
	new mongoose.Schema({
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
	});

module.exports = { previousDataSchema };
