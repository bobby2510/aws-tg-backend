const mongoose = require('mongoose')


const PredictionSchema =  new mongoose.Schema({
    matchId:{
        type:String,
        required: true
    },
    numberOfViews:{
        type:Number,
        required:true,
        default: 1
    },
    predictionData:{
        type:Array,
        required:true
    },
    sportIndex:{
        type:Number,
        required:true  
    },
    expertNumber:{
        type:String,
        required:true  
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})

module.exports = new mongoose.model('prediction',PredictionSchema)