const mongoose = require('mongoose')


const UtilsSchema =  new mongoose.Schema({
    notificationActive:{
        type:Boolean,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})

module.exports = new mongoose.model('utildb',UtilsSchema)