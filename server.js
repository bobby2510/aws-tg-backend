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
const dream11Router = require('./routes/dream11teams/index')
const expertRouter = require('./routes/expert/index')
const primePlanRouter = require('./routes/prime/index')
const promotionRouter = require('./routes/promotion/index')
const tempdbRouter = require('./routes/tempdb/index').router;
const reportRouter = require('./routes/report/index')
const dream11MapperRouter = require('./routes/dream11Mapper/index')
const getDream11Hash = require('./routes/tempdb/index').getDream11Hash

app.use(cors())
app.use(express.json({ extended: false, limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }))
app.use('/',authRouter)
app.use('/',planRouter)
app.use('/',fantasyRouter)
app.use('/',dream11Router)
app.use('/',expertRouter)
app.use('/',primePlanRouter)
app.use('/',promotionRouter)
app.use('/',tempdbRouter)
app.use('/',reportRouter)
app.use('/',dream11MapperRouter)

setInterval(getDream11Hash,1000*300)

app.listen(port,()=>{
    console.log('server is up and running at port :'+port+' !')
})
