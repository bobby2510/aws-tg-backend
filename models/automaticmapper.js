const mongoose = require('mongoose')


const  AutomaticMapper=  new mongoose.Schema({
    tgMatchId:{
        type:String,
        required:true
    },
    beatfantasyMatchId:{
        type: String,
        required: true
    },
    perfectLineupMatchId:{
        type: String,
        required: true
    },
    playerMapperData:{
        type: Array,
        required: true
    },
    leagueId:{
        type: String,
        require: true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})

module.exports = new mongoose.model('automaticmapper',AutomaticMapper)