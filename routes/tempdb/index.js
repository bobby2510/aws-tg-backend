const express = require('express')
const user = require('./../../models/user')
const team = require('./../../models/team')
const expert = require('./../../models/expert')
const prediction = require('./../../models/prediction')
const video = require('../../models/video')
const promotion = require('../../models/promotion')
const utildb = require('../../models/Utility')
const tempdb = require('../../models/tempdb')
const rp = require('request-promise');
const $ = require('cheerio');


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

//perfect lineup hash post method
router.post('/api/automatic/create/hash',async (req,res)=>{
    try{
        let obj_list  = await utildb.find({})
        if(obj_list.length > 0){
            obj_list[0].perfectLineupHash = req.body.automaticHash
            await obj_list[0].save()
            res.status(200).json({
                status:'success',
                message:'Automatic Hash Updated Successfully!'
            })
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

//perfect lineup hash get method 
router.get('/api/automatic/get/hash', async (req,res)=>{
    try{
        let obj_list = await utildb.find({})
        if(obj_list.length>0){
            res.status(200).json({
                status:'success',
                automatic_hash: obj_list[0].perfectLineupHash,
                message:'Automatic Hash Fetched Successfully!'
            })
        }
        else{
            res.status(201).json({
                status:'fail',
                message:'Error while feting hash value!'
            })
        }
        
    }
    catch(e){
        res.status(404).json({
            status:'fail',
            message:"something went wrong!"
        })
    }
})




async function getDream11Hash(){
    const url = 'https://www.beatfantasy.com';
    rp(url)
  .then(async function(html) {
   let $html = $.load(html);
   let head = $html('head');
   let lastIndex = head.children().length - 1;
   let headChildren = head.children().get(lastIndex);
   let childAttribute = headChildren.attributes
    let reqLine =  childAttribute[0].value;
    if(reqLine.includes('_ssgManifest')){
        let sub_req_line = reqLine.split('static/')[1];
        let final_req_hash = sub_req_line.split('/')[0];
        let obj = await utildb.find({});
        obj[0].dream11Hash = final_req_hash;
        await obj[0].save();
       // console.log(final_req_hash)
    }
  })
  .catch(function(err) {
   // console.log(err)
    //console.log('error here!')
  });
}

module.exports = {router: router, getDream11Hash : getDream11Hash}