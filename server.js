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
mongoose.connect('mongodb+srv://user:6PHXJbAyQPw09Cvv@tg.94gva.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',options)
.then(()=> console.log('connected to the database!'))
.catch((e)=> console.log(e))

const authRouter = require('./routes/auth/index')
const planRouter = require('./routes/plan/index')
const fantasyRouter = require('./routes/fantasy/index')
const expertRouter = require('./routes/expert/index')
const primePlanRouter = require('./routes/prime/index')

app.use(cors())
app.use(express.json({ extended: false, limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }))
app.use('/',authRouter)
app.use('/',planRouter)
app.use('/',fantasyRouter)
app.use('/',expertRouter)
app.use('/',primePlanRouter)

app.listen(port,()=>{
    console.log('server is up and running at port :'+port+' !')
})
