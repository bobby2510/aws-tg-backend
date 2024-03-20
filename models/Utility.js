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
    perfectLineupHashTwo:{
        type: String,
        required: true,
        default:'empty'
    },
    classic_dream11_token_one:{
        type: String,
        required: true,
        default:'empty'
    },
    classic_dream11_token_two:{
        type: String,
        required: true,
        default:'empty'
    },
    transferLine:{
        type:String,
        required: true,
        default: 'all-lines'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})

module.exports = new mongoose.model('utildb',UtilsSchema)