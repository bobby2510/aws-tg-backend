const mongoose = require('mongoose')


const userSchema =  new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    phoneNumber:{
        type:String,
        required:true
    },
    password:{
        type:String,
        require:true
    },
    role:{
        type:String,
        default:'customer'
    },
    createAt:{
        type:Date,
        default:Date.now
    },
    loginHistory:{
        type:Array,
        default:[]   
    },
    changedPassword:{
        type:Boolean,
        require:true,
        default:false
    },
    accountBlocked:{
        type:Boolean,
        require:true,
        default:false
    }
})

module.exports = new mongoose.model('user',userSchema)