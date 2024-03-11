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
    bookingOpenFLag:{
        type:Boolean,
        required: true,
        default: true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})

module.exports = new mongoose.model('primebooking',PrimeBookingSchema)