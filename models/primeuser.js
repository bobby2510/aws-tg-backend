const mongoose = require('mongoose')


const PrimeUserSchema =  new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    phoneNumber:{
        type:String,
        required:true
    },
    createAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = new mongoose.model('primeuser',PrimeUserSchema)