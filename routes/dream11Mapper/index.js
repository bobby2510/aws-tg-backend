const express = require('express')
const dream11Mapper = require('./../../models/dream11mapper')


const router = express.Router();

router.post('/api/mapper/create', async (req,res)=>{
    try{
        let tgMatchId = req.body.tgMatchId.toString();
        let dream11MatchId = req.body.dream11MatchId.toString();
        let obj = await dream11Mapper.find({tgMatchId: tgMatchId});
        if(obj.length>0){
            let req_obj = obj[0];
            req_obj.dream11MatchId =  dream11MatchId;
            await req_obj.save();
            res.status(200).json({
                status:'success',
                data:  { tgMatchId:tgMatchId, dream11MatchId: dream11MatchId },
                message:'Dream11 mapping data updated successfully!'
            })
        }
        else{
            let req_obj = await dream11Mapper.create({tgMatchId:tgMatchId,dream11MatchId:dream11MatchId})
            res.status(200).json({
                status:'success',
                data: { tgMatchId:tgMatchId, dream11MatchId: dream11MatchId },
                message:'Dream11 mapping data created successfully!'
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
router.get('/api/mapper/getdata/:tgMatchId', async (req,res)=>{
    try{
        let tgMatchId = req.params.tgMatchId.toString();
        let obj = await dream11Mapper.find({tgMatchId: tgMatchId});
        if(obj.length>0){
            res.status(200).json({
                status:'success',
                data: {dream11MatchId:obj[0].dream11MatchId,tgMatchId:obj[0].tgMatchId,mapperExist: true},
                message:'Match Mapper Data Fetched Successfully!'
            })
        }
        else{
            res.status(200).json({
                status:'success',
                data:{mapperExist: false},
                message: 'Match Mapper Data Fetched Successfully!'
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

module.exports = router;