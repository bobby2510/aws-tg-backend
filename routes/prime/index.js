const express = require('express')
const plan = require('../../models/plan')
const primeplan = require('../../models/primeplan')
const primeuser = require('../../models/primeuser')
const primeteam = require('../../models/primeteam')
const user = require('../../models/user')
const notify = require('../../models/notify')
const router = express.Router()



router.post('/api/primeplan/add/:userid/:adminid', async (req,res)=>{
    try{
        let admin_obj = await user.findById(req.params.adminid)
        if(admin_obj!=null && admin_obj.role === 'admin')
        {
            let user_obj = await user.findById(req.params.userid)
            if(user_obj!=null)
            {

                let plan_obj = await primeplan.findOne({user:user_obj._id,active:true})
                if(plan_obj!=null)
                {
                    plan_obj.duration = parseInt(plan_obj.duration) + parseInt(req.body.duration)
                    await plan_obj.save()
                }
                else 
                {
                    await primeplan.create({
                        startDate:Date.now(),
                        active:true,
                        duration:req.body.duration,
                        user:user_obj._id 
                    })
                }
                res.status(200).json({
                    status:'success',
                    message:'Plan Upgraded Successfully!'
                })
            }
            else
            {
                res.status(201).json({
                    status:'fail',
                    message:'Invalid User!'
                })
            }
        }
        else
        {
            res.status(201).json({
                status:'fail',
                message:'Invalid Admin!'
            })
        }
    }
    catch(e){
        res.status(404).json({
            status:'fail',
            message:'Something Went Wrong!'
        })
    }
})

router.post('/api/primeplan/add/super/:userid/:superid', async (req,res)=>{
    try{
        let super_obj = await user.findOne({_id:req.params.superid.toString().trim()})      
        if(super_obj!=null && super_obj.role === 'superuser')
        {
            let user_obj = await user.findById(req.params.userid)
            if(user_obj!=null)
            {
                //console.log(user_obj)
                let plan_obj = await primeplan.findOne({user:user_obj._id,active:true})
                if(plan_obj!=null)
                {
                    plan_obj.duration = parseInt(plan_obj.duration) + parseInt(req.body.duration)
                   // console.log(plan_obj)
                    await plan_obj.save()
                }
                else 
                {
                    await primeplan.create({
                        startDate:Date.now(),
                        active:true,
                        duration:req.body.duration,
                        user:user_obj._id 
                    })
                }
                //here again i should get notified codervp
             let notify_obj =  await notify.create(
                    {
                        superUserPhoneNumber: super_obj.phoneNumber,
                        userPhoneNumber: user_obj.phoneNumber,
                        duration: req.body.duration,
                        notifyType:"primeplan"
                    }
                )
                console.log(notify_obj)
                res.status(200).json({
                    status:'success',
                    message:'Plan Upgraded Successfully!'
                })
            }
            else
            {
                res.status(201).json({
                    status:'fail',
                    message:'Invalid User!'
                })
            }
        }
        else
        {
            res.status(201).json({
                status:'fail',
                message:'Invalid Admin!'
            })
        }
    }
    catch(e){
        res.status(404).json({
            status:'fail',
            message:e
        })
    }
})

router.delete('/api/primeplan/remove/:userid/:adminid',async (req,res)=>{
    try{
      //  console.log('first')
        let admin_obj = await user.findById(req.params.adminid)
      //  console.log(admin_obj)
        if(admin_obj!=null && admin_obj.role === 'admin' || admin_obj.role === 'superuser')
        {
            let user_obj = await user.findById(req.params.userid)
            console.log(user_obj)
            if(user_obj!=null)
            {
                let plan_obj = await primeplan.findOne({user:user_obj._id,active:true})
                if(plan_obj!=null)
                {
                    plan_obj.active = false 
                    await plan_obj.save()
                    res.status(200).json({
                        status:'success',
                        message:'Plan Removed Successfully!'
                    })
                }
                else 
                {
                    res.status(201).json({
                        status:'success',
                        message:'Already no active plans for this user!'
                    })
                }
               
            }
            else 
            {
                res.status(201).json({
                    status:'fail',
                    message:'Invalid User!'
                }) 
            }
        }
        else
        {
            res.status(201).json({
                status:'fail',
                message:'Invalid Admin!'
            }) 
        }
    }
    catch(e){
       // console.log(e)
        res.status(404).json({
            status:'fail',
            message:'Something went wrong!'
        })
    }
})


