const express = require('express')
const user = require('./../../models/user')
const team = require('./../../models/team')
const expert = require('./../../models/expert')

const router = express.Router()

router.post('/api/expert/postteams',async (req,res)=>{
    try{
         // delete some teams if needed
    
         let temp = {
            matchId:req.body.matchId,
            numberOfTeams: req.body.numberOfTeams,
            typeOfTeams:req.body.typeOfTeams,
            fantasyApp:req.body.fantasyApp,
            tossData:req.body.tossData,
            teamUse:req.body.teamUse,
            teamData:req.body.teamData,
            sportIndex:req.body.sportIndex,
            sectionUsed:req.body.sectionUsed,
            expertNumber:req.body.expertNumber
        }
        let obj = await team.create(temp)
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

let getExpert = (data_list,expert_number)=>
{
    for(let i=0;i<data_list.length;i++)
    {
        if(data_list[i].phoneNumber.toString() === expert_number.toString())
        {
            return data_list[i];
        }
    }
    return null;
}

router.get('/api/expert/getteams/:id',async (req,res)=>{
    try{
        let req_data = await team.find({matchId:req.params.id}).sort({createdAt:-1})
        let expert_data = await  expert.find({})
       res.status(200).json({
        status:'success',
        data: req_data,
        expertData:expert_data,
        message:'expert teams fetched successfully!' 
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

router.get('/api/expert/teamlist',async (req,res)=>{
    try{
        let req_data = await team.find({}).sort({createdAt:-1}).limit(50)
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
                message:'Matchlist fetched successfully!'
            })
        }
        else 
        {
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



module.exports = router 