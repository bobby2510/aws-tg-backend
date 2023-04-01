const mongoose = require('mongoose')

const SeriesSchema =  new mongoose.Schema({
    seriesName:{
        type: String,
        required: true
    },
    seriesYear:{
        type: Number,
        required: true
    },
    seriesMonth:{
        type: String,
        required: true
    },
    seriesCountry:{
        type: String,
        required: true
    },
    seriesGender:{
        type: String,
        required: true
    },
    seriesType:{
        type: String,
        required: true
    },
    seriesFormat:{
        type: String,
        required: true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})

module.exports = new mongoose.model('series',SeriesSchema)