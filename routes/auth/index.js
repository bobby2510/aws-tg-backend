const express = require('express')
const router = express.Router()
const user = require('../../models/user')
const plan = require('../../models/plan')
const primeuser = require('../../models/primeuser')
const primeplan = require('../../models/primeplan')
const notify = require('../../models/notify')



router.get('/',async (req,res)=>{
    res.send('Team Generation Backend!')
})

// dd/mmm/yyyy format 
let getFormattedDate = (date_number) =>{
    let temp_date = new Date(date_number)
    return `${temp_date.getDate()}-${temp_date.getMonth()}-${temp_date.getFullYear()}`
}
// block user if possible 
let blockUserIfEligible = (user_obj)=>{
    let first = new Date(Date.now())
    let list_of_dates = []
    for(let i=0;i<7;i++)
    {
        list_of_dates.push(`${first.getDate()}-${first.getMonth()}-${first.getFullYear()}`)
        first.setDate(first.getDate()-1) 
    }
    let cnt = 0 
    user_obj.loginHistory.forEach(attempt =>{
        if(list_of_dates.includes(getFormattedDate(attempt.date)))
        {
            cnt++;
        }
    })
    if(cnt>5)
        return true 
    else 
        return false 

}

router.post('/api/auth/login',async (req,res)=>{
    try{
        user_obj = await user.findOne({phoneNumber:req.body.phoneNumber})
        if(user_obj!=null)
        {
           // console.log(user_obj)
            if(user_obj.password === req.body.password)
            {
               // console.log('here')
                //some stuff needs to be done here 
                let eligible = false
                let limitReached = false 
                let blocked = false 
                if(user_obj.accountBlocked===true)
                {
                   blocked = true   
                }
                else{
                    let my_arr = user_obj.loginHistory 
                    if(my_arr.length===0)
                    {
                        my_arr.push({
                            date:Date.now(),
                            attemptCount:1
                        })
                        user_obj.loginHistory  = my_arr 
                        eligible = true 
                    }
                    else if(my_arr.length === 1) 
                    {
                        if(getFormattedDate(my_arr[0].date) === getFormattedDate(Date.now()))
                        {
                            if(my_arr[0].attemptCount==1)
                            {
                                my_arr[0].attemptCount = 2 
                                user_obj.loginHistory = my_arr 
                                eligible = true 
                            }
                            else 
                            {   
                                limitReached = true
                            }
                        }
                        else 
                        {
                            eligible=true 
                            my_arr.push({
                                date:Date.now(),
                                attemptCount:1
                            })
                            user_obj.loginHistory = my_arr 
                        }
                    }
                    else{
                       // console.log('more here')
                        if(blockUserIfEligible(user_obj)=== true )
                        {
                            user_obj.accountBlocked= true 
                            blocked = true 
                        }
                       // console.log('temp here')
                        let arr_length = my_arr.length 
                        if(getFormattedDate(my_arr[arr_length-1].date) === getFormattedDate(Date.now()))
                        {
                            limitReached= true 
                            eligible=true
                        }
                        else{
                            eligible=true 
                            my_arr.push({
                                date:Date.now(),
                                attemptCount:1
                            })
                            user_obj.loginHistory = my_arr 
                        }
                       
                    }

                    user_obj.markModified('loginHistory')
                    await user_obj.save()
                    if(false && blocked === true )
                    {
                        res.status(201).json({
                            status:'fail',
                            message:'Your Account has been blocked, contact whatsapp: 9848579715'
                        })  
                    }
                    if(false && limitReached===true) //for now ignore
                    {
                        res.status(201).json({
                            status:'fail',
                            message:'Login Limit Reached!'
                        })
                    }
                    if(eligible === true)
                    {
                        res.status(200).json({
                            status:'success',
                            data: {id:user_obj._id,phoneNumber:user_obj.phoneNumber,changedPassword:user_obj.changedPassword,role:user_obj.role},
                            message:'user logged in successfully!'
                        })
                    }
                }
              
            }
            else{
                res.status(201).json({
                    status:'fail',
                    message:'Invalid Password!'
                })
            }
            
        }
        else 
        {
            res.status(201).json({
                status:'fail',
                message:'Invalid Mobile Number!'
            })
        }
    }
    catch(e){
        console.log(e)
        res.status(404).json({
            status:'fail',
            message:'Some Error Occured!'
        })
    }
})

