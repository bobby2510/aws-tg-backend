const express = require('express')
const dream11Mapper = require('./../../models/dream11mapper')


const router = express.Router();

router.post('/api/mapper/create', async (req,res)=>{
    try{
        let tgMatchId = req.body.tgMatchId.toString();
        let dream11MatchId = req.body.dream11MatchId.toString();
        let leftName = req.body.leftName;
        let rightName  = req.body.rightName;
        let obj = await dream11Mapper.find({tgMatchId: tgMatchId});
        if(obj.length>0){
            let req_obj = obj[0];
            req_obj.dream11MatchId =  dream11MatchId;
            req_obj.leftName = leftName;
            req_obj.rightName = rightName;
            await req_obj.save();
            res.status(200).json({
                status:'success',
                data:  { tgMatchId:tgMatchId, dream11MatchId: dream11MatchId, leftName: leftName,rightName: rightName },
                message:'Dream11 mapping data updated successfully!'
            })
        }
        else{
            let req_obj = await dream11Mapper.create({tgMatchId:tgMatchId,dream11MatchId:dream11MatchId,leftName:leftName,rightName: rightName})
            res.status(200).json({
                status:'success',
                data: { tgMatchId:tgMatchId, dream11MatchId: dream11MatchId ,leftName: leftName,rightName: rightName},
                message:'Dream11 mapping data created successfully!'
            })
        }
    }
    catch(e){
        console.log(e)
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
                data: {dream11MatchId:obj[0].dream11MatchId,tgMatchId:obj[0].tgMatchId,mapperExist: true ,leftName: obj[0].leftName,rigtName:obj[0].rightName},
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