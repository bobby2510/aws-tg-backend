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
        require:true
    },
    fantasyApp:{
        type:String,
        require:true
    },
    tossData:{
        type:String,
        require:true
    },
    teamUse:{
        type:String,
        require:true
    },
    teamData:{
        type:String,
        require:true
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