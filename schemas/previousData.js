const mongoose = require("mongoose")
const previousDataSchema = new mongoose.Schema({
    date: {
        type:Date,
        require:true
    },
    data: {
        type: String,
        require:true
    },
    reason: {
        type: String,
        require:true
    }
},
    { timestamps: true, versionKey: false }
)
module.exports = mongoose.model("previousData", previousDataSchema)