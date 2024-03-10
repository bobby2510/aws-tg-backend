const mongoose = require('mongoose')


const  LoaderBalanceMapper=  new mongoose.Schema({
    tgMatchId:{
        type:String,
        required:true
    },
    mobileNumber:{
        type: String,
        required: true,
        default: '9848579715'
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