router.post('/api/primeteam/add', async (req,res)=>{   
    try{
        // add prime teams 
        let temp = {
           matchId:req.body.matchId,
           numberOfTeams: req.body.numberOfTeams,
           teamData:req.body.teamData,
           sportIndex:req.body.sportIndex,
           primeUserData: req.body.primeUserData,
       }
       let obj = await primeteam.create(temp)
       if(obj!==null)
       {
           res.status(200).json({
               status:'success',
               message:'Teams Posted Successfully!' 
           })
       }
   }
   catch(e){
       res.status(404).json({
           status:'fail',
           messsage:'Something Went Wrong!'
       })
   }
})

router.get('/api/primeteam/teamlist',async (req,res)=>{
    try{
        let req_data = await primeteam.find({}).sort({createdAt:-1}).limit(50)
        if(req_data.length>0)
        {
            let match_id_list = []
            for(let i=0;i<req_data.length;i++)
            {
                let vp = req_data[i] 
                if(match_id_list.indexOf(vp.matchId) === -1)
                    match_id_list.push(vp.matchId)
            }
            res.status(200).json({
                status:'success',
                data:match_id_list,
                message:'Prime Matchlist fetched successfully!'
            })
        }
        else 
        {
           // console.log(e)
            res.status(404).json({
                status:'fail',
                message:'No matches are there now!'
            })
        }
    }
    catch(e)
    {
        res.status(404).json({
            status:'fail',
            message:'Something went wrong!'
        })
    }
})

router.get('/api/primeteam/getdata/:matchid/:phonenumber',async (req,res)=>{
    try{
        let data = await primeteam.find({matchId:req.params.matchid}).sort({createdAt: -1})
        if(data.length>0)
        {
            let req_data = data[0]; 
            let pp_data = req_data.primeUserData
            for(let i=0;i<pp_data.length;i++)
            {
                if(pp_data[i].phoneNumber.toString() === req.params.phonenumber)
                {
                    //we got the data here 
                    let req_teams = []
                    for(let j=pp_data[i].left-1;j<pp_data[i].right;j++)
                        req_teams.push(req_data.teamData[j])
                    res.status(200).json({
                        status:'success',
                        phoneNumber:req.params.phonenumber,
                        primeTeams:true, 
                        teamData: req_teams, 
                        sportIndex: req_data.sportIndex, 
                        numberOfTeams: parseInt(pp_data[i].right)-parseInt(pp_data[i].left)+1,
                        message: 'Prime Teams Fetched for given User!'
                    })
                    return 
                }
            }
            res.status(201).json({
                status:'fail',
                primeTeams:false,
                message: 'Prime Teams not Allocated for given user!'
            })
        }
        else 
        {
            res.status(201).json({
                status:'fail',
                message:'Match is not available for prime teams!'
            })
        }

    }
    catch(e)
    {
        res.status(404).json({
            status:'fail',
            message:'Something Went Wrong!'
        })
    }
})

router.get('/api/primeplan/refresh', async (req,res)=>{
    try{
        let prime_plan_list = await primeplan.find({active:true}) 
      //  console.log(prime_plan_list)
        let cnt = prime_plan_list.length
        let phoneNumberList = []
        for(let i=0;i<prime_plan_list.length;i++)
        {
            let obj = prime_plan_list[i]
            //console.log(obj)
            let validity = new Date(obj.startDate)
            validity.setDate(validity.getDate()+obj.duration)
            let present = new Date(Date.now())
            if(present > validity)
            {
                obj.active = false;
                cnt--;
                await obj.save()
            }
            else 
            {
               let user_obj =  await  user.findById(obj.user)
                phoneNumberList.push(user_obj.phoneNumber)
            }
        }
        res.status(200).json({
            status:'success',
            active_prime: cnt,
            phoneNumberList: phoneNumberList,
            message: 'Active Prime Users is Refreshed!'
        })
        return 
    }
    catch(e)
    {
      //  console.log(e)
        res.status(404).json({
            status:'fail',
            message:'Something Went Wrong!'
        })
    }
})

module.exports = router 
