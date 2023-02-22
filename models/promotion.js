const mongoose = require('mongoose')


const PromotionSchema =  new mongoose.Schema({
    label:{
        type:String,
        required: true
    },
    imageUrl:{
        type: String,
        required:true
    },
    notificationUrl:{
        type:String,
        required:true
    },
    urlType:{
        type:Number,
        required:true
    },
    order:{
        type:Number,
        required:true
    },
    active:{
        type:Boolean,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})

module.exports = new mongoose.model('promotion',PromotionSchema)