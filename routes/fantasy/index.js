const express = require('express')
const axios = require('axios')
var CryptoJS = require("crypto-js");
const automaticmapper = require('../../models/automaticmapper');
const classicDream11Mapper = require('../../models/classicdream11mapper')
//temp here
//const fetch = (url) => import('node-fetch').then(({default: fetch}) => fetch(url));
const router = express.Router()
let base_url_one = 'https://api.cricpick.in/games/view/'   
let base_url_two = '/1.1.json'
let all_matches_api = 'https://api.cricpick.in/games/listing/active/safe.json'

//myfab11 backup stuff here 
let backup_url_one = 'https://json.myfab11.com/fantasy/game/playerlist-'
let backup_url_two = '.json';


let cricket_scorecard = 'https://api.cricpick.in//game-players/scorecard/'
let football_scorecard = 'https://api.cricpick.in//football-game-players/scorecard/'
let basketball_scorecard = 'https://api.cricpick.in//nba-game-players/scorecard/'
let kabaddi_scorecard = 'https://api.cricpick.in//kabaddi-game-players/scorecard/'
//https://dev.myfab11.in/team-players/scorecard/111689.json
//https://api.cricpick.in/team-players/scorecard/111689.json
let generic_scorecard_end = '.json'

// temporery fix
let extra_data = []


//helper function to calculate difference between the times 
function timeDifference(date1,date2) {
    var difference = date1.getTime() - date2.getTime();

    var daysDifference = Math.floor(difference/1000/60/60/24);
    difference -= daysDifference*1000*60*60*24

    var hoursDifference = Math.floor(difference/1000/60/60);
    difference -= hoursDifference*1000*60*60

    var minutesDifference = Math.floor(difference/1000/60);
    difference -= minutesDifference*1000*60

    var secondsDifference = Math.floor(difference/1000);
  
    return {
      days:daysDifference,
      hours:hoursDifference,
      minutes:minutesDifference,
      seconds:secondsDifference
    }
}

let get_req_scorecard_url = (match_id,sport_type) =>{
    if(sport_type === 'cricket')
        return cricket_scorecard+match_id+generic_scorecard_end;
    else if(sport_type === 'football')
        return football_scorecard+match_id+generic_scorecard_end;
    else if(sport_type === 'basketball') 
        return basketball_scorecard+match_id+generic_scorecard_end;
    else 
        return kabaddi_scorecard+match_id+generic_scorecard_end;
}

router.get('/api/fantasy/scorecard/:sport/:id',async (req,res)=>{
   
        let match_id = req.params.id 
        let sport_type = req.params.sport 
        let req_url = get_req_scorecard_url(match_id,sport_type)
        // temp here
        // const vp = await fetch(req_url);
        // const data = await vp.json();
        // let response = await axios.get(req_url,{
        //     headers: {
        //       'Cache-Control': 'no-cache',
        //       'Pragma': 'no-cache',
        //       'Expires': '0',
        //     },
        //   })
        //console.log(data.players[0])
        let response = await axios.get(req_url)
        let data = response.data
        if(data.players.length>0 && data.players[0].game !== null)
        {
            match_status  = data.players[0].game.status 
            let players_data = data.players
            let req_list = []
            for(let i=0;i<players_data.length;i++)
            {
                req_list.push({
                    player_fixed_id: players_data[i].player_id,
                    player_points: players_data[i].points,
                    player_name: players_data[i].player.name,
                    player_team_code: players_data[i].player.team_code,
                    playing: players_data[i].playing ? 1 : 0
                })
            }
             res.status(200).json({
                status:'success',
                data: {
                    match_status: match_status,
                    player_data : req_list,
                    sport: sport_type,
                    match_id: match_id,
                    match_time: data.players[0].game.game_date
                }
            })
        }
        else 
        {
            res.status(200).json({
                status:'success',
                data: {
                    match_status: 'active',
                    player_data : [],
                    sport: sport_type,
                    match_id: match_id,
                    match_time: Date.now() 
                }
            })
        } 
})


//backup scorecard 

