const mongoose = require('mongoose')


const PrimeBookingSchema =  new mongoose.Schema({
    matchId:{
        type:String,
        required: true
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

module.exports = new mongoose.model('primebooking',PrimeBookingSchema)