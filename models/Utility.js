const mongoose = require('mongoose')


const UtilsSchema =  new mongoose.Schema({
    notificationActive:{
        type:Boolean,
        required:true
    },
    dream11Hash:{
        type: String,
        required: true
    },
    perfectLineupHash:{
        type: String,
        required: true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})

module.exports = new mongoose.model('utildb',UtilsSchema)