router.get('/api/fantasy/scorecard/backup/:sport/:id',async (req,res)=>{
   
    try{
        let match_id = req.params.id 
    let sport_type = req.params.sport 
    let req_url = 'https://api.fantasyteamcreator.online/getMatchPoints'
    let req_obj = {
        match_key: match_id,
        team_type: sport_type
    }
    // temp here
    // const vp = await fetch(req_url);
    // const data = await vp.json();
    // let response = await axios.get(req_url,{
    //     headers: {
    //       'Cache-Control': 'no-cache',
    //       'Pragma': 'no-cache',
    //       'Expires': '0',
    //     },
    //   })
    //console.log(data.players[0])
    let response = await axios.post(req_url,req_obj)
    let data = response.data
    
         res.status(200).json({
            status:'success',
            data: {
                match_status: data.match_status,
                player_data : data.player_data,
                sport: sport_type,
                match_id: match_id,
                match_time: Date.now()
            }
        })
    }
    catch(e){
        res.status(404).json({
            status:'fail',
            message:'Something went wrong!'
        })
    }
})




let get_base_second_url = (match_id)=>{
    let old = false;
    if(old){
        return `${base_url_one}${match_id}${base_url_two}`
    }
    else{
        return `${backup_url_one}${match_id}${backup_url_two}`
    }
}


