const express = require('express')
const user = require('./../../models/user')
const team = require('./../../models/team')
const expert = require('./../../models/expert')
const prediction = require('./../../models/prediction')
const video = require('../../models/video')
const promotion = require('../../models/promotion')
const utildb = require('../../models/Utility')


const router = express.Router()


//promotion routes start here 
// post for creatng the promotion
router.post('/api/promotion/create',async (req,res)=>{
    try{
        let temp = {
            label: req.body.label,
            imageUrl: req.body.imageUrl,
            notificationUrl:req.body.notificationUrl,
            urlType: req.body.urlType,
            order: req.body.order,
            active: req.body.active
        }
        let obj = await promotion.create(temp);
        if(obj){
            res.status(200).json({
                status:'success',
                message:'Promotion added successfully!'
            })
        }
        else{
            res.status(201).json({
                status:'fail',
                message:'error while adding the promotion!'
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
//update promotion
router.put('/api/promotion/edit/:id',async (req,res)=>{
    try{
        let promotion_obj = await promotion.findById(req.params.id);
        if(promotion_obj){
            promotion_obj.label = req.body.label,
            promotion_obj.imageUrl = req.body.imageUrl,
            promotion_obj.notificationUrl = req.body.notificationUrl,
            promotion_obj.urlType = req.body.urlType,
            promotion_obj.order = req.body.order,
            promotion_obj.active = req.body.active 

            await promotion_obj.save();
            res.status(200).json({
                status: 'success',
                message: 'promotion updated successfully!'
            })
        }
        else{
            res.status(201).json({
                status: 'fail',
                message: 'error while updating the promotion!'
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
//delete promotion
router.delete('/api/promotion/delete/:id', async (req,res)=>{
    try{
        let promotion_obj = await promotion.findById(req.params.id);
        if(promotion_obj){
            await promotion_obj.remove();
            res.status(200).json({
                status:'success',
                message:'Promotion deleted successfully!'
            })
        }
        else{
            res.status(201).json({
                status:'fail',
                message:'error while deleting!'
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
//get details by id 
router.get('/api/promotion/get/:id', async (req,res)=>{
    try{
        let obj = await promotion.findById(req.params.id)
        if(obj){
            res.status(200).json({
                status: 'success',
                data: obj,
                message: 'promotion details fetched successfully!'
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
        res.status(404).json({
            status:'fail',
            message:'Something Went Wrong!'
        })
    }
})
//get details list 
router.get('/api/promotion/getlist',async (req,res)=>{
    try{
        let util_obj = await utildb.find({})[0];
        let p_obj_list = await promotion.find({}).sort({order: 1})
        if(util_obj && p_obj_list){
            res.status(200).json({
                status: 'success',
                promotionActive: util_obj.notificationActive,
                data: p_obj_list,
                message: 'promotion list fetched successfully!'
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
//updating the utildb 
router.put('/api/utildb/promotion', async (req,res)=>{
    try{
        let obj = await utildb.find({})[0];
        obj.notificationActive = req.body.notificationActive;
        await obj.save();
        res.status(200).json({
            status:'success',
            message:'promotion panel updated successfully!'
        })
    }
    catch(e){
        res.status(404).json({
            status:'fail',
            message:'Something Went Wrong!'
        })
    }
})

module.exports = router 