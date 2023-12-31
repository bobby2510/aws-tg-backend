const mongoose = require('mongoose')


const  LoaderBalanceMapper=  new mongoose.Schema({
    tgMatchId:{
        type:String,
        required:true
    },
    loadArray: {
        type: Array,
        required: true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})

module.exports = new mongoose.model('loadbalancemapper',LoaderBalanceMapper)