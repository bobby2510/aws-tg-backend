const express = require('express')
const automaticMapper = require('./../../models/automaticmapper')
const utildb = require('./../../models/Utility')
const automaticdb = require('./../../models/automaticmapper')
const loadbalancedb = require('./../../models/loadbalancemapper')
const axios = require('axios')
var CryptoJS = require("crypto-js");


const router = express.Router();

let vp_array=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
//static stuff 
let mainLoadBalance = []
let mainLoadMatchId = []
//second
let secondLoadBalance = []
let secondLoadMatchId = []

let create_load = (matchId)=>{
    mainLoadBalance.push({ matchId: matchId, loadArray:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],createdAt: Date.now()})
    secondLoadBalance.push({ matchId: matchId, loadArray:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],createdAt: Date.now()})
    mainLoadMatchId.push(matchId)
    secondLoadMatchId.push(matchId)
}

let getActualDate = (date_value)=>{
    let first = date_value.split(" ")[0];
    let second = date_value.split(" ")[1];
    let year = parseInt(first.split("-")[0]);
    let month = parseInt(first.split("-")[1])-1;
    let day = parseInt(first.split("-")[2]);
    let hours = parseInt(second.split(":")[0]);
    let minutes = parseInt(second.split(":")[1]);
    var mydate = new Date();
    mydate.setFullYear(year);
    mydate.setMonth(month);
    mydate.setDate(day);
    mydate.setHours(hours);
    mydate.setMinutes(minutes);
    mydate = new Date(mydate.getTime()+19800000);
    return mydate.toString();  
}

//not used
router.post('/api/automaticmapper/create', async (req,res)=>{
    try{
        let tgMatchId = req.body.tgMatchId.toString();
        let beatfantasyMatchId = req.body.blMatchId.toString();
        let perfectlineupMatchId = req.body.plMatchId.toString();
        let playerMapperData = req.body.playerMapperData;
        let obj = await automaticMapper.find({tgMatchId: tgMatchId});
        if(obj.length>0){
            let req_obj = obj[0];
            req_obj.beatfantasyMatchId =  beatfantasyMatchId;
            req_obj.perfectlineupMatchId = perfectlineupMatchId;
            req_obj.playerMapperData = playerMapperData
            await req_obj.save();
            res.status(200).json({
                status:'success',
                data:  { tgMatchId:tgMatchId},
                message:'Automatic mapping data updated successfully!'
            })
        }
        else{
            let req_obj = await automaticMapper.create({tgMatchId:tgMatchId,beatfantasyMatchId:beatfantasyMatchId,perfectlineupMatchId:perfectlineupMatchId, playerMapperData: playerMapperData})
            
            //updating the older load objects
            //delete older ones 
            mainLoadBalance = mainLoadBalance.filter(d =>{
                let left = new Date(d.createdAt)
                let right = new Date(Date.now())
                let hours = (right-left)/3600000;
                if(hours<24) return true;
                else return false;
            })
            secondLoadBalance = secondLoadBalance.filter(d =>{
                let left = new Date(d.createdAt)
                let right = new Date(Date.now())
                let hours = (right-left)/3600000;
                if(hours<24) return true;
                else return false;
            })
            mainLoadMatchId = mainLoadBalance.map(d=> d.matchId)
            secondLoadMatchId = secondLoadBalance.map(d=> d.matchId)
            //create new if needed
            if(!mainLoadMatchId.includes(tgMatchId)){
                create_load(tgMatchId)
            }
            res.status(200).json({
                status:'success',
                data: { tgMatchId:tgMatchId},
                message:'Automatic mapping data created successfully!'
            })
        }
    }
    catch(e){
     //   console.log(e)
        res.status(404).json({
            status:'fail',
            message:'Something Went Wrong!'
        })
    }
})

