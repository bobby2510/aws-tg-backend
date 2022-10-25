const express = require('express')
const plan = require('../../models/plan')
const primeplan = require('../../models/primeplan')
const primeuser = require('../../models/primeuser')
const primeteam = require('../../models/primeteam')
const primebooking = require('../../models/primebooking')
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
                        phoneNumber: user_obj.phoneNumber,
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
                        phoneNumber: user_obj.phoneNumber,
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
       console.log(e)
       res.status(404).json({
           status:'fail',
           messsage:'Something Went Wrong!'
       })
   }
})

router.get('/api/primeteam/teamlist',async (req,res)=>{
    try{
        //console.log('hi')
        let req_data = await primeteam.find({}).sort({createdAt:-1}).limit(50)
        let prime_booking_data = await primebooking.find({}).sort({createdAt:-1}).limit(50)
       // console.log(req_data)
        let match_id_list = []
        let prime_booking_list = []
        if(req_data.length>0)
        {
           
            for(let i=0;i<req_data.length;i++)
            {
                let vp = req_data[i] 
                if(match_id_list.indexOf(vp.matchId) === -1)
                    match_id_list.push(vp.matchId)
            }
        }

        if(prime_booking_data.length>0)
        {
            for(let i=0;i<prime_booking_data.length;i++)
            {
                let vp = prime_booking_data[i] 
                if(prime_booking_list.indexOf(vp.matchId) === -1)
                    prime_booking_list.push(vp.matchId)
            }
        }

        res.status(200).json({
            status:'success',
            data:match_id_list,
            booking_data:prime_booking_list,
            message:'Prime Matchlist And Booking List fetched successfully!'
        })
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
     // console.log(prime_plan_list)
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
               // let user_obj =  await  user.findById(obj.user)
                phoneNumberList.push(obj.phoneNumber)
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

// new api's here
router.post('/api/admin/primebooking/create', async (req,res)=>{
    try{
        let req_obj = await primebooking.findOne({matchId: req.body.matchId.toString()})
        if(req_obj!==null)
        {
            res.status(201).json({
                status: 'fail',
                message: 'prime booking already created!'
            })
            return;
        }
        else 
        {
            let obj = await primebooking.create({
                matchId: req.body.matchId.toString(),
                sportIndex: req.body.sportIndex,
                primeUserData: []
            })

            res.status(200).json({
                status:'success',
                message:'prime team booking created successfully!'
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

router.post('/api/primebooking/book', async (req,res)=>{
    try{
        let req_obj = await primebooking.findOne({matchId: req.body.matchId.toString()})
        if(req_obj !== null)
        {
            let primeUserData = req_obj.primeUserData  
            let flag = false 
            for(let i=0;i<primeUserData.length;i++)
            {
                if(primeUserData[i].phoneNumber.toString() === req.body.phoneNumber.toString())
                {
                    flag = true 
                    break;
                }
            }
            if(flag === false)
            {
                primeUserData.push({
                    phoneNumber: req.body.phoneNumber.toString(),
                    bookedTeams: req.body.bookedTeams
                })
                req_obj.primeUserData = primeUserData 
                await req_obj.save()
                res.status(200).json({
                    status: 'success', 
                    message:'Prime Teams Booked Successfully!'
                })
                return;
            }
            else 
            {
                res.status(201).json({
                    status:'fail',
                    message:'Prime Teams Already Booked!'
                })
                return;
            }
        }
        else 
        {
            res.status(201).json({
                status:'fail',
                message:'Match is not opened for prime team booking!'
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

router.get('/api/primebooking/status/:matchid/:phonenumber', async (req,res)=>{
    try{
        let req_obj = await primebooking.findOne({matchId: req.params.matchid})
        if(req_obj !== null)
        {
            let primeUserData = req_obj.primeUserData 
            let req_phone_number = req.params.phonenumber
            for(let i=0;i<primeUserData.length;i++)
            {
                if(primeUserData[i].phoneNumber.toString() === req_phone_number.toString())
                {
                    res.status(200).json({
                        status:'success',
                        booked: true,
                        message:'Used Already Booked Prime Teams!'
                    })
                    return;
                }
            }
            res.status(200).json({
                status:'success',
                booked: false,
                message:'Booking for this match are open for this match!'
            })
        }
        else 
        {
            res.status(201).json({
                status:'fail',
                message:'Match is not opened for prime team booking!'
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

router.get('/api/primebooking/booked/userdata/:matchid', async(req,res)=>{
    try{
        let req_obj = await primebooking.findOne({matchId: req.params.matchid})
        if(req_obj !== null)
        {
            let primeUserData = req_obj.primeUserData 
            let req_prime_user_data = []
            for(let i=0;i<primeUserData.length;i++)
            {
                req_prime_user_data.push({
                    phoneNumber: primeUserData[i].phoneNumber, 
                    bookedTeams: primeUserData[i].bookedTeams
                })
            }
            res.status(200).json({
                status:'success',
                primeUserData: req_prime_user_data,
                message:'Prime Booked User Data Fetched Successfully!'
            })
        }
        else 
        {
            res.status(201).json({
                status:'fail',
                message:'Match is not opened for prime team booking!'
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

router.get('/api/primebooking/admin/status/:matchid', async (req,res)=>{
    try{
        let req_obj = await primebooking.findOne({matchId: req.params.matchid})
        if(req_obj !== null)
        {
            res.status(200).json({
                status:'success',
                startedBooking: true,
                message:'Prime Teams Booking for this match is opened!'
            })
        }
        else 
        {
            res.status(201).json({
                status:'fail',
                startedBooking: false,
                message:'Prime Teams Booking is not opened!'
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

// getting phonenumber upon giving team number
router.get('/api/prime/getnumber/:matchId/:number', async (req,res)=>{
    try{
        let teamNumber = parseInt(req.params.number)
        let matchId = req.params.matchId
        let primeList = await primeteam.find({matchId: matchId}).sort({createdAt: -1})
        if(primeList.length>0)
        {
            let primeObject = primeList[0]
            let primeUserData = primeObject.primeUserData
            for(let i=0;i<primeUserData.length;i++)
            {
                if(teamNumber>=primeUserData[i].left && teamNumber<=primeUserData[i].right)
                {
                    res.status(200).json({
                        status: 'success',
                        phoneNumber: primeUserData[i].phoneNumber,
                        message: 'Mobile number fetched successfully!'
                    })
                    return;
                }
            }
            res.status(201).json({
                status:'fail',
                message:'Invalid teamNumber or Match Id!'
            })
        }
        else   
        {
            res.status(201).json({
                status:'fail',
                message:'No prime teams available for this match!'
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

// get complete list of data based on matchId
router.get('/api/prime/analysis/getdata/:matchId',async (req,res)=>{
    try{
        let req_data = await primeteam.find({matchId: req.params.matchId}).sort({createdAt: -1})
        if(req_data.length> 0)
        {
            res.status(200).json({
                status:'success',
                data: req_data[0],
                message: 'Prime team data fetched successfully!'
            })
        }
        else 
        {
            res.status(201).json({
                status:'fail',
                message:'match id is not having any prime teams data!'
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

//adding deleting apis now
router.delete('/api/prime/remove', async (req,res)=>{
    try{
        let booking_list = await primebooking.find({})
        let prime_list = await primeteam.find({}) 
        for(let i=0;i<booking_list.length;i++)
        {
            let p = booking_list[i]
            p.remove()
        }
        for(let i=0;i<prime_list.length;i++)
        {
            let p = prime_list[i]
            p.remove()
        }
        res.status(200).json({
            status:'success',
            message:'prime stuff deleted!'
        })
    }
    catch(e)
    {
        res.status(404).json({
            status:'fail',
            message:'Something Went Wrong!'
        })
    }
})



// router.get('/api/primeteam/createaccount',async (req,res)=>{
//     try{      
//        let data = []
//        // console.log(data)
//         let cnt =0;
//         for(let i=0;i<data.length;i++)
//         {
//             let ph = data[i] 
//             let user_obj = await user.findOne({phoneNumber: ph.toString()})
//            // console.log(user_obj)
//             if(user_obj !== null)
//             {
//                 let plan_obj = await plan.findOne({user:user_obj._id,active:true})
//                 if(plan_obj!== null)
//                 {
//                     let stuff = await primeuser.findOne({phoneNumber:ph})
//                     if(stuff === null)
//                     {
//                     let new_prime_account = await primeuser.create({
//                         phoneNumber: ph.toString()
//                     })
//                     await primeplan.create({
//                         startDate:Date.now(),
//                         active:true,
//                         duration:30,
//                         phoneNumber: ph.toString(),
//                         user:user_obj._id 
//                     })
//                     console.log(`account created for ${ph} number: ${cnt}`)
//                     cnt++;
//                     }
//                 }
//             }
//         }
//         res.status(200).json({
//             status:'success',
//             accountsCreated: cnt, 
//             message:'some stuff done'
//         })
//     }
//     catch(e)
//     {
//         res.status(200).json({
//             status:'fail',
//             message:'Something went wrong!'
//         })
//     }
// })






// router.get('/api/primeteam/deleteprime', async (req,res)=>{
//     try{

//         let prime_team_list = await primeteam.find({}) 
//         for(let i=0;i<prime_team_list.length;i++)
//         {
//             let p = prime_team_list[i]
//             p.remove()
//         }


//         let prime_user_list = await primeuser.find({}) 
//         for(let i=0;i<prime_user_list.length;i++)
//         {
//             let p = prime_user_list[i]
//             p.remove()
//         }
        
//         let prime_plan_list = await primeplan.find({})
//         for(let i=0;i<prime_plan_list.length;i++)
//         {
//             let p = prime_plan_list[i]
//             p.remove()
//         }
//         res.status(200).json({
//             status:'success',
//             message:'accounts deleted!'
//         })
//     }
//     catch(e)
//     {
//         res.status(404).json({
//             status:'fail',
//             message:'Something went wrong!'
//         })
//     }
// })






module.exports = router 