router.post('/api/auth/block/:userid/:adminid',async (req,res)=>{
    try{
        admin_obj = await user.findById(req.params.adminid)
        if(admin_obj!=null && admin_obj.role === 'admin' || admin_obj.role === 'superuser')
        {
            user_obj = await user.findById(req.params.userid)
            if(user_obj!=null)
            {
                if(user_obj.role === 'admin')
                {
                    return;
                }
                user_obj.accountBlocked = true 
                await user_obj.save()
                res.status(200).json({
                    status:'success',
                    message:'User Account Blocked Successfully!'
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
    catch(e)
    {
        res.status(404).json({
            status:'fail',
            message:'Something Went Wrong!'
        })
    }
})

router.post('/api/auth/unblock/:userid/:adminid',async (req,res)=>{
    try{
        admin_obj = await user.findById(req.params.adminid)
        if(admin_obj!=null && admin_obj.role === 'admin' || admin_obj.role === 'superuser')
        {
            user_obj = await user.findById(req.params.userid)
            if(user_obj!=null)
            {
                if(user_obj.role === 'admin')
                {
                    return;
                }
                user_obj.accountBlocked = false
                await user_obj.save()
                res.status(200).json({
                    status:'success',
                    message:'User Account UnBlocked Successfully!'
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
    catch(e)
    {
        res.status(404).json({
            status:'fail',
            message:'Something Went Wrong!'
        })
    }
})

let get_plan_obj = (p)=>{
    let start = new Date(p.startDate)
    let end = new Date(p.startDate)
    end.setDate(end.getDate()+ p.duration)
    return {
        start_date: `${start.getDate()}-${start.getMonth()+1}-${start.getFullYear()}`,
        end_date:`${end.getDate()}-${end.getMonth()+1}-${end.getFullYear()}`,
        duration: p.duration,
        status: p.active 
    }
}

router.get('/api/auth/admin/superuserdetail/:adminid/:superuserphonenumber',async (req,res)=>{
    try{
        let admin_obj = await user.findById(req.params.adminid)
        let superuserphonenumber = req.params.superuserphonenumber
        if(admin_obj !=null && admin_obj.role === 'admin')
        {
            let req_list = await notify.find({superUserPhoneNumber: superuserphonenumber}).sort({createdAt: -1})
            let register_list = await notify.find({superUserPhoneNumber:superuserphonenumber,notifyType:'register'})

            
            res.status(200).json({
                status:'success',
                data:req_list.slice(0,800),
                totalCount: req_list.length,
                registerCount: register_list.length,
                addPlanCount: req_list.length - register_list.length,
                message: 'data fetched successfully!'
            })
        }
    }
    catch{
        res.status(404).json({
            status:'fail',
            message:'Something Went Wrong!'
        })
    }

})

router.post('/api/auth/removelimit/:userid/:adminid',async (req,res)=>{
    try{
        admin_obj = await user.findById(req.params.adminid)
        if(admin_obj!=null && admin_obj.role === 'admin' || admin_obj.role === 'superuser')
        {
            user_obj = await user.findById(req.params.userid)
            if(user_obj!=null)
            {
                if(user_obj.role === 'admin')
                {
                    return;
                }
                // do some stuff here 
                let arr = user_obj.loginHistory 
                if(arr.length>0)
                    arr.splice(-1);
                user_obj.loginHistory = arr;
                user_obj.markModified('loginHistory')
                await user_obj.save()
                res.status(200).json({
                    status:'success',
                    message:'Login Limit Removed Successfully!'
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
    catch(e)
    {
        res.status(404).json({
            status:'fail',
            message:'Something Went Wrong!'
        })
    }
})

// router.get('/api/auth/allremove',async (req,res)=>{
//     try{
       
      
//             user_obj_list = await user.find({})
//             if(user_obj_list !=null && user_obj_list.length>0)
//             {
//                let cnt =0;
//                 // do some stuff here
//                 for(let i=0;i<user_obj_list.length;i++)
//                 {
//                     console.log(cnt)
//                     let user_obj = user_obj_list[i]
                 
//                     if(user_obj.loginHistory === undefined || user_obj.loginHistory === null) 
//                         continue;
//                     let arr = user_obj.loginHistory 
//                     if(arr.length>0)
//                         arr.splice(-1);
//                     if(arr.length>0)
//                         arr.splice(-1);
//                     user_obj.loginHistory = arr;
//                     user_obj.markModified('loginHistory')
//                     user_obj.accountBlocked = false;
//                     await user_obj.save()
//                     cnt++;
                   
//                 }
//                 res.status(200).json({
//                     status:'success',
//                     count: cnt,
//                     message:'user login limit removed!'
//                 })

//             }
//     }
//     catch(e)
//     {
//         console.log(e)
//         res.status(404).json({
//             status:'fail',
//             message:'Something Went Wrong!'
//         })
//     }
// })

router.get('/api/auth/superuser/:superuserid',async (req,res)=>{
    try{
       // console.log(req.params.superuserid)
        let super_user_obj = await user.findById(req.params.superuserid)
        //console.log(super_user_obj)
        if(super_user_obj!=null && super_user_obj.role === 'superuser')
        {
        
            let req_list = await notify.find({superUserPhoneNumber: super_user_obj.phoneNumber}).sort({createdAt: -1})
            let register_list = await notify.find({superUserPhoneNumber:super_user_obj.phoneNumber,notifyType:'register'})

            res.status(200).json({
                status:'success',
                data:req_list.slice(0,800),
                totalCount: req_list.length,
                registerCount: register_list.length,
                addPlanCount: req_list.length - register_list.length,
                message: 'data fetched successfully!'
            })

        }
    }
    catch(e){
        console.log(e)
        res.status(404).json({
            status:'fail',
            message:'error'
        })
    }
})




router.get('/api/auth/notify/:adminid',async (req,res)=>{
    try{
        admin_obj = await user.findById(req.params.adminid)
        if(admin_obj!=null && admin_obj.role === 'admin')
        {
            let recent_list = await notify.find({}).sort({createdAt:-1}).limit(100)
            res.status(200).json({
                status:'success',
                data: recent_list,
                message: "SuperUser accounts fetched successfully!"
            })
        }
    }
    catch 
    {
        res.status(404).json({
            status:'fail',
            message:'Something Went Wrong!'
        })
    }
})

router.post('/api/auth/details/:adminid',async (req,res)=>{
    try{
        admin_obj = await user.findById(req.params.adminid)
        if(admin_obj!=null && admin_obj.role === 'admin' || admin_obj.role === 'superuser')
        {
            user_obj = await user.findOne({phoneNumber:req.body.phoneNumber})
            if(user_obj!=null)
            {
                let prime_user = await primeuser.findOne({phoneNumber:user_obj.phoneNumber})
                let plan_obj = await plan.findOne({user:user_obj._id,active:true})
                let activePlan = (plan_obj!=null)? true : false;
                let previous_plans = await plan.find({user:user_obj._id,active:false})
                let previous_public_plans = []

                let primeplan_obj = await primeplan.findOne({user:user_obj._id,active:true})
                let primeplan_previous_plans = await primeplan.find({user:user_obj._id,active:false})
                let primeplan_previous_public_plans = []
                let current_prime_plan = primeplan_obj !=null? get_plan_obj(primeplan_obj) : null;


                let current_plan = plan_obj!=null? get_plan_obj(plan_obj) : null;
                previous_plans.forEach((p)=>{
                    previous_public_plans.push(get_plan_obj(p))
                })

                primeplan_previous_plans.forEach(p => {
                    primeplan_previous_public_plans.push(get_plan_obj(p))
                })

                res.status(200).json({
                    status:'success',
                    data:{
                        accountBlocked: user_obj.accountBlocked,
                        activePlan: activePlan,
                        current_plan:current_plan,
                        previous_plans:previous_public_plans,
                        userId:user_obj._id,
                        password:user_obj.password,
                        phoneNumber:user_obj.phoneNumber,
                        current_prime_plan: current_prime_plan,
                        previous_prime_plans: primeplan_previous_public_plans,
                        prime_user: prime_user === null ? false : true,
                        prime_plan: primeplan_obj === null? false : true
                    },
                    message:'user data successfully fetched!'
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
    catch{
        res.status(404).json({
            status:'fail',
            message:'Something Went Wrong!'
        })
    }
})


router.put('/api/auth/change_password/:userid',async(req,res)=>{
    try{
        let user_obj = await user.findById(req.params.userid)
        if(user_obj!=null)
        {
            user_obj.name = req.body.name
            user_obj.email= req.body.email 
            user_obj.password = req.body.password
            user_obj.changedPassword = true 
            await user_obj.save()
            res.status(200).json({
                status:'success',
                message:'password and user details updated successfully!'
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
    catch{
        res.status(404).json({
            status:'fail',
            message:'Something went wrong!'
        })
    }
})

router.post('/api/auth/registerprime',async(req,res)=>{
    try{
        //console.log('hi')
        let user_obj = await user.findOne({phoneNumber:req.body.phoneNumber})
        if(user_obj === null)
        {
            res.status(201).json({
                status:'fail',
                message:'TG account does not exist!'
            })
            return
        }
        let primeuser_obj = await primeuser.findOne({phoneNumber:req.body.phoneNumber})
        if(primeuser_obj!=null)
        {
            res.status(201).json({
                status:'fail',
                message:'Mobile nubmer Already Registered!'
            })
            return 
        }
        let user_data = {
            phoneNumber:req.body.phoneNumber,
        }
        if(req.body.phoneNumber === '9848579715')
        user_data.role = 'admin'
        created_user = await primeuser.create(user_data)
        if(created_user!=null)
        {
            res.status(200).json({
                status:'success',
                message:'Prime Account Created successfully!'
            })
        }
        else{
            res.status(201).json({
                status:'fail',
                message:'Failed to create your account!'
            })
        }
    }
    catch(e){
        res.status(404).json({
            status:'fail',
            message:'Some Error Occured!'
        })
    }
})


router.post('/api/auth/register4642',async(req,res)=>{
    return;
    try{
        let user_obj = await user.findOne({phoneNumber:req.body.phoneNumber})
        if(user_obj!=null)
        {
            res.status(201).json({
                status:'fail',
                message:'Mobile nubmer Already Registered!'
            })
            return 
        }
        let user_data = {
            phoneNumber:req.body.phoneNumber,
            password: req.body.password
        }
        if(req.body.phoneNumber === '9848579715')
        user_data.role = 'admin'
        created_user = await user.create(user_data)
        if(created_user!=null)
        {
            let new_plan = await plan.create(
                {startDate:Date.now(),
                    active:true,
                    duration:req.body.duration,
                    user:created_user._id
                })
            if(new_plan!=null)
            {
                res.status(200).json({
                    status:'success',
                    message:'Accounted Created successfully! and active for plan: '+req.body.duration+' days!'
                })
            }
            else{
                res.status(201).json({
                    status:'fail',
                    message:'Account Created, Error While Creating the Plan!'
                })
            }
        }
        else{
            res.status(201).json({
                status:'fail',
                message:'Failed to create your account!'
            })
        }
    }
    catch(e){
        res.status(404).json({
            status:'fail',
            message:'Some Error Occured!'
        })
    }
})


router.post('/api/auth/super/register4642',async(req,res)=>{
    try{
        let user_obj = await user.findOne({phoneNumber:req.body.phoneNumber})
        if(user_obj!=null)
        {
            res.status(201).json({
                status:'fail',
                message:'Mobile nubmer Already Registered!'
            })
            return 
        }
        let user_data = {
            phoneNumber:req.body.phoneNumber,
            password: req.body.password,
            
        }
        console.log('here')
        let superUserPhoneNumber = req.body.superUserPhoneNumber
        if(req.body.phoneNumber === '9848579715')
            user_data.role = 'admin'
        created_user = await user.create(user_data)
        if(created_user!=null)
        {
            let new_plan = await plan.create(
                {startDate:Date.now(),
                    active:true,
                    duration:req.body.duration,
                    user:created_user._id
                })
            if(new_plan!=null)
            {
                console.log(superUserPhoneNumber)
                console.log(created_user.phoneNumber)
                console.log(req.body.duration)
                let notify_obj = await notify.create(
                    {
                        superUserPhoneNumber: superUserPhoneNumber,
                        userPhoneNumber: created_user.phoneNumber,
                        duration: req.body.duration,
                        notifyType:"register"
                    }
                )
                console.log(notify_obj)
                console.log("hi hello")
                res.status(200).json({
                    status:'success',
                    message:'Accounted Created successfully! and active for plan: '+req.body.duration+' days!'
                })
                //here i should get notified 
                //account creation and plan creation 
                // codervp
               
            }
            else{
                res.status(201).json({
                    status:'fail',
                    message:'Account Created, Error While Creating the Plan!'
                })
            }
        }
        else{
            res.status(201).json({
                status:'fail',
                message:'Failed to create your account!'
            })
        }
    }
    catch(e){
        res.status(404).json({
            status:'fail',
            message: e
        })
    }
})

module.exports = router 