//cricket = 1,2,3,4 
//football = 5 
//basketball = 7
//lineupStatus: "LINEUP_ANNOUNCED"
router.get('/api/fantasy/matches/:sport',async (req,res)=>{
    try{
        let classic_dream11_list = await classicDream11Mapper.find({}).sort({createdAt:-1}).limit(120)
        let tg_match_ids = []
        for(let i=0;i<classic_dream11_list.length;i++){
            tg_match_ids.push(classic_dream11_list[i].tgMatchId.toString())
        }
        let req_data = []
        let sport = req.params.sport;
        let sport_list = ['cricket','football','basketball','kabaddi']
        let link_list = ['https://json.myfab11.com/fantasy/games-cricket-active.json','https://json.myfab11.com/fantasy/games-football-active.json',
        'https://json.myfab11.com/fantasy/games-nba-active.json','https://json.myfab11.com/fantasy/games-kabaddi-active.json',
        ]
        let sport_index = sport_list.indexOf(sport)
        if(sport_index===-1){
            res.status(404).json({
                status:'fail',
                message:'Something went wrong!'
            })
            return;
        }
        let req_api = link_list[sport_index]
        let resp1 = await axios.get(req_api);
        req_data = [];
        //sport 
        resp1.data.result.games.forEach((match)=>{
            if(match.mode === 'regular'){
                let left_image = null
                let right_image = null 
                let match_index = tg_match_ids.indexOf(match.id.toString())
                if(match_index>=0){
                    let vp_dp = classic_dream11_list[match_index]
                    left_image = vp_dp.left_team_image
                    right_image = vp_dp.right_team_image
                }
                req_data.push(
                    {
                        id:match.id,
                        left_team_name:match.home_team_code,
                        right_team_name:match.away_team_code,
                        left_team_image: left_image ? left_image : match.home_team.logo,
                        right_team_image: right_image ? right_image : match.away_team.logo,
                        series_name: match.tournament.name,
                        match_time: match.game_date,
                        sport_index: sport_index,
                        lineup_out: match.lineupStatus === 'LINEUP_ANNOUNCED' ? 1 : 0,
                        automatic: tg_match_ids.includes(match.id.toString()) ? true : false
                    }
                )
            }
        })
        let password = "coder_bobby_believer01_tg_software";
        //do encryption here 
       let stuff_data = [];
        for(let j=0;j<req_data.length;j++){
            let vp = JSON.stringify(req_data[j]);
            let hashed_value = CryptoJS.AES.encrypt(vp,password).toString();
            stuff_data.push(hashed_value);
        }
        
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
//image helper 
let getPlayerImage = (img)=>{
    let default_image="https://d13ir53smqqeyp.cloudfront.net/player-images/default-player-image.png"
    if(img ===null || img === '')
        return default_image
    else 
        return img 

}
//role / position of player helper 
let getRoleId = (category_list,sport_category_id,position)=>{
    let role_names = [
        ['wicketkeeper','batsman','allrounder','bowler'],
        ['G','D','M','F'],
        ['PG','SG','SF','PF','C'],
        ['defender','allrounder','raider']
    ]
    let sport_index = -1
    for(let i=0;i<category_list.length;i++)
    {
        if(category_list[i].includes(sport_category_id))
        {
            sport_index = i;
            break;
        }
    }
    if(sport_index!=-1)
    {
        return role_names[sport_index].indexOf(position)
    }
}

router.get('/api/fantasy/match/:id',async (req,res)=>{
        try{
            let classic_dream11_list = await classicDream11Mapper.find({tgMatchId: req.params.id.toString()});
            let classic_obj = null;
            if(classic_dream11_list.length>0){
                classic_obj = classic_dream11_list[0];
            }
            let req_url = get_base_second_url(req.params.id)
            let response = await axios.get(req_url) 
            let left_team_players = []
            let right_team_players = []
            let category_list = [
                [1,2,3,4],
                [5],
                [7],
                [6]
            ]
            let sport_category_id_list = response.data.game.tournament.sport_category_id
            let sport_index = -1 
            for(let i=0;i<category_list.length;i++)
            {
                if(category_list[i].includes(sport_category_id_list))
                    sport_index = i
            }
            //left team data 
            response.data.game.home_team.players.forEach((player,index)=>{
                let kvp = 0;
                if(player.playing === null || player.playing === undefined)
                {
                    let jp = player.last_match_playing_info
                    if(jp!==null && jp === 'Announced')
                    {
                        kvp =1;
                    }
                }
                else 
                {
                    kvp= player.playing ===1? 1 : 0 
                }
                    //last match played
                    let last_play = 0;
                    if(player.last_match_playing_info === "Played last match"){
                        last_play = 1;
                    }
                left_team_players.push({
                    name: player.name,
                    image: getPlayerImage(player.image),
                    playing: kvp,
                    last_play: last_play,
                    role: getRoleId(category_list,sport_category_id_list,player.position),  
                    credits: Number(player.cost)/10,
                    points: player.points,
                    selected_by: player.selected_by,
                    captain_percentage: player.captain_percentage,
                    vice_captain_percentage: player.vice_captain_percentage,
                    team_index:0,
                    team_name: response.data.game.home_team_code,
                    player_index:index+1,
                    player_fixed_id: player.id
                })
            })
            //right team data 
            response.data.game.away_team.players.forEach((player,index)=>{
                let kvp = 0;
                if(player.playing === null || player.playing === undefined)
                {
                    let jp = player.last_match_playing_info
                    if(jp!==null && jp=== 'Announced')
                    {
                        kvp =1;
                    }
                }
                else 
                {
                    kvp= player.playing ===1? 1 : 0 
                }
                    //last match played
                    let last_play = 0;
                    if(player.last_match_playing_info === "Played last match"){
                        last_play = 1;
                    }
                right_team_players.push({
                    name: player.name,
                    image: getPlayerImage(player.image),
                    playing: kvp,
                    last_play: last_play,
                    role: getRoleId(category_list,sport_category_id_list,player.position),
                    credits: Number(player.cost)/10,
                    points: player.points,
                    selected_by: player.selected_by,
                    captain_percentage: player.captain_percentage,
                    vice_captain_percentage: player.vice_captain_percentage,
                    team_index:1,
                    team_name: response.data.game.away_team_code,
                    player_index:left_team_players.length+index+1,
                    player_fixed_id: player.id
                })
            })
            let req_data ={
                match_time: response.data.game.game_date,
                sport_index:sport_index,
                left_team_name:response.data.game.home_team_code,
                right_team_name:response.data.game.away_team_code,
                left_team_image:response.data.game.home_team.logo,
                right_team_image:response.data.game.away_team.logo,
                lineup_status: response.data.game.lineupStatus ==='LINEUP_ANNOUNCED' ? 1 : 0,
                left_team_players:left_team_players,
                right_team_players:right_team_players
        
            }
            //add classic ids here 
            let temp_left_players = [];
            let temp_right_players = [];
            //left
            for(let i=0;i<req_data.left_team_players.length;i++){
                let p = req_data.left_team_players[i];
                if(classic_obj){
                    let flag = false;
                   for(let j=0;j<classic_obj.playerMapping.length;j++){
                    if(classic_obj.playerMapping[j].tgPlayerId.toString() === p.player_fixed_id.toString()){
                        let c_player = classic_obj.playerMapping[j];
                        p["pl_id"] = c_player.dream11PlayerId;
                        p.image = c_player.d11_player_image ? c_player.d11_player_image : p.image 
                        p.credits = c_player.d11_credits ? c_player.d11_credits : p.credits
                        p.selected_by = c_player.d11_player_selection_percentage ? c_player.d11_player_selection_percentage : p.selected_by
                        p.captain_percentage = c_player.d11_captain_selection_percentange ? c_player.d11_captain_selection_percentange : p.captain_percentage
                        p.vice_captain_percentage = c_player.d11_vicecaptain_selection_percentage ? c_player.d11_vicecaptain_selection_percentage : p.vice_captain_percentage
                        flag = true;
                        break;
                    }
                   }
                   if(!flag){
                    p["pl_id"] = null;
                   }
                }
                else{
                    p["pl_id"] = null;
                }
                temp_left_players.push(p);
            }
            //right
            for(let i=0;i<req_data.right_team_players.length;i++){
                let p = req_data.right_team_players[i];
                if(classic_obj){
                    let flag = false;
                   for(let j=0;j<classic_obj.playerMapping.length;j++){
                    if(classic_obj.playerMapping[j].tgPlayerId.toString() === p.player_fixed_id.toString()){
                        let c_player = classic_obj.playerMapping[j];
                        p["pl_id"] = c_player.dream11PlayerId;
                        p.image = c_player.d11_player_image ? c_player.d11_player_image : p.image 
                        p.credits = c_player.d11_credits ? c_player.d11_credits : p.credits
                        p.selected_by = c_player.d11_player_selection_percentage ? c_player.d11_player_selection_percentage : p.selected_by
                        p.captain_percentage = c_player.d11_captain_selection_percentange ? c_player.d11_captain_selection_percentange : p.captain_percentage
                        p.vice_captain_percentage = c_player.d11_vicecaptain_selection_percentage ? c_player.d11_vicecaptain_selection_percentage : p.vice_captain_percentage
                        flag = true;
                        break;
                    }
                   }
                   if(!flag){
                    p["pl_id"] = null;
                   }
                }
                else{
                    p["pl_id"] = null;
                }
                temp_right_players.push(p);
            }
            req_data.left_team_players = temp_left_players;
            req_data.right_team_players = temp_right_players;
            req_data.left_team_image = classic_obj?.left_team_image ? classic_obj.left_team_image : req_data.left_team_image
            req_data.right_team_image = classic_obj?.right_team_image ? classic_obj.right_team_image : req_data.right_team_image
            if(classic_obj){
                req_data["automatic"] = true;
            }
            else{
                req_data["automatic"] = false;
            }
            // do some stuff here 
           let password = "coder_bobby_believer01_tg_software";
            //do encryption here 
            let stuff_data = {...req_data};
           // left team players 
            let left_hash = [];
            for(let i=0;i<req_data.left_team_players.length;i++){
                let temp = JSON.stringify(req_data.left_team_players[i]);
                let temp_hash = CryptoJS.AES.encrypt(temp,password).toString();
                left_hash.push(temp_hash)
            }
           // right team players
            let right_hash = [];
            for(let i=0;i<req_data.right_team_players.length;i++){
                let temp = JSON.stringify(req_data.right_team_players[i]);
                let temp_hash = CryptoJS.AES.encrypt(temp,password).toString();
                right_hash.push(temp_hash)
            }
            //other stuff 
            stuff_data.match_time = CryptoJS.AES.encrypt(req_data.match_time,password).toString();
            stuff_data.sport_index = req_data.sport_index;
            stuff_data.left_team_name =  CryptoJS.AES.encrypt(req_data.left_team_name,password).toString();
            stuff_data.right_team_name = CryptoJS.AES.encrypt(req_data.right_team_name,password).toString();
            stuff_data.left_team_image = CryptoJS.AES.encrypt(req_data.left_team_image,password).toString();
            stuff_data.right_team_image = CryptoJS.AES.encrypt(req_data.right_team_image,password).toString();
            stuff_data.lineup_status = req_data.lineup_status;
            stuff_data.left_team_players = left_hash;
            stuff_data.right_team_players = right_hash;
            res.status(200).json({
                status:'success',
                data: stuff_data
            })
        }
        catch(e){
            console.log(e)
            res.status(404).json({
                status:'fail',
                message:'Something went wrong!'
            })
        }
})

module.exports = router
