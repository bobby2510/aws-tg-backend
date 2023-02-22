const express = require('express')
const plan = require('../../models/plan')
const user = require('../../models/user')
const primeplan = require('../../models/primeplan')
const primeuser = require('../../models/primeuser')
const notify = require('../../models/notify')
const promotion = require('../../models/promotion')
const utildb = require('../../models/Utility')
const router = express.Router()



router.post('/api/plan/add/:userid/:adminid', async (req,res)=>{
    try{
        let admin_obj = await user.findById(req.params.adminid)
        if(admin_obj!=null && admin_obj.role === 'admin')
        {
            let user_obj = await user.findById(req.params.userid)
            if(user_obj!=null)
            {
                let plan_obj = await plan.findOne({user:user_obj._id,active:true})
                if(plan_obj!=null)
                {
                    plan_obj.duration = plan_obj.duration + req.body.duration 
                    await plan_obj.save()
                }
                else 
                {
                    await plan.create({
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

router.post('/api/plan/add/super/:userid/:superid', async (req,res)=>{
    try{
        let super_obj = await user.findOne({_id:req.params.superid.toString().trim()})      
        if(super_obj!=null && super_obj.role === 'superuser')
        {
            let user_obj = await user.findById(req.params.userid)
            if(user_obj!=null)
            {
               // console.log(user_obj)
                let plan_obj = await plan.findOne({user:user_obj._id,active:true})
                if(plan_obj!=null)
                {
                    plan_obj.duration = plan_obj.duration + req.body.duration 
                   // console.log(plan_obj)
                    await plan_obj.save()
                }
                else 
                {
                    await plan.create({
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
                        notifyType:"addplan"
                    }
                )
               // console.log(notify_obj)
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



router.get('/api/plan/status/:userid', async (req,res)=>{
        try{
            let user_obj = await user.findById(req.params.userid)
            if(user_obj!=null)
            { 
              //  console.log(user_obj)
                //calling utils here as well for getting notifcation info
                let prime_user = await primeuser.findOne({phoneNumber:user_obj.phoneNumber})
                let plan_expired = false 
                let primeplan_expired = false 
                let plan_obj = await plan.findOne({user:req.params.userid,active:true})
                let plan_history_list = await plan.find({user:req.params.userid,active:false})
                let primeplan_obj = await primeplan.findOne({user:req.params.userid,active:true})
                let primeplan_history_list = await primeplan.find({user:req.params.userid,active:false})
                let primeplan_history_public_list = []
                let current_prime_plan = null 
                let plan_history_public_list = []
                let current_plan = null
                plan_history_list.forEach((p)=>{
                    let start = new Date(p.startDate)
                    let end = new Date(p.startDate)
                    end.setDate(end.getDate()+ p.duration)
                    plan_history_public_list.push({
                        start_date: `${start.getDate()}-${start.getMonth()+1}-${start.getFullYear()}`,
                        end_date:`${end.getDate()}-${end.getMonth()+1}-${end.getFullYear()}`,
                        duration: p.duration,
                        status: p.active 
                    })
                })
                primeplan_history_list.forEach((p)=>{
                    let start = new Date(p.startDate)
                    let end = new Date(p.startDate)
                    end.setDate(end.getDate()+ p.duration)
                    primeplan_history_public_list.push({
                        start_date: `${start.getDate()}-${start.getMonth()+1}-${start.getFullYear()}`,
                        end_date:`${end.getDate()}-${end.getMonth()+1}-${end.getFullYear()}`,
                        duration: p.duration,
                        status: p.active 
                    })
                })
                if(plan_obj!=null)
                {
                    let validity = new Date(plan_obj.startDate)
                    validity.setDate(validity.getDate()+plan_obj.duration)
                    let present = new Date(Date.now())
                    if(present > validity)
                    {
                        plan_obj.active = false;
                        await plan_obj.save()
                        plan_expired = true
                    }
                    else
                    {
                        let start = new Date(plan_obj.startDate)
                        let end = new Date(plan_obj.startDate)
                        end.setDate(end.getDate()+ plan_obj.duration)
                        current_plan = {
                            start_date: `${start.getDate()}-${start.getMonth()+1}-${start.getFullYear()}`,
                            end_date:`${end.getDate()}-${end.getMonth()+1}-${end.getFullYear()}`,
                            duration: plan_obj.duration,
                            status: plan_obj.active 
                        }
                    }
                }
                else
                {
                    plan_expired = true 
                }
                // let me do here for prime plan 
              //  console.log(primeplan_obj)
                if(prime_user!= null && primeplan_obj!=null)
                {
                    let validity = new Date(plan_obj.startDate)
                    validity.setDate(validity.getDate()+plan_obj.duration)
                    let present = new Date(Date.now())
                    if(present > validity)
                    {
                        primeplan_obj.active = false;
                        await primeplan_obj.save()
                        primeplan_expired = true
                    }
                    else
                    {
                        let start = new Date(primeplan_obj.startDate)
                        let end = new Date(primeplan_obj.startDate)
                        end.setDate(end.getDate()+ primeplan_obj.duration)
                        current_prime_plan = {
                            start_date: `${start.getDate()}-${start.getMonth()+1}-${start.getFullYear()}`,
                            end_date:`${end.getDate()}-${end.getMonth()+1}-${end.getFullYear()}`,
                            duration: primeplan_obj.duration,
                            status: primeplan_obj.active 
                        }
                    }
                }
                else
                {
                   // console.log('should be here')
                    primeplan_expired = true 
                }


                
                if(plan_expired===true)
                {
                    res.status(200).json({
                        status:'success',
                        data:{
                            login:true,
                            prime_user: prime_user === null? false : true,
                            prime_plan:false,
                            plan:false,
                            name:user_obj.name,
                            email:user_obj.email,
                            phoneNumber:user_obj.phoneNumber,
                            user_role:user_obj.role,
                            changedPassword:user_obj.changedPassword,
                            current_plan:current_plan,
                            previous_plans: plan_history_public_list.length > 0? plan_history_public_list : null,
                            current_prime_plan:current_prime_plan,
                            previous_prime_plans:primeplan_history_public_list.length >0? primeplan_history_public_list: null
                        },
                        message:'user have no active plan to use the software!'
                    })
                }
                else
                {
                    res.status(200).json({
                        status:'success',
                        data:{
                            login:true,
                            plan:true,
                            prime_user: prime_user === null? false : true,
                            prime_plan:primeplan_expired === true? false : true,
                            name:user_obj.name,
                            email:user_obj.email,
                            phoneNumber:user_obj.phoneNumber,
                            user_role:user_obj.role,
                            changedPassword:user_obj.changedPassword,
                            current_plan:current_plan,
                            previous_plans: plan_history_public_list.length > 0? plan_history_public_list : null, 
                            current_prime_plan:current_prime_plan,
                            previous_prime_plans:primeplan_history_public_list.length >0? primeplan_history_public_list: null
                        },
                        message:'user have valid plan to use the software!'
                    })
                }
            }
        }
        catch{
            res.status(404).json({
                status:'fail',
                message:'Something Went Wrong!'
            })
        }
})



router.delete('/api/plan/remove/:userid/:adminid',async (req,res)=>{
    try{
        let admin_obj = await user.findById(req.params.adminid)
        if(admin_obj!=null && admin_obj.role === 'admin' || admin_obj.role === 'superuser')
        {
            let user_obj = await user.findById(req.params.userid)
            if(user_obj!=null)
            {

                if(user_obj.role === 'admin')
                {
                    return;
                }

                let plan_obj = await plan.findOne({user:user_obj._id,active:true})
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
        res.status(404).json({
            status:'fail',
            message:'Something went wrong!'
        })
    }
})



module.exports = router 
