const mongoose = require('mongoose')


const ExpertSchema =  new mongoose.Schema({
    name:{
        type:String
    },
    phoneNumber:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        required:true
    }
})

module.exports = new mongoose.model('expert',ExpertSchema)