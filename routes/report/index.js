const express = require('express')

const team = require('./../../models/team')
const expert = require('./../../models/expert')
const prediction = require('./../../models/prediction')
const video = require('../../models/video')
const promotion = require('../../models/promotion')
const utildb = require('../../models/Utility')
const tempdb = require('../../models/tempdb')
// new dbs 
const series = require('../../models/series')
const pitch = require('../../models/pitch')
const sportteam = require('../../models/sportteam')
const matchreport = require('../../models/matchreport')

const router = express.Router() 
 
// report routes starts here

// series crud operations
router.post('/api/series/create', async (req,res)=>{
    try{
        let obj = {
            seriesName: req.body.seriesName,
            seriesYear: req.body.seriesYear,
            seriesMonth: req.body.seriesMonth,
            seriesCountry: req.body.seriesCountry,
            seriesGender: req.body.seriesGender,
            seriesType: req.body.seriesType,
            seriesFormat: req.body.seriesFormat
        }
        let tempObj  = await series.create(obj);
        if(tempObj){
            res.status(200).json({
                status: 'success',
                message: 'Series Data added successfully!'
            })
        }
        else{
            res.status(201).json({
                status: 'fail',
                message: 'Error while Storing Series Data!'
            })
        }
    }
    catch(e){
        res.status(200).json({
            status: 'fail',
            message: 'Something went wrong!'
        })
    }
})
router.get('/api/series/getlist', async (req,res)=>{
    try{
        let obj_list = await series.find({}).sort({createdAt: -1})
        res.status(200).json({
            status:'success',
            data: obj_list,
            message: 'series list fetched successfully!'
        })
    }
    catch(e){
        res.status(404).json({
            status:'fail',
            message:'Something went wrong!'
        })
    }
})
router.put('/api/series/edit/:id',async (req,res)=>{
    try{
        let req_obj = await series.findById(req.params.id);
        if(req_obj){
            req_obj.seriesName = req.body.seriesName;
            req_obj.seriesCountry = req.body.seriesCountry;
            req_obj.seriesYear = req.body.seriesYear;
            req_obj.seriesMonth = req.body.seriesMonth;
            req_obj.seriesGender = req.body.seriesGender;
            req_obj.seriesType = req.body.seriesType;
            req_obj.seriesFormat = req.body.seriesFormat;
            await req_obj.save();
            res.status(200).json({
                status: 'success',
                message: 'Series data updated successfully!'
            })
        }
        else{
            res.status(201).json({
                status:'fail',
                message:'Cannot find series with given id!'
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
router.delete('/api/series/delete/:id',async (req,res)=>{
    try{
        let req_obj = await series.findById(req.params.id);
        if(req_obj){
            await req_obj.remove();
            res.status(200).json({
                status: 'success',
                message:'Series data removed successfully!'
            })
        }
        else{
            res.status(201).json({
                status:'fail',
                message:'Cannot find series with given id!'
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
// series apis done  

// pitch apis start 
// pich crud operations
router.post('/api/pitch/create', async (req,res)=>{
    try{
        let obj = {
           pitchName: req.body.pitchName,
           pitchCity: req.body.pitchCity,
           pitchCountry: req.body.pitchCountry
        }
        let tempObj  = await pitch.create(obj);
        if(tempObj){
            res.status(200).json({
                status: 'success',
                message: 'Pitch Data added successfully!'
            })
        }
        else{
            res.status(201).json({
                status: 'fail',
                message: 'Error while Storing Series Data!'
            })
        }
    }
    catch(e){
        res.status(200).json({
            status: 'fail',
            message: 'Something went wrong!'
        })
    }
})
router.get('/api/pitch/getlist', async (req,res)=>{
    try{
        let obj_list = await pitch.find({}).sort({createdAt: -1})
        res.status(200).json({
            status:'success',
            data: obj_list,
            message: 'series list fetched successfully!'
        })
    }
    catch(e){
        res.status(404).json({
            status:'fail',
            message:'Something went wrong!'
        })
    }
})
router.put('/api/pitch/edit/:id',async (req,res)=>{
    try{
        let req_obj = await pitch.findById(req.params.id);
        if(req_obj){
            req_obj.pitchName = req_obj.pitchName;
            req_obj.pitchCity = req_obj.pitchCity;
            req_obj.pitchCountry = req_obj.pitchCountry;
            await req_obj.save();
            res.status(200).json({
                status: 'success',
                message: 'Pitch data updated successfully!'
            })
        }
        else{
            res.status(201).json({
                status:'fail',
                message:'Cannot find pitch with given id!'
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
router.delete('/api/pitch/delete/:id',async (req,res)=>{
    try{
        let req_obj = await pitch.findById(req.params.id);
        if(req_obj){
            await req_obj.remove();
            res.status(200).json({
                status: 'success',
                message:'pitch data removed successfully!'
            })
        }
        else{
            res.status(201).json({
                status:'fail',
                message:'Cannot find pitch with given id!'
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
// pitch apis done 

//sport team apis start 
// sport team crud operations 
router.post('/api/sportteam/create', async (req,res)=>{
    try{
        let obj = {
           sportTeamName: req.body.sportTeamName,
           sportTeamCode: req.body.sportTeamCode,
           sportTeamCountry: req.body.sportTeamCountry,
           sportTeamGender: req.body.sportTeamGender
        }
        let tempObj  = await sportteam.create(obj);
        if(tempObj){
            res.status(200).json({
                status: 'success',
                message: 'sportteam Data added successfully!'
            })
        }
        else{
            res.status(201).json({
                status: 'fail',
                message: 'Error while Storing sportteam Data!'
            })
        }
    }
    catch(e){
        res.status(200).json({
            status: 'fail',
            message: 'Something went wrong!'
        })
    }
})
router.get('/api/sportteam/getlist', async (req,res)=>{
    try{
        let obj_list = await sportteam.find({}).sort({createdAt: -1})
        res.status(200).json({
            status:'success',
            data: obj_list,
            message: 'sportteam list fetched successfully!'
        })
    }
    catch(e){
        res.status(404).json({
            status:'fail',
            message:'Something went wrong!'
        })
    }
})
router.put('/api/sportteam/edit/:id',async (req,res)=>{
    try{
        let req_obj = await sportteam.findById(req.params.id);
        if(req_obj){
            req_obj.sportTeamName = req_obj.sportTeamName;
            req_obj.sportTeamCode = req_obj.sportTeamCode;
            req_obj.sportTeamGender = req_obj.sportTeamGender;
            req_obj.sportTeamCountry = req_obj.sportTeamCountry
            await req_obj.save();
            res.status(200).json({
                status: 'success',
                message: 'sportteam data updated successfully!'
            })
        }
        else{
            res.status(201).json({
                status:'fail',
                message:'Cannot find sportteam with given id!'
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
router.delete('/api/sportteam/delete/:id',async (req,res)=>{
    try{
        let req_obj = await sportteam.findById(req.params.id);
        if(req_obj){
            await req_obj.remove();
            res.status(200).json({
                status: 'success',
                message:'sportteam data removed successfully!'
            })
        }
        else{
            res.status(201).json({
                status:'fail',
                message:'Cannot find sportteam with given id!'
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


//apis related to matchreport db 
// create match report
router.post('/api/matchreport/create', async (req,res)=>{
    try{
        let obj = {
            series: req.body.seriesId,
            pitch: req.body.pitchId,
            teamOne: req.body.teamOneId,
            teamTwo: req.body.teamTwoId,
            gender: req.body.gender,
            format: req.body.format,
            data: req.body.data,
            sportIndex: req.body.sportIndex
        }
        await matchreport.create(obj);
        res.status(200).json({
            status: 'success',
            message:'match report added successfully!'
        })
    }
    catch(e){
        res.status(404).json({
            status: 'fail',
            message: 'something went wrong!'
        })
    }
})
//fetch match report list 
router.get('/api/matchreport/matchlist', async (req,res)=>{
    try{
        let matchreport_list = await matchreport.find({}).sort({createdAt: -1}).limit(50);
        let req_list = [];
        for(let i=0;i<matchreport_list.length;i++){
            req_list.push({
                matchReportId: matchreport_list[i]._id,
                leftTeamName: matchreport_list[i].data.leftTeamName,
                leftTeamImage: matchreport_list[i].data.leftTeamImage,
                rightTeamName: matchreport_list[i].data.rightTeamName,
                rightTeamImage: matchreport_list[i].data.rightTeamImage,
                seriesName: matchreport_list[i].data.seriesName,
                matchMonth: matchreport_list[i].data.matchMonth,
                matchYear: matchreport_list[i].data.matchYear,
                gender: matchreport_list[i].gender,
                format: matchreport_list[i].format,
                matchTime: matchreport_list[i].data.matchTime
            })
        }
        res.status(200).json({
            status: 'success',
            data: req_list,
            message:'match report list is fetched successfully!'
        })
    }
    catch(e){
        res.status(404).json({
            status: 'fail',
            message: 'something went wrong!'
        })
    } 
})
// individual match report 
router.get('/api/matchreport/match/:matchReportId', async (req,res)=>{
    try{
        let matchreport_obj = await matchreport.findById(req.params.matchReportId)
        if(matchreport_obj){
            let req_data = matchreport_obj
            let seriesData = await series.findById(matchreport_obj.series)
            let pitchData = await pitch.findById(matchreport_obj.pitch)
            let teamOneData = await sportteam.findById(matchreport_obj.teamOne)
            let teamTwoData = await sportteam.findById(matchreport_obj.teamTwo)
            if(seriesData && pitchData && teamOneData && teamTwoData){
                req_data.series = seriesData;
                req_data.pitch = pitchData;
                req_data.teamOne = teamOneData;
                req_data.teamTwo = teamTwoData;
                res.status(200).json({
                    status: 'success',   
                    data: req_data,
                    message:'match report is fetched successfully!'
                })
            }else{
                res.status(201).json({
                    status: 'fail',
                    message:'error while fetching the match report!'
                })
            }
        }
        else{
            res.status(201).json({
                status: 'fail',
                message:'error while fetching the match report!'
            })
        }
    }
    catch(e){
        res.status(404).json({
            status: 'fail',
            message: 'something went wrong!'
        })
    } 
})



module.exports = router 