const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    role: {
        type: Number,  
        require: true
    },
    status: {
        type: Number,
        default:1
    },
    name: {
        type: String,
        require: true
    }
},
    { timestamps: true, versionKey: false }
)
module.exports=mongoose.model("user",userSchema)