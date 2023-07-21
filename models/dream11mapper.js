const mongoose = require('mongoose')


const  Dream11MapperSchema=  new mongoose.Schema({
    tgMatchId:{
        type:String,
        required:true
    },
    dream11MatchId:{
        type: String,
        required: true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})

module.exports = new mongoose.model('dream11Mapper',Dream11MapperSchema)