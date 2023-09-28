const mongoose = require("mongoose")
const disposalRecovery = new mongoose.Schema({

    disposalRecovery:[{
    disposalDate:{ type:Date,required:true},
    jpcFixedPrice:{type:String,required:true}, 
    realizedAmount :{type:String,required:true},
}],

},
{timestamps:true,versionKey:false}
)
module.exports = mongoose.model("disposalRecovery",disposalRecovery)