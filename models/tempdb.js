const mongoose = require('mongoose')


const TempDB =  new mongoose.Schema({
    matchList:{
        type:Array,
        required:true
    },
    matchDataList:{
        type: Array,
        required: true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})

module.exports = new mongoose.model('tempdb',TempDB)