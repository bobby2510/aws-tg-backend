if(process.env.NODE_ENV!='production')
{
    require('dotenv').config()
}
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const port = 5000;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect('mongodb+srv://doadmin:y5801j3ImP4z72gd@db-mongodb-blr1-98732-0e5da47f.mongo.ondigitalocean.com/admin?tls=true&authSource=admin',options)
.then(()=> console.log('connected to the database!'))
.catch((e)=> console.log(e))

const authRouter = require('./routes/auth/index')
const planRouter = require('./routes/plan/index')
const fantasyRouter = require('./routes/fantasy/index')
const expertRouter = require('./routes/expert/index')
const primePlanRouter = require('./routes/prime/index')
const promotionRouter = require('./routes/promotion/index')
const tempdbRouter = require('./routes/tempdb/index')

app.use(cors())
app.use(express.json({ extended: false, limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }))
app.use('/',authRouter)
app.use('/',planRouter)
app.use('/',fantasyRouter)
app.use('/',expertRouter)
app.use('/',primePlanRouter)
app.use('/',promotionRouter)
app.use('/',tempdbRouter)

app.listen(port,()=>{
    console.log('server is up and running at port :'+port+' !')
})
