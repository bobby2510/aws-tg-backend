const mongoose = require('mongoose')


const VideoSchema =  new mongoose.Schema({
    matchId:{
        type:String,
        required: true
    },
    seriesName:{
        type: String,
        required:true
    },
    leftName:{
        type:String,
        required:true
    },
    leftImage:{
        type:String,
        required:true
    },
    rightName:{
        type:String,
        required:true
    },
    rightImage:{
        type:String,
        required:true
    },
    videoLink:{
        type:String,
        required:true
    },
    videoLanguage:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})

module.exports = new mongoose.model('video',VideoSchema)