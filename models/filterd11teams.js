const mongoose = require('mongoose')


const FilterD11Teams =  new mongoose.Schema({
    TGMatchId:{
        type:String, 
        required: true
    },
    D11MatchId:{
        type:String,
        required: true
    },
    filterD11Data:{
        type:Array,
        required:true
    },
    sportIndex:{
        type:Number,
        required:true  
    },  
    createdAt:{
        type:Date,
        default:Date.now
    },
})

module.exports = new mongoose.model('filterd11teams',FilterD11Teams)