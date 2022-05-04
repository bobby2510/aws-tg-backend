const mongoose = require('mongoose')



const PrimePlanSchema = new mongoose.Schema({
    startDate:{
        type:Date,
        required:true 
    },
    duration:{
        type:Number,
        required:true
    },
    active:{
        type:Boolean,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    }
})

module.exports = new mongoose.model('primeplan',PrimePlanSchema)