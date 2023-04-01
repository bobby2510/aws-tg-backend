const mongoose = require('mongoose')

const SportTeamSchema =  new mongoose.Schema({
    sportTeamName:{
        type: String,
        required: true
    },
    sportTeamCode:{
        type: String,
        required: true 
    },
    sportTeamGender:{
        type: String,
        required: true 
    },
    sportTeamCountry:{
        type: String,
        required: true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})

module.exports = new mongoose.model('sportteam',SportTeamSchema)