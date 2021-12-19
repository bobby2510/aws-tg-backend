const mongoose = require('mongoose')



const planSchema = new mongoose.Schema({
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
        require:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'user'
    }
})

module.exports = new mongoose.model('plan',planSchema)