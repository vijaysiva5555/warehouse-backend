const mongoose = require("mongoose")
const updateDataSchema = new mongoose.Schema({
    current: {
        type: String,
        require:true
    },
    previousData: [{
        type: Array,
        require:true
    }]
},
    { timestamps: true, versionKey: false }
)
module.exports = mongoose.model("updateData", updateDataSchema)