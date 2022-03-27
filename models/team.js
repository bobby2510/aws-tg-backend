const mongoose = require('mongoose')


const TeamsSchema =  new mongoose.Schema({
    matchId:{
        type:String,
        required: true
    },
    numberOfTeams:{
        type:Number,
        required:true
    },
    typeOfTeams:{
        type:String,
        required:true
    },
    fantasyApp:{
        type:String,
        required:true
    },
    tossData:{
        type:String,
        required:true
    },
    teamUse:{
        type:String,
        required:true
    },
    teamData:{
        type:Array,
        required:true
    },
    sportIndex:{
        type:Number,
        required:true  
    },
    sectionUsed:{
        type:String,
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

module.exports = new mongoose.model('team',TeamsSchema)