// api to get beatfantasy activated match ids 
//https://www.beatfantasy.com/_next/data/Eo4PS8G5LzZ5PJPigwocZ/experts/activate-matches/cricket.json?sport=cricket
router.get('/api/automatic/first_stage/list',async (req,res)=>{
    try{
       let obj = await utildb.find({})
       
       if(obj.length>0 && obj[0].dream11Hash){
        let first_part = 'https://www.beatfantasy.com/_next/data/'
        let second_part = '/experts/activate-matches/cricket.json?sport=cricket'
        let req_url = `${first_part}${obj[0].dream11Hash}${second_part}`
        let response = await axios.get(req_url, {
            headers: {
              Cookie: 'userData=%7B%22mobile%22%3A%229848579715%22%7D'
            }
           })
       // console.log(response)
        let req_list = response.data.pageProps.matchDetailsAPIResponse;
        let req_data = []
      //  console.log(req_list)
        req_list.forEach(match=>{
            req_data.push({
                id:match.match_id,
                left_team_name:match.home_team_name_short,
                right_team_name:match.away_team_name_short,
                left_team_image:match.home_team_logo,
                right_team_image:match.away_team_logo,
                series_name: match.league_name,
                match_time: getActualDate(match.fixture_date),
                lineup_out:0
            })
        })
      //  console.log(req_data)
         //sorting the matches based on the time
            req_data.sort((x,y)=>{
                let first = new Date(x.match_time)
                let second = new Date(y.match_time)
                if(first<second)
                return -1
                else 
                return 1 
            })
            req_data = req_data.filter(x =>{
                let present_time = new Date(Date.now());
                let match_time = new Date(x.match_time);
                //console.log(match_time.toString(),present_time.toString())
                if(match_time>present_time) return true;
                else return false;
            })
            let password = "coder_bobby_believer01_tg_software";
            // let stuff_data = [];
            // //do encryption here 
            // for(let i=0;i<req_data.length;i++){
            //     let vp = JSON.stringify(req_data[i]);
            //     let hashed_value = CryptoJS.AES.encrypt(vp,password).toString();
            //     stuff_data.push(hashed_value);
            // }
            let stuff_data = CryptoJS.AES.encrypt(JSON.stringify(req_data),password).toString();
            res.status(200).json({
                status:'success',
                data: stuff_data
            })
        }
        else{
            res.status(201).json({
                status: 'fail',
                message:'Something went wrong!'
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
// api to get perfectlineup match ids    
router.get('/api/automatic/second_stage/list',async (req,res)=>{
    try{
       
        let first_part = 'https://www.beatfantasy.com/_next/data/'
        let second_part = '/experts/activate-matches/cricket.json?sport=cricket'
        let req_url = `https://plineup-prod.s3.ap-south-1.amazonaws.com/appstatic/plprod_lobby_fixture_list_7.json`
        let response = await axios.get(req_url)
       // console.log(response)
        let req_list = response.data;
        let req_data = []
      //  console.log(req_list)
        req_list.forEach(match=>{
            req_data.push({
                id:match.season_game_uid,      
                left_team_name:match.home,
                right_team_name:match.away,
                left_team_image:`https://plineup-prod.s3.ap-south-1.amazonaws.com/upload/flag/${match.home_flag}`,
                right_team_image:`https://plineup-prod.s3.ap-south-1.amazonaws.com/upload/flag/${match.away_flag}`,
                series_name: match.league_name,
                match_time: getActualDate(match.season_scheduled_date),
                league_id: match.league_id,
                lineup_out:0
            })
        })
      //  console.log(req_data)
         //sorting the matches based on the time
            req_data.sort((x,y)=>{
                let first = new Date(x.match_time)
                let second = new Date(y.match_time)
                if(first<second)
                return -1
                else 
                return 1 
            })
            req_data = req_data.filter(x =>{
                let present_time = new Date(Date.now());
                let match_time = new Date(x.match_time);
                //console.log(match_time.toString(),present_time.toString())
                if(match_time>present_time) return true;
                else return false;
            })
            let password = "coder_bobby_believer01_tg_software";
            // let stuff_data = [];
            // //do encryption here 
            // for(let i=0;i<req_data.length;i++){
            //     let vp = JSON.stringify(req_data[i]);
            //     let hashed_value = CryptoJS.AES.encrypt(vp,password).toString();
            //     stuff_data.push(hashed_value);
            // }
            let stuff_data = CryptoJS.AES.encrypt(JSON.stringify(req_data),password).toString();
            res.status(200).json({
                status:'success',
                data: stuff_data
            })
    }
    catch(e){
        res.status(404).json({
            status:'fail',
            message:'Something went wrong!'
        })
    }
})
// api to get perfectlineup player data 
router.get('/api/automatic/second_stage/getdata/:id', async (req,res)=>{
    try{
        let match_id = req.params.id.toString();
        let sport_id = "7"
        let website_id = 1;
        let obj = {
            season_game_uid: match_id,
            sports_id: sport_id,
            website_id: website_id
        }
        let url = `https://plapi.perfectlineup.in/fantasy/stats/get_fixture_players`
        let response = await axios.post(url,obj);
        let req_data = response.data.data
        let team_name = [req_data.fixture_info.home,req_data.fixture_info.away]
        let player_role  = ["WK","BAT","AR","BOW"]
        let req_player_list = []
        for(let i=0;i<req_data.players.length;i++){
            req_player_list.push({
                name: req_data.players[i].full_name,
                id: req_data.players[i].player_uid,
                team_index: team_name.indexOf(req_data.players[i].team_abbr),
                player_role: player_role.indexOf(req_data.players[i].position)
            })
        }
        let password = "coder_bobby_believer01_tg_software";
        // let stuff_data = [];
        // //do encryption here 
        // for(let i=0;i<req_data.length;i++){
        //     let vp = JSON.stringify(req_data[i]);
        //     let hashed_value = CryptoJS.AES.encrypt(vp,password).toString();
        //     stuff_data.push(hashed_value);
        // }
        let stuff_data = CryptoJS.AES.encrypt(JSON.stringify(req_player_list),password).toString();
        res.status(200).json({
            status:'success',
            data: stuff_data
        })
    }
    catch(e){
       // console.log(e)
        res.status(404).json({
            status:'fail',
            message:'Something went wrong!'
        })   
    }
})
//post method to store all those automatic mappings 
router.post('/api/automatic/add_mapping', async (req,res)=>{
    try{
        let tg_id = req.body.tgMatchId;
        let bf_id = req.body.bfMatchId;
        let pl_id = req.body.plMatchId;
        let league_id = req.body.leagueId;
        let playerMappingData = req.body.playerMapperData;
        let obj = {
            tgMatchId: tg_id,
            beatfantasyMatchId: bf_id,
            perfectLineupMatchId: pl_id,
            playerMapperData: playerMappingData,
            leagueId: league_id
        }
        //check for initial mapping 
        let obj_list = await automaticdb.find({tgMatchId: tg_id})
        if(obj_list.length>0){
            obj_list[0].beatfantasyMatchId = bf_id;
            obj_list[0].perfectLineupMatchId = pl_id;
            obj_list[0].playerMapperData = playerMappingData;
            obj_list[0].leagueId = league_id;
            await obj_list[0].save()
            res.status(200).json({
                status:'success',
                message:'Mapping data updated successfully!'
            })
        }
        else{
            let loadArr = []
            for(let i=0;i<=20;i++)
                loadArr.push(0);
            let req_obj = await automaticdb.create(obj);
            let load_obj = await loadbalancedb.create({
                tgMatchId: tg_id,
                loadArray: loadArr,
                mobileNumber: '9848579715'
            })
            let load_obj_two = await loadbalancedb.create({
                tgMatchId: tg_id,
                loadArray: loadArr,
                mobileNumber: '6281735219'
            })
            if(req_obj && load_obj && load_obj_two){
                res.status(200).json({
                    status:'success',
                    message:'Mapping created successfully!'
                })
            }
            else{
                res.status(201).json({
                    status:'fail',
                    message:'Error while creating the mapping!'
                })
            }
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

router.post('/api/automatic/prime-line', async (req,res)=>{
    try{
        let lineStatus = req.body.lineStatus;
        let obj_list = await utildb.find({});
        if(obj_list.length>0){
            let obj = obj_list[0];
            obj.transferLine = lineStatus;
            await obj.save();
            res.status(200).json({
                status:'success',
                message:'Transfer Lines Updated Successfully!'
            })
        }
        else{
            res.status(404).json({
                status:'fail',
                message:'Something went wrong!'
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

//add team to the dream11
//main line
router.post('/api/automatic/addteam/main', async(req,res)=>{
    try{
        let tg_id = req.body.tgMatchId.toString();
        let index = mainLoadMatchId.indexOf(tg_id)
        if(index===-1){
            create_load(tg_id);
            index = mainLoadMatchId.indexOf(tg_id)
        }
        let player_data = req.body.playerData;
        let captain_data = req.body.captainData;
        let vice_captain_data = req.body.vicecaptainData;
        let automatic_obj = await automaticdb.find({tgMatchId: tg_id})
        let pl_hash_obj_list = await utildb.find({})
        let pl_hash = pl_hash_obj_list[0].perfectLineupHash;
        if(automatic_obj.length>0){
                let req_automatic_obj = automatic_obj[0];
                let flag_index = -1;
                for(let i=1;i<=20;i++){
                    if(mainLoadBalance[index].loadArray[i]===0){
                        flag_index = i;
                        mainLoadBalance[index].loadArray[i] = 1;
                        break;
                    }
                }
                if(flag_index === -1){
                    res.status(403).json({
                        status:'fail',
                        message:'Please try again!!'
                    })
                    return;
                }
                let url = `https://plapi.perfectlineup.in/fantasy/api/save_team`;
                let pl_obj = {
                    website_id: "1",
                    season_game_uid: req_automatic_obj.perfectLineupMatchId.toString(),
                    league_id: req_automatic_obj.leagueId.toString(),
                    player_ids:  player_data.map(p=> p.toString()),
                    c_id: captain_data.toString(),
                    vc_id: vice_captain_data.toString(),
                    is_replace: 1,
                    tp_team_id: flag_index,
                    tname: `T${flag_index}`
                }
                axios.post(
                    url, pl_obj,
                    {
                        headers: {
                          Sessionkey: pl_hash,
                          Moduleaccess: 7
                        }
                    }
                ).then(async (pl_res) => {
                        let bf_url = `https://w3u2jlhyj6.execute-api.us-east-1.amazonaws.com/prod/experts/sync-teams`
                        let bf_obj = {
                            match_id: req_automatic_obj.beatfantasyMatchId,
                            mobile_number: 9848579715,
                            source: 'dream-xi',
                            sport: 'cricket',
                            teams:[]
                        }
                        axios.post(bf_url,bf_obj).then(async bf_res=>{
                            let req_teams = bf_res.data.teams;
                            for(let i=0;i<req_teams.length;i++){
                                if(req_teams[i].unique_key.toString() === flag_index.toString()){
                                    mainLoadBalance[index].loadArray[flag_index]=0;
                                    let password = "coder_bobby_believer01_tg_software";
                                    let stuff_data = CryptoJS.AES.encrypt(JSON.stringify({"link": req_teams[i].link}),password).toString();
                                    res.status(200).json({
                                        status:'success',      
                                        data: stuff_data,
                                        message:"team fetched successfully!"
                                    })
                                    return;
                                }
                            }
                            mainLoadBalance[index].loadArray[flag_index]=0;
                            res.status(201).json({
                                status:'fail',
                                message:'Error while fetching the data!'
                            })
                        })
                        .catch(async a=>{
                            mainLoadBalance[index].loadArray[flag_index]=0;
                            res.status(201).json({
                                status:'fail',
                                message:'Error while shfiting the team!'
                            })
                            return;
                        })
                  })
                .catch(async (err) => {
                    mainLoadBalance[index].loadArray[flag_index]=0;
                    res.status(201).json({
                        status:'fail',
                        message:'Error while shfiting the team!'
                    })
                    return;
                  })
        }
        else{
            res.status(201).json({
                status:'fail',
                message:'Error while shfiting the team!'
            })
            return;
        }
    }
    catch(e){
      console.log(e)
        res.status(404).json({
            status:'fail',
            message:'Something went wrong!'
        })
    }
})

//second
router.post('/api/automatic/addteam/second', async(req,res)=>{
    try{
        let tg_id = req.body.tgMatchId.toString();
        let index = secondLoadMatchId.indexOf(tg_id)
        if(index===-1){
            create_load(tg_id);
            index = secondLoadMatchId.indexOf(tg_id)
        }
        let player_data = req.body.playerData;
        let captain_data = req.body.captainData;
        let vice_captain_data = req.body.vicecaptainData;
        let automatic_obj = await automaticdb.find({tgMatchId: tg_id})
        let pl_hash_obj_list = await utildb.find({})
        let pl_hash = pl_hash_obj_list[0].perfectLineupHashTwo;
        if(automatic_obj.length>0){
                let req_automatic_obj = automatic_obj[0];
                let flag_index = -1;
                for(let i=1;i<=20;i++){
                    if(secondLoadBalance[index].loadArray[i]===0){
                        flag_index = i;
                        secondLoadBalance[index].loadArray[i] = 1;
                        break;
                    }
                }
                if(flag_index === -1){
                    res.status(403).json({
                        status:'fail',
                        message:'Please try again!!'
                    })
                    return;
                }
                let url = `https://plapi.perfectlineup.in/fantasy/api/save_team`;
                let pl_obj = {
                    website_id: "1",
                    season_game_uid: req_automatic_obj.perfectLineupMatchId.toString(),
                    league_id: req_automatic_obj.leagueId.toString(),
                    player_ids:  player_data.map(p=> p.toString()),
                    c_id: captain_data.toString(),
                    vc_id: vice_captain_data.toString(),
                    is_replace: 1,
                    tp_team_id: flag_index,
                    tname: `T${flag_index}`
                }
                axios.post(
                    url, pl_obj,
                    {
                        headers: {
                          Sessionkey: pl_hash,
                          Moduleaccess: 7
                        }
                    }
                ).then(async (pl_res) => {
                        let bf_url = `https://w3u2jlhyj6.execute-api.us-east-1.amazonaws.com/prod/experts/sync-teams`
                        let bf_obj = {
                            match_id: req_automatic_obj.beatfantasyMatchId,
                            mobile_number: 6281735219,
                            source: 'dream-xi',
                            sport: 'cricket',
                            teams:[]
                        }
                        axios.post(bf_url,bf_obj).then(async bf_res=>{
                            let req_teams = bf_res.data.teams;
                            for(let i=0;i<req_teams.length;i++){
                                if(req_teams[i].unique_key.toString() === flag_index.toString()){
                                    secondLoadBalance[index].loadArray[flag_index]=0;
                                    let password = "coder_bobby_believer01_tg_software";
                                    let stuff_data = CryptoJS.AES.encrypt(JSON.stringify({"link": req_teams[i].link}),password).toString();
                                    res.status(200).json({
                                        status:'success',      
                                        data: stuff_data,
                                        message:"team fetched successfully!"
                                    })
                                    return;
                                }
                            }
                            secondLoadBalance[index].loadArray[flag_index]=0;
                            res.status(201).json({           
                                status:'fail',
                                message:'Error while fetching the data!'
                            })
                        })
                        .catch(async a=>{
                            secondLoadBalance[index].loadArray[flag_index]=0;
                            res.status(201).json({
                                status:'fail',
                                message:'Error while shfiting the team!'
                            })
                            return;
                        })
                  })
                .catch(async (err) => {
                    secondLoadBalance[index].loadArray[flag_index]=0;
                    res.status(201).json({
                        status:'fail',
                        message:'Error while shfiting the team!'
                    })
                    return;
                  })
        }
        else{
            res.status(201).json({
                status:'fail',
                message:'Error while shfiting the team!'
            })
            return;
        }
    }
    catch(e){
      console.log(e)
        res.status(404).json({
            status:'fail',
            message:'Something went wrong!'
        })
    }
})

//old
// router.post('/api/automatic/addteam', async(req,res)=>{
//     try{
//         let tg_id = req.body.tgMatchId.toString();
//         let generateLinkFlag = req.body.generateLinkFlag;
//         let current_lines = ['9848579715','6281735219']
//         let line_index = 0;
//         let player_data = req.body.playerData;
//         let captain_data = req.body.captainData;
//         let vice_captain_data = req.body.vicecaptainData;
//         let automatic_obj = await automaticdb.find({tgMatchId: tg_id})
//         let pl_hash_obj_list = await utildb.find({})
//         let pl_hash = pl_hash_obj_list[0].perfectLineupHash;
//         let transferLine = pl_hash_obj_list[0].transferLine;
//         // console.log(automatic_obj[0], pl_hash)
//         if(automatic_obj.length>0){
//             let load_obj_one_list  = await loadbalancedb.find({tgMatchId: tg_id, mobileNumber: current_lines[0]})
//             let load_obj_two_list  = await loadbalancedb.find({tgMatchId: tg_id,  mobileNumber: current_lines[1]})
//             let load_obj_one = load_obj_one_list[0]
//             let load_obj_two = load_obj_two_list[0]
//            // console.log(load_obj_one,load_obj_two)
//             let load_obj = [load_obj_one,];
//             //console.log(load_obj)
//             if(load_obj_one && load_obj_two){
//                 //do some decisions here 
//                 if(transferLine === 'all-lines' && generateLinkFlag === 'general'){
//                     let cnt_one=0,cnt_two=0;
//                     for(let i=0;i<load_obj_one.loadArray.length;i++)
//                     {
//                         if(load_obj_one.loadArray[i]===1) cnt_one++;
//                     }
//                     for(let i=0;i<load_obj_two.loadArray.length;i++)
//                     {
//                         if(load_obj_two.loadArray[i]===1) cnt_two++;
//                     }
//                     if(cnt_one<=cnt_two){
//                         load_obj = [load_obj_one,];
//                         line_index=0;
//                     }
//                     else{
//                         load_obj = [load_obj_two,];
//                         line_index = 1;
//                     }
//                     //console.log('we are here')
//                 }
//                 else if(transferLine === 'main-line' && generateLinkFlag === 'general'){
//                     load_obj = [load_obj_one,];
//                     line_index = 0;
//                 }
//                 else if(transferLine === 'all-lines' && generateLinkFlag === 'prime'){
//                     load_obj = [load_obj_two,];
//                     line_index = 1;
//                 }
//                 else{
//                     load_obj = [load_obj_two,];
//                     line_index = 1;
//                 }
//                 if(line_index === 1)
//                 pl_hash =  pl_hash_obj_list[0].perfectLineupHashTwo;

//               //  console.log(transferLine,generateLinkFlag,line_index)
//                 let req_automatic_obj = automatic_obj[0];
//                 let req_load_obj = load_obj[0];
//               //  console.log(pl_hash)
//                 //find the load balancer team no 
//                 let flag_index = -1;
//                 for(let i=1;i<=20;i++){
//                     if(load_obj[0].loadArray[i]===0){
//                         flag_index = i;
//                         load_obj[0].loadArray[i] = 1;
//                         break;
//                     }
//                 }
//                 if(flag_index === -1){
//                     load_obj[0].loadArray[flag_index]=0;
//                     await load_obj[0].save();
//                     res.status(403).json({
//                         status:'fail',
//                         message:'Please try again!!'
//                     })
//                     return;
//                 }
//                 await load_obj[0].save();
//                 //console.log(flag_index)
//                 //console.log('hi')
//                 let url = `https://plapi.perfectlineup.in/fantasy/api/save_team`;
//                 let pl_obj = {
//                     website_id: "1",
//                     season_game_uid: req_automatic_obj.perfectLineupMatchId.toString(),
//                     league_id: req_automatic_obj.leagueId.toString(),
//                     player_ids:  player_data.map(p=> p.toString()),
//                     c_id: captain_data.toString(),
//                     vc_id: vice_captain_data.toString(),
//                     is_replace: 1,
//                     tp_team_id: flag_index,
//                     tname: `T${flag_index}`
//                 }
//                 //console.log(pl_obj)
//                 axios.post(
//                     url, pl_obj,
//                     {
//                         headers: {
//                           Sessionkey: pl_hash,
//                           Moduleaccess: 7
//                         }
//                     }
//                 ).then(async (pl_res) => {
//                      //  console.log('hi hello')
//                         // now call the beatfantasy here get the share link
//                       //  console.log(req_automatic_obj.beatfantasyMatchId)
//                         let bf_url = `https://w3u2jlhyj6.execute-api.us-east-1.amazonaws.com/prod/experts/sync-teams`
//                         let bf_obj = {
//                             match_id: req_automatic_obj.beatfantasyMatchId,
//                             mobile_number: parseInt(current_lines[line_index]),
//                             source: 'dream-xi',
//                             sport: 'cricket',
//                             teams:[]
//                         }
//                        // console.log('hi hello')
//                         axios.post(bf_url,bf_obj).then(async bf_res=>{
//                             let req_teams = bf_res.data.teams;
//                           //  console.log(req_teams)
//                             for(let i=0;i<req_teams.length;i++){

//                               //  console.log(req_teams[i].unique_key.toString(),flag_index.toString())
//                                 if(req_teams[i].unique_key.toString() === flag_index.toString()){
//                                     load_obj[0].loadArray[flag_index]=0;
//                                     await load_obj[0].save();
//                                     let password = "coder_bobby_believer01_tg_software";
//                                     let stuff_data = CryptoJS.AES.encrypt(JSON.stringify({"link": req_teams[i].link}),password).toString();
//                                    // console.log(req_teams[i].link)
//                                     res.status(200).json({
//                                         status:'success',      
//                                         data: stuff_data,
//                                         message:"team fetched successfully!"
//                                     })
//                                     return;
//                                 }
//                             }
//                             load_obj[0].loadArray[flag_index]=0;
//                             await load_obj[0].save();
//                             res.status(201).json({
//                                 status:'fail',
//                                 message:'Error while fetching the data!'
//                             })
//                         })
//                         .catch(async a=>{
//                             load_obj[0].loadArray[flag_index]=0;
//                             await load_obj[0].save();
//                             res.status(201).json({
//                                 status:'fail',
//                                 message:'Error while shfiting the team!'
//                             })
//                             return;
//                         })
                  
//                   })
//                 .catch(async (err) => {
//                     load_obj[0].loadArray[flag_index]=0;
//                     await load_obj[0].save();
//                     res.status(201).json({
//                         status:'fail',
//                         message:'Error while shfiting the team!'
//                     })
//                     return;
//                   })
//             }
//         }
//         else{
//            // load_obj[0].loadArray[flag_index]=0;
//            // await load_obj[0].save();
//             res.status(201).json({
//                 status:'fail',
//                 message:'Error while shfiting the team!'
//             })
//             return;
//         }
//     }
//     catch(e){
//       //  load_obj[0].loadArray[flag_index]=0;
//       //  await load_obj[0].save();
//       console.log(e)
//         res.status(404).json({
//             status:'fail',
//             message:'Something went wrong!'
//         })
//     }
// })

// router.get('/api/mapper/getdata/:tgMatchId', async (req,res)=>{
//     try{
//         let tgMatchId = req.params.tgMatchId.toString();
//         let obj = await dream11Mapper.find({tgMatchId: tgMatchId});
//         if(obj.length>0){
//             res.status(200).json({
//                 status:'success',
//                 data: {dream11MatchId:obj[0].dream11MatchId,tgMatchId:obj[0].tgMatchId,mapperExist: true ,leftName: obj[0].leftName,rigtName:obj[0].rightName},
//                 message:'Match Mapper Data Fetched Successfully!'
//             })
//         }
//         else{
//             res.status(200).json({
//                 status:'success',
//                 data:{mapperExist: false},
//                 message: 'Match Mapper Data Fetched Successfully!'
//             })
//         }
//     }
//     catch(e){
//         res.status(404).json({
//             status:'fail',
//             message:'Something went wrong!'
//         })
//     }
// })

module.exports = router;