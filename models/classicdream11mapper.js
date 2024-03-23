const mongoose = require('mongoose')


const  ClassicDream11Mapper=  new mongoose.Schema({
    tgMatchId:{
        type:String,
        required:true
    },
    dream11MatchId:{
        type: String,
        required: true
    },
    left_team_image:{
        type: String,
        required: false
    },
    right_team_image:{
        type: String,
        required: false
    },
    sport:{
        type: String,
        required: true
    },
    playerMapping:{
        type: Array,
        required: true
    },
    tourId:{
        type: String,
        require: true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})

module.exports = new mongoose.model('classicdream11mapper',ClassicDream11Mapper)