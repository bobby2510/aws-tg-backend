const mongoose = require('mongoose')


const PrimeTeamSchema =  new mongoose.Schema({
    matchId:{
        type:String,
        required: true
    },
    numberOfTeams:{
        type:Number,
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
    primeUserData:{
        type:Array,
        required:true 
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})

module.exports = new mongoose.model('primeteam',PrimeTeamSchema)