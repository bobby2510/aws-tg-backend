const mongoose = require('mongoose')


const matchReportSchema =  new mongoose.Schema({
    series:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'series'
    },
    pitch:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'pitch'
    },
    teamOne:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'sportteam'
    },
    teamTwo:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'sportteam'
    },
    gender:{
        type:String,
        required: true
    },
    format:{
        type:String,
        required:true
    },
    data:{
        type: mongoose.Schema.Types.Mixed,
        rquired:true
    },
    sportIndex:{
        type:Number,
        required:true  
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})

module.exports = new mongoose.model('matchreport',matchReportSchema)