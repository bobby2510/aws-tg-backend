const express = require('express')
const user = require('./../../models/user')
const team = require('./../../models/team')
const expert = require('./../../models/expert')
const prediction = require('./../../models/prediction')
const video = require('../../models/video')

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
        let prediction_req_data = await prediction.find({}).sort({createdAt: -1}).limit(50)
        let video_req_data = await video.find({}).sort({createdAt: -1}).limit(50)
        let match_id_list = []
        let prediction_id_list = []
        let video_id_list = []
        for(let i=0;i<req_data.length;i++)
        {
            let vp = req_data[i] 
            if(match_id_list.indexOf(vp.matchId) === -1)
                match_id_list.push(vp.matchId)
        }
        // prediction
        for(let i=0;i<prediction_req_data.length;i++)
        {
            let vp = prediction_req_data[i] 
            if(prediction_id_list.indexOf(vp.matchId) === -1)
                prediction_id_list.push(vp.matchId)
        }
        //video 
        for(let i=0;i<video_req_data.length;i++)
        {
            let vp = video_req_data[i]
            if(video_id_list.indexOf(vp.matchId) === -1)
                video_id_list.push(vp.matchId)
        }

        res.status(200).json({
            status:'success',
            expertTeamData:match_id_list,
            expertPredictionData: prediction_id_list,
            expertVideoData: video_id_list,
            message:'Matchlist for expert teams and prediction fetched successfully!'
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

//export video 
router.post('/api/expert/postvideo',async (req,res)=>{
    try{
        let temp = {
            matchId: req.body.matchId,
            seriesName: req.body.seriesName,
            leftName: req.body.leftName,
            leftImage: req.body.leftImage,
            rightName: req.body.rightName,
            rightImage: req.body.rightImage,
            videoLink: req.body.videoLink,
            videoLanguage: Number(req.body.videoLanguage)
        }
        //console.log(temp)
        let obj = await video.create(temp)
        if(obj!== null)
        {
            res.status(200).json({
                status:'success',
                message:'Video Posted Successfully!' 
            })
        }
        else{
            res.status(201).json({
                status:'failed',
                message:'Error while saving video!' 
            })
        }
    }
    catch(e)
    {
        console.log(e)
        res.status(404).json({
            status:'fail',
            messsage:'Something Went Wrong!'
        })
    }
})

router.get('/api/expert/list/getvideo/:id',async (req,res)=>{
    try{
        let req_data = await video.find({matchId:req.params.id}).sort({createdAt:-1})
       res.status(200).json({
        status:'success',
        data: req_data,
        message:'expert video data fetched successfully!' 
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


// expert prediction

router.post('/api/expert/postprediction',async (req,res)=>{
    try{
         let temp = {
            matchId:req.body.matchId,
            predictionData:req.body.predictionData,
            sportIndex:req.body.sportIndex,
            expertNumber:req.body.expertNumber
        }
        let obj = await prediction.create(temp)
        if(obj!==null)
        {
            res.status(200).json({
                status:'success',
                message:'Prediction Posted Successfully!' 
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

router.get('/api/expert/list/getprediction/:id',async (req,res)=>{
    try{
        let req_data = await prediction.find({matchId:req.params.id}).sort({createdAt:-1})
        let expert_data = await  expert.find({})
       res.status(200).json({
        status:'success',
        data: req_data,
        predictionData:expert_data,
        message:'expert prediction fetched successfully!' 
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

router.get('/api/expert/specific/getprediction/:id', async (req,res)=>{
    try{
        let req_data = await prediction.findById(req.params.id)
        let expert_data = await  expert.find({})
        if(req_data !== null)
        {
            //first increase the view 
            req_data.numberOfViews = req_data.numberOfViews + 1;
            console.log(req_data)
            await req_data.save()
            res.status(200).json({
                status:'success',
                data: req_data,
                expertData: expert_data,
                message: 'Prediction data fetched successfully!'
            })
        }
        else 
        {
            res.status(201).json({
                status: 'fail',
                message:'No prediction for the given id!'
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