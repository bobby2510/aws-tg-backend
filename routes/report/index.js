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
// match report overview 
// helper functions 
let calc_avg = (value,value_count)=>{
    let result = parseFloat(value)/parseInt(value_count);
    return result.toFixed(2);
}
// main stuff
router.get('/api/matchreport/overview', async (req,res)=>{
    try{
        let reportList = await matchreport.find({});
        if(reportList.length>0){
            let req_data = {};
            req_data["total_matches"] = reportList.length;
            let toss_result_type = ["batting","bowling"];
            let captain_role_count = [0,0,0,0];
            let vicecaptain_role_count = [0,0,0,0];
            let toss_result_count = [0,0];
            let toss_won_match_won = 0;
            let toss_won_match_lose = 0;
            let bat_first_match_won = 0;
            let bat_second_match_won = 0;
            let captain_from_winning_team_count = 0;
            let captain_from_losing_team_count = 0;
            let vicecaptain_from_winning_team_count = 0;
            let vicecaptain_from_losing_team_count = 0;
            let sum_of_dream_team_points = 0;
            let sum_of_wk_dt_points = 0;
            let sum_of_bat_dt_points = 0;
            let sum_of_al_dt_points = 0;
            let sum_of_bowl_dt_points = 0;
            let sum_of_first_innings_score = 0;
            let sum_of_second_innings_score = 0;
            let sum_of_first_innings_wickets = 0;
            let sum_of_second_innings_wickets = 0;
            let total_reports = reportList.length;
            // credit range stuff here 
            let sum_of_left_range = 0;
            let sum_of_right_range = 0;
            let sum_of_dt_credit = 0;
            let count_within_the_range = 0;
            let ps_map = new Map();
            let comb_map = new Map();
            let combination_data = [];
            let partision_data = [];
            let percentage_pattern_data = [];
            let pattern1 = {
                label: "0-30%, 30-70%, 70-100%",
                data: []
            }
            let p1 = new Map();
            let pattern2 = {
                label: "0-20%, 20-40%, 40-60%, 60-80%, 80-100%",
                data:[]
            }
            let p2 = new Map();
            let pattern3 = {
                label: "0-25%, 25-50%, 50-75%, 75-100%",
                data: []
            }
            let p3 = new Map();
            let pattern4 = {
                label: "0-50%, 50-100%",
                data: []
            }
            let p4 = new Map();
            let pattern5 = {
                label: "0-40%, 40-70%, 70-100%",
                data: []
            }
            let p5 = new Map();


            for(let i=0;i<reportList.length;i++){
                toss_result_count[toss_result_type.indexOf(reportList[i].data.tossResult)]++;
                if(reportList[i].data.matchWon === reportList[i].data.tossWon)
                    toss_won_match_won++;
                if(reportList[i].data.teamBatFirst === reportList[i].data.matchWon)
                    bat_first_match_won++;
                // captain from which team 
                if(reportList[i].data.dream_team_captain_team === reportList[i].data.matchWon)
                    captain_from_winning_team_count++;
                //vicecaptain from which team 
                if(reportList[i].data.dream_team_vicecaptain_team === reportList[i].data.matchWon)
                    vicecaptain_from_winning_team_count++;
                captain_role_count[reportList[i].data.dream_team_captain_role]++;
                vicecaptain_role_count[reportList[i].data.dream_team_vicecaptain_role]++;
                //sum of dt points here
                sum_of_dream_team_points = sum_of_dream_team_points + reportList[i].data.dreamTeamData.points;
                sum_of_wk_dt_points = sum_of_wk_dt_points + reportList[i].data.points_by_section[0];
                sum_of_bat_dt_points = sum_of_bat_dt_points + reportList[i].data.points_by_section[1];
                sum_of_al_dt_points = sum_of_al_dt_points + reportList[i].data.points_by_section[2];
                sum_of_bowl_dt_points = sum_of_bowl_dt_points + reportList[i].data.points_by_section[3];
                //credits here 
                let left = reportList[i].data.tg_software_credit_range.left;
                let right =reportList[i].data.tg_software_credit_range.right;
                let dt_credits = reportList[i].data.dream_team_credits;
                sum_of_left_range = sum_of_left_range + left;
                sum_of_right_range = sum_of_right_range + right;
                sum_of_dt_credit = sum_of_dt_credit + dt_credits;
                if(dt_credits>=left && dt_credits <= right)
                    count_within_the_range++;
                //sum of scores
                let first_stuff = reportList[i].data.firstInningsText.split("-");
                let first_score = parseInt(first_stuff[0]);
                let first_wickets = parseInt(first_stuff[1].split(" ")[0]);
                let second_stuff = reportList[i].data.secondInningsText.split("-");
                let second_score = parseInt(second_stuff[0]);
                let second_wickets = parseInt(second_stuff[1].split(" ")[0]);
                sum_of_first_innings_score = sum_of_first_innings_score + first_score;
                sum_of_first_innings_wickets = sum_of_first_innings_wickets + first_wickets;
                sum_of_second_innings_score = sum_of_second_innings_score + second_score;
                sum_of_second_innings_wickets = sum_of_second_innings_wickets + second_wickets;
                //partision stuff here 
                let lose_team_index = reportList[i].data.matchWon === 0? 1: 0;
                let win_team_index = reportList[i].data.matchWon;
                let ps_text = `${reportList[i].data.dream_team_paritision[win_team_index]}:${reportList[i].data.dream_team_paritision[lose_team_index]}`;
                let temp = ps_map.get(ps_text)
                if(temp){
                    ps_map.set(ps_text,temp+1);
                }
                else{
                    ps_map.set(ps_text,1);
                }
                // team combination
                let temp_comb = reportList[i].data.dream_team_combination;
                let c_text = `${temp_comb[0]}-${temp_comb[1]}-${temp_comb[2]}-${temp_comb[3]}`;
                let dp = comb_map.get(c_text);
                if(dp){
                    comb_map.set(c_text,dp+1);
                }
                else{
                    comb_map.set(c_text,1);
                }
                // pattern - 1
                let data_p1 = reportList[i].data.selection_percentage_patterns.pattern1;
                let p1_text = "";
                for(let i=0;i<data_p1.length-1;i++){
                    p1_text = p1_text  + data_p1[i].dtCount + "-";
                }
                p1_text = p1_text + data_p1[data_p1.length-1].dtCount;
                let pp1 = p1.get(p1_text);
                if(pp1){
                    p1.set(p1_text,pp1+1);
                }
                else{
                    p1.set(p1_text,1);
                }
                 // pattern - 2
                 let data_p2 = reportList[i].data.selection_percentage_patterns.pattern2;
                 let p2_text = "";
                 for(let i=0;i<data_p2.length-1;i++){
                     p2_text = p2_text  + data_p2[i].dtCount + "-";
                 }
                 p2_text = p2_text + data_p2[data_p2.length-1].dtCount;
                 let pp2 = p2.get(p2_text);
                 if(pp2){
                     p2.set(p2_text,pp2+1);
                 }
                 else{
                     p2.set(p2_text,1);
                 }
                 //pattern 3 
                 let data_p3 = reportList[i].data.selection_percentage_patterns.pattern3;
                 let p3_text = "";
                 for(let i=0;i<data_p3.length-1;i++){
                     p3_text = p3_text  + data_p3[i].dtCount + "-";
                 }
                 p3_text = p3_text + data_p3[data_p3.length-1].dtCount;
                 let pp3 = p3.get(p3_text);
                 if(pp3){
                     p3.set(p3_text,pp3+1);
                 }
                 else{
                     p3.set(p3_text,1);
                 }
                  //pattern 4 
                  let data_p4 = reportList[i].data.selection_percentage_patterns.pattern4;
                  let p4_text = "";
                  for(let i=0;i<data_p4.length-1;i++){
                      p4_text = p4_text  + data_p4[i].dtCount + "-";
                  }
                  p4_text = p4_text + data_p4[data_p4.length-1].dtCount;
                  let pp4 = p4.get(p4_text);
                  if(pp4){
                      p4.set(p4_text,pp4+1);
                  }
                  else{
                      p4.set(p4_text,1);
                  }
                    //pattern 5 
                    let data_p5 = reportList[i].data.selection_percentage_patterns.pattern5;
                    let p5_text = "";
                    for(let i=0;i<data_p5.length-1;i++){
                        p5_text = p5_text  + data_p5[i].dtCount + "-";
                    }
                    p5_text = p5_text + data_p5[data_p5.length-1].dtCount;
                    let pp5 = p5.get(p5_text);
                    if(pp5){
                        p5.set(p5_text,pp5+1);
                    }
                    else{
                        p5.set(p5_text,1);
                    }

            }

            let avg_total_points = calc_avg(sum_of_dream_team_points,total_reports);
            let avg_wk_points = calc_avg(sum_of_wk_dt_points,total_reports);
            let avg_bat_points = calc_avg(sum_of_bat_dt_points,total_reports);
            let avg_al_points = calc_avg(sum_of_al_dt_points,total_reports);
            let avg_bowl_points = calc_avg(sum_of_bowl_dt_points,total_reports);
            let avg_left_range = calc_avg(sum_of_left_range,total_reports);
            let avg_right_range = calc_avg(sum_of_right_range,total_reports);
            let avg_dt_credits = calc_avg(sum_of_dt_credit,total_reports);
            let avg_first_innings_score = parseInt(calc_avg(sum_of_first_innings_score,total_reports));
            let avg_first_innings_wickets = parseInt(calc_avg(sum_of_first_innings_wickets,total_reports));
            let avg_second_innings_score = parseInt(calc_avg(sum_of_second_innings_score,total_reports));
            let avg_second_innings_wickets = parseInt(calc_avg(sum_of_second_innings_wickets,total_reports));
          
            //partisiion
            let ps_keys = Array.from(ps_map.keys())
            let ps_values = Array.from(ps_map.values());
            for(let i=0;i<ps_keys.length;i++){
                partision_data.push({
                    pattern: ps_keys[i],
                    value: ps_values[i]
                })
            }
            partision_data.sort((x,y)=>{
                if(x.value<y.value) return 1;
                else return -1;
            })
            //combination
            let c_keys = Array.from(comb_map.keys())
            let c_values = Array.from(comb_map.values());
            for(let i=0;i<c_keys.length;i++){
                combination_data.push({
                    pattern: c_keys[i],
                    value: c_values[i]
                })
            }
            combination_data.sort((x,y)=>{
                if(x.value<y.value) return 1;
                else return -1;
            })
            //pattern1
            let p1_keys = Array.from(p1.keys());
            let p1_values = Array.from(p1.values());
            for(let i=0;i<p1_keys.length;i++){
                pattern1.data.push({
                    pattern: p1_keys[i],
                    value: p1_values[i]
                })
            }
            pattern1.data.sort((x,y)=>{
                if(x.value<y.value) return 1;
                else return -1;
            })
            //pattern2 
            let p2_keys = Array.from(p2.keys());
            let p2_values = Array.from(p2.values());
            for(let i=0;i<p2_keys.length;i++){
                pattern2.data.push({
                    pattern: p2_keys[i],
                    value: p2_values[i]
                })
            }
            pattern2.data.sort((x,y)=>{
                if(x.value<y.value) return 1;
                else return -1;
            })
             //pattern3 
             let p3_keys = Array.from(p3.keys());
             let p3_values = Array.from(p3.values());
             for(let i=0;i<p3_keys.length;i++){
                 pattern3.data.push({
                     pattern: p3_keys[i],
                     value: p3_values[i]
                 })
             }
             pattern3.data.sort((x,y)=>{
                 if(x.value<y.value) return 1;
                 else return -1;
             })
              //pattern4 
              let p4_keys = Array.from(p4.keys());
              let p4_values = Array.from(p4.values());
              for(let i=0;i<p4_keys.length;i++){
                  pattern4.data.push({
                      pattern: p4_keys[i],
                      value: p4_values[i]
                  })
              }
              pattern4.data.sort((x,y)=>{
                  if(x.value<y.value) return 1;
                  else return -1;
              })
               //pattern5 
               let p5_keys = Array.from(p5.keys());
               let p5_values = Array.from(p5.values());
               for(let i=0;i<p5_keys.length;i++){
                   pattern5.data.push({
                       pattern: p5_keys[i],
                       value: p5_values[i]
                   })
               }
               pattern5.data.sort((x,y)=>{
                   if(x.value<y.value) return 1;
                   else return -1;
               })

            percentage_pattern_data = [pattern1,pattern2,pattern3,pattern4,pattern5];
            

            toss_won_match_lose = reportList.length - toss_won_match_won;
            bat_second_match_won = reportList.length - bat_first_match_won;
            captain_from_losing_team_count = reportList.length - captain_from_winning_team_count;
            vicecaptain_from_losing_team_count = reportList.length - vicecaptain_from_winning_team_count;
            req_data["toss_won_match_won"] = toss_won_match_won;
            req_data["toss_won_match_lose"] = toss_won_match_lose;
            req_data["bat_first_match_won"] = bat_first_match_won;
            req_data["bat_second_match_won"] = bat_second_match_won;
            req_data["captain_from_winning_team_count"] = captain_from_winning_team_count;
            req_data["captain_from_losing_team_count"] = captain_from_losing_team_count;
            req_data["vicecaptain_from_winning_team_count"] = vicecaptain_from_winning_team_count;
            req_data["vicecaptain_from_losing_team_count"] = vicecaptain_from_losing_team_count;
            req_data["avg_total_points"] = avg_total_points;
            req_data["avg_wk_points"] = avg_wk_points;
            req_data["avg_bat_points"] = avg_bat_points;
            req_data["avg_al_points"] = avg_al_points;
            req_data["avg_bowl_points"] = avg_bowl_points;
            req_data["avg_left_range"] = avg_left_range;
            req_data["avg_right_range"] = avg_right_range;
            req_data["avg_dt_credits"] = avg_dt_credits;
            req_data["avg_first_innings_score"] = avg_first_innings_score;
            req_data["avg_first_innings_wickets"] = avg_first_innings_wickets;
            req_data["avg_second_innings_score"] = avg_second_innings_score;
            req_data["avg_second_innings_wickets"] = avg_second_innings_wickets;
            req_data["partision_data"] = partision_data;
            req_data["combination_data"] = combination_data;
            req_data["percentage_pattern_data"] = percentage_pattern_data;
            req_data["captain_role_count"] = captain_role_count;
            req_data["vicecaptain_role_count"] = vicecaptain_role_count;
            req_data["count_within_the_range"] = count_within_the_range;
            
            res.status(200).json({
                status: 'success',   
                data: req_data,
                message:'match report overview is fetched successfully!'
            })
        }
        else{
            res.status(201).json({
                status:'fail',
                message:'Insufficient Data!'
            })
        }
    }
    catch(e){
        console.log(e)
        res.status(404).json({
            status: 'fail',
            message: 'something went wrong!'
        })
    }
})





module.exports = router 