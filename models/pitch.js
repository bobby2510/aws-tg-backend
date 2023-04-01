const mongoose = require('mongoose')

const PitchSchema =  new mongoose.Schema({
    pitchName:{
        type: String,
        required: true
    },
    pitchCity:{
        type: String,
        required: true 
    },
    pitchCountry:{
        type: String,
        required: true 
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})

module.exports = new mongoose.model('pitch',PitchSchema)