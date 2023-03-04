const express = require('express')
const user = require('./../../models/user')
const team = require('./../../models/team')
const expert = require('./../../models/expert')
const prediction = require('./../../models/prediction')
const video = require('../../models/video')
const promotion = require('../../models/promotion')
const utildb = require('../../models/Utility')
const tempdb = require('../../models/tempdb')


const router = express.Router()


//promotion routes start here 
// post for creatng the promotion
router.post('/api/tempdb/create',async (req,res)=>{
    try{
        let temp = {
            matchList: req.body.matchList,
            matchDataList: req.body.matchDataList,
        }
        let obj_list = await tempdb.find({});
        if(obj_list.length === 0){
            let obj = await tempdb.create(temp);
            if(obj){
                res.status(200).json({
                    status:'success',
                    message:'Fantasy data added successfully!'
                })
            }
            else{
                res.status(201).json({
                    status:'fail',
                    message:'error while adding the promotion!'
                })
            }
        }
        else{
            let dp = obj_list[0];
            dp.matchList = temp.matchList;
            dp.matchDataList = temp.matchDataList;
            await dp.save();
            res.status(200).json({
                status:'success',
                message:'Fantasy data added successfully!'
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

//get details by id 
router.get('/api/tempdb/matches', async (req,res)=>{
    try{
        let req_data= [[],[],[],[]]
        let obj_list  = await tempdb.find({})
        if(obj_list.length> 0){
            let tm = obj_list[0].matchList.filter(d =>{
                let mt = new Date(d.match_time);
                let pt = new Date(Date.now());
                if(mt>pt) return true;
                else return false;
            })
            for(let i=0;i<tm.length;i++)
                req_data[0].push(tm[i]);
            
            req_data.forEach((sport_array)=>{
                sport_array.sort((x,y)=>{
                    let first = new Date(x.match_time)
                    let second = new Date(y.match_time)
                    if(first<second)
                    return -1
                    else 
                    return 1 
                })
            })
            res.status(200).json({
                status: 'success',
                data: req_data,
            })
        }
        else{
            res.status(201).json({
                status: 'fail',
                message: 'error while fetching details'

            })
        }
    }
    catch(e){
        //console.log(e)
        res.status(404).json({
            status:'fail',
            message:'Something Went Wrong!'
        })
    }
})
//get details list 
router.get('/api/tempdb/match/:id',async (req,res)=>{
    try{
        let obj_list  = await tempdb.find({})
        if(obj_list.length > 0){
            let match_list = obj_list[0].matchDataList 
            let req_match = null;
            for(let i=0;i<match_list.length;i++){
                if(match_list[i].match_id.toString() === req.params.id){
                    req_match = match_list[i];
                }
            }
            if(req_match){
                res.status(200).json({
                    status: 'success',
                    data: req_match
                })
            }else{
                res.status(201).json({
                    status: 'fail',
                    message:'error while fetching the data!'
                })
            }
        }
        else{
            res.status(201).json({
                status: 'fail',
                message:'error while fetching the data!'
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

module.exports = router 