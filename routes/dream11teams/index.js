const express = require('express')
const axios = require('axios')
var CryptoJS = require("crypto-js");
let utildb = require('./../../models/Utility')
let dream11mapper = require('./../../models/dream11mapper')
//temp here
//const fetch = (url) => import('node-fetch').then(({default: fetch}) => fetch(url));
const router = express.Router()
//listing page now
let cricket_listing_one = 'https://www.beatfantasy.com/_next/data/';
let cricket_listing_two = '/cricket.json?sport=cricket';
let football_listing_one = 'https://www.beatfantasy.com/_next/data/'
let football_listing_two = '/football.json?sport=football';
//teams now
let cricket_teams_one = 'https://www.beatfantasy.com/_next/data/'
let cricket_teams_two = '/cricket/';
let cricket_teams_three = '/teams.json?sport=cricket&fixture_id=';
let football_teams_one = 'https://www.beatfantasy.com/_next/data/'
let football_teams_two = '/football/';
let football_teams_three = '/teams.json?sport=football&fixture_id=';
let base_url_one = 'https://api.cricpick.in/games/view/'   
let base_url_two = '/1.1.json'
let all_matches_api = 'https://api.cricpick.in/games/listing/active/safe.json'


let cricket_scorecard = 'https://api.cricpick.in//game-players/scorecard/'
let football_scorecard = 'https://api.cricpick.in//football-game-players/scorecard/'
let basketball_scorecard = 'https://api.cricpick.in//nba-game-players/scorecard/'
let kabaddi_scorecard = 'https://api.cricpick.in//kabaddi-game-players/scorecard/'
let generic_scorecard_end = '.json'

let tpl_static =  [
    [4,7, 0],
    [5,6, 1],
    [6,5, 2],
    [7,4, 3],
    [3,8, 4],
    [2,9, 5],
    [1,10, 6],
    [8,3, 7],
    [9,2, 8],
    [10,1, 9]
]

let tcl_static = [[1, 3, 2, 5, 0], [1, 3, 3, 4, 1], [1, 4, 3, 3, 2], [1, 4, 2, 4, 3], [1, 4, 1, 5, 4], [1, 5, 2, 3, 5], [1, 5, 1, 4, 6],
[1, 6, 1, 3, 7], [1, 3, 1, 6, 8], [1, 3, 4, 3, 9], [2, 3, 3, 3, 10], [2, 3, 2, 4, 11], [2, 3, 1, 5, 12], [2, 4, 2, 3, 13], 
[2, 4, 1, 4, 14], [2, 5, 1, 3, 15], [3, 3, 2, 3, 16], [3, 4, 1, 3, 17], [3, 3, 1, 4, 18], [4, 3, 1, 3, 19], [1, 1, 1, 8, 20],
 [1, 1, 2, 7, 21], [1, 1, 3, 6, 22], [1, 1, 4, 5, 23], [1, 1, 5, 4, 24], [1, 1, 6, 3, 25], [1, 1, 7, 2, 26], [1, 1, 8, 1, 27],
  [1, 2, 1, 7, 28], [1, 2, 2, 6, 29], [1, 2, 3, 5, 30], [1, 2, 4, 4, 31], [1, 2, 5, 3, 32], [1, 2, 6, 2, 33], [1, 2, 7, 1, 34],
   [1, 3, 5, 2, 35], [1, 3, 6, 1, 36], [1, 4, 4, 2, 37], [1, 4, 5, 1, 38], [1, 5, 3, 2, 39], [1, 5, 4, 1, 40], [1, 6, 2, 2, 41],
    [1, 6, 3, 1, 42], [1, 7, 1, 2, 43], [1, 7, 2, 1, 44], [1, 8, 1, 1, 45], [2, 1, 1, 7, 46], [2, 1, 2, 6, 47], [2, 1, 3, 5, 48],
     [2, 1, 4, 4, 49], [2, 1, 5, 3, 50], [2, 1, 6, 2, 51], [2, 1, 7, 1, 52], [2, 2, 1, 6, 53], [2, 2, 2, 5, 54], [2, 2, 3, 4, 55],
      [2, 2, 4, 3, 56], [2, 2, 5, 2, 57], [2, 2, 6, 1, 58], [2, 3, 4, 2, 59], [2, 3, 5, 1, 60], [2, 4, 3, 2, 61], [2, 4, 4, 1, 62],
       [2, 5, 2, 2, 63], [2, 5, 3, 1, 64], [2, 6, 1, 2, 65], [2, 6, 2, 1, 66], [2, 7, 1, 1, 67], [3, 1, 1, 6, 68], [3, 1, 2, 5, 69],
        [3, 1, 3, 4, 70], [3, 1, 4, 3, 71], [3, 1, 5, 2, 72], [3, 1, 6, 1, 73], [3, 2, 1, 5, 74], [3, 2, 2, 4, 75], [3, 2, 3, 3, 76],
         [3, 2, 4, 2, 77], [3, 2, 5, 1, 78], [3, 3, 3, 2, 79], [3, 3, 4, 1, 80], [3, 4, 2, 2, 81], [3, 4, 3, 1, 82], [3, 5, 1, 2, 83],
          [3, 5, 2, 1, 84], [3, 6, 1, 1, 85], [4, 1, 1, 5, 86], [4, 1, 2, 4, 87], [4, 1, 3, 3, 88], [4, 1, 4, 2, 89], 
          [4, 1, 5, 1, 90], [4, 2, 1, 4, 91], [4, 2, 2, 3, 92], [4, 2, 3, 2, 93], [4, 2, 4, 1, 94], [4, 3, 2, 2, 95],
           [4, 3, 3, 1, 96], [4, 4, 1, 2, 97], [4, 4, 2, 1, 98], [4, 5, 1, 1, 99], [5, 1, 1, 4, 100], [5, 1, 2, 3, 101],
            [5, 1, 3, 2, 102], [5, 1, 4, 1, 103], [5, 2, 1, 3, 104], [5, 2, 2, 2, 105], [5, 2, 3, 1, 106], [5, 3, 1, 2, 107],
             [5, 3, 2, 1, 108], [5, 4, 1, 1, 109], [6, 1, 1, 3, 110], [6, 1, 2, 2, 111], [6, 1, 3, 1, 112], [6, 2, 1, 2, 113],
              [6, 2, 2, 1, 114], [6, 3, 1, 1, 115], [7, 1, 1, 2, 116], [7, 1, 2, 1, 117], [7, 2, 1, 1, 118], [8, 1, 1, 1, 119]]



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


//cricket = 1,2,3,4 
//football = 5 
//basketball = 7
//lineupStatus: "LINEUP_ANNOUNCED"
router.get('/api/dream11/:sport',async (req,res)=>{

    try{
        let obj = await utildb.find({});
        if(obj.length>0 && obj[0].dream11Hash){
            let req_hash = obj[0].dream11Hash;
            let response = null;
            if(req.params.sport === "cricket"){
              //  console.log(`${cricket_listing_one}${req_hash}${cricket_listing_two}`)
                response = await axios.get(`${cricket_listing_one}${req_hash}${cricket_listing_two}`);
            }
            else{
                response = await axios.get(`${football_listing_one}${req_hash}${football_listing_two}`)
            }
            let data = response.data
           // console.log(data)
            let req_data = []
            data.pageProps.matchDetailsAPIResponse.forEach((match)=>{
                if(match.teams_available){
                    req_data.push({
                        id:match.fixture_id,
                        left_team_name:match.home_team_name_short,
                        right_team_name:match.away_team_name_short,
                        left_team_image:match.home_team_logo,
                        right_team_image:match.away_team_logo,
                        series_name: match.league_name,
                        match_time: getActualDate(match.fixture_date),
                        lineup_out:0
                    })
                }
            })
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

let get_player_data = (player_id,left_players_data,right_player_data)=>{
    let player_data = null;
    for(let i=0;i<left_players_data.length;i++){
        if(left_players_data[i].player_index.toString() === player_id.toString()){
            player_data = left_players_data[i];
        }
    }
    if(!player_data){
        for(let i=0;i<right_player_data.length;i++){
            if(right_player_data[i].player_index.toString() === player_id.toString()){
                player_data = right_player_data[i];
            }
        }
    }
    return player_data;
}
let get_rand_value = function(limit)
{
    return Math.floor(Math.random()*limit)
}

//post request to get the teams 
router.post('/api/dream11/teams/:sport/:matchId',async (req,res)=>{
    try{
        let matchId = req.params.matchId;
        let matchObj = await dream11mapper.find({tgMatchId: matchId});
        let obj = await utildb.find({});
        
      
        if(obj.length>0 && obj[0].dream11Hash && matchObj.length === 1){
       //     console.log(req.body.advancedFilter)
            let req_match_obj = matchObj[0];
            let leftName = req_match_obj.leftName;
            let rightName = req_match_obj.rightName;
            let team_string = `${leftName}-vs-${rightName}`
            let req_hash = obj[0].dream11Hash;
            let response = null;
            let basicFilter = 'equal';
            let filterType = 'basic';
            let advancedFilter = null;
            let number_of_teams = 20;
            if(req.body.filterType) filterType = req.body.filterType;
            if(filterType === 'basic') basicFilter = req.body.basicFilter;
            else advancedFilter = req.body.advancedFilter;
            // console.log(filterType)
            // console.log(req.body)
            // console.log(advancedFilter)
            if(req.body.teamsCount){
                number_of_teams = parseInt(req.body.teamsCount);
            }
            let sport_index = 0;
            if(req.params.sport === 'cricket'){
                response = await axios.get(`${cricket_teams_one}${req_hash}${cricket_teams_two}${team_string}/${req_match_obj.dream11MatchId}${cricket_teams_three}${req.params.matchId}&team_names=${team_string}`);
            }
            else{
                filterType = 'basic';
                sport_index = 1;
                response = await axios.get(`${football_teams_one}${req_hash}${football_teams_two}${team_string}/${req_match_obj.dream11MatchId}${football_teams_three}${req.params.matchId}&team_names=${team_string}`);
            }
            let role_name = [['WK','BAT','AR','BOWL'],['GK','DEF','MID','ST']]
            let data = response.data;
          //  console.log(data)
            let players_data = data.pageProps.matchDetailsAPIResponse.players
            let teams_data = data.pageProps.matchDetailsAPIResponse.teams;
            let req_data = {}
            let left_players_data = [];
            let right_players_data = [];
            for(let i=0;i<players_data.length;i++){
                let p = players_data[i];
                let temp = {};
                temp["player_index"] = p.player_id;
                temp["name"] = p.player_name;
                temp["image"] = p.player_photo;
                temp["role"] = role_name[sport_index].indexOf(p.player_position);
                temp["team_index"] = p.is_home_team ? 0 : 1;
                temp["credits"] = 9;
                if(p.is_home_team){
                    left_players_data.push(temp);
                }
                else{
                    right_players_data.push(temp);
                }
            }
            req_data["left_players_data"] = left_players_data;
            req_data["right_players_data"] = right_players_data;
            req_data["left_team_name"] = data.pageProps.matchDetailsAPIResponse.match_details.home_team_short;
            req_data["right_team_name"] = data.pageProps.matchDetailsAPIResponse.match_details.away_team_short;
            req_data["teams_type"] = data.pageProps.matchDetailsAPIResponse.match_details.lineups_available ? 'playing11' : 'predicted11';
           
            let filtered_teams = [];
            if(filterType === 'basic'){
                //basic filters here
                filtered_teams = teams_data.filter(team =>{
                //  console.log(team)
                    let left = 0,right = 0;
                    let flag = false;
                    for(let i=0;i<team.players.length;i++){
                        // console.log('hi')
                        let p = get_player_data(team.players[i],left_players_data,right_players_data);
                        if(p===null){
                            flag = true;
                            break;
                        }
                        if(p.team_index === 0) left++;
                        else right++;
                    }
                    if(flag) return false;
                    let captain = get_player_data(team.captain,left_players_data,right_players_data);
                    let vice_captain = get_player_data(team.vice_captain,left_players_data,right_players_data);
                    if(captain === null || vice_captain === null){
                        return false;
                    }
                    //console.log(left,right)
                    if(left >=7 && captain.team_index === 1) return false;
                    if(right >=7 && captain.team_index === 0) return false;
                    if(basicFilter === 'left' && right>=6) return false;
                    if(basicFilter === 'right' && left>=6) return false;
                    return true;
                  }) 
            }
            else{
              //  console.log(advancedFilter)
                //advanced filters here  
                filtered_teams = teams_data.filter(team =>{
                //  console.log(team)
                let left = 0,right = 0;
                let flag = false;
                let left_selected_player_index = [];
                let right_selected_player_index = [];
                let wk=0,bat=0,al=0,bowl=0;
                let total_credit = 0;
                for(let i=0;i<team.players.length;i++){
                    // console.log('hi')
                    let p = get_player_data(team.players[i],left_players_data,right_players_data);
                    if(p===null){
                        flag = true;
                        break;
                    }
                    if(p.team_index === 0){ left++; left_selected_player_index.push(p.player_index); }
                    else {right++; right_selected_player_index.push(p.player_index);}
                    if(p.role===0) wk++; 
                    else if(p.role === 1) bat++;
                    else if(p.role === 2) al++;
                    else bowl++;
                    total_credit = total_credit + p.credits;
                }
                if(flag) return false;
                let captain = get_player_data(team.captain,left_players_data,right_players_data);
                let vice_captain = get_player_data(team.vice_captain,left_players_data,right_players_data);
                if(captain === null || vice_captain === null){
                    return false;
                }
              //  console.log(advancedFilter)
                // do filter here 
                //drop list
                if(advancedFilter.drop_player){
                    let drop_list = advancedFilter.drop_player;
                    for(let k=0;k<drop_list.length;k++){
                        if(left_selected_player_index.includes(drop_list[k]) || right_selected_player_index.includes(drop_list[k])) return false;
                    }
                }
                // fixed list
                if(advancedFilter.fixed_player){
                    let fixed_list = advancedFilter.fixed_player;
                    for(let k=0;k<fixed_list.length;k++){
                        if(!left_selected_player_index.includes(fixed_list[k]) && !right_selected_player_index.includes(fixed_list[k])) return false;
                    }
                }
                // captain list 
                if(advancedFilter.captain_player){
                    let captain_list = advancedFilter.captain_player;
                  //  console.log(captain_list)
                 //   console.log(captain.player_index)
                    if(!captain_list.includes(captain.player_index)) return false;
                }
                // vice captain list 
                if(advancedFilter.vicecaptain_player){
                    let vicecaptain_list = advancedFilter.vicecaptain_player;
                    if(!vicecaptain_list.includes(vice_captain.player_index)) return false;
                }
                //credit data 
                if(advancedFilter.credit_data){
                    let front_left = advancedFilter.credit_data.leftCredit;
                    let front_right = advancedFilter.credit_data.rightCredit;
                    if(total_credit>=front_left && total_credit<=front_right){}
                    else return false;
                }
                //partision data 
                if(advancedFilter.partision_data){
                    let partision_list = advancedFilter.partision_data;
                 
                    let actual_partision_data = [];
                    for(let k=0;k<tpl_static.length;k++){
                        if(partision_list.includes(tpl_static[k][2])) actual_partision_data.push(tpl_static[k]);
                    }
                    let partision_flag = false;
                    for(let i=0;i<actual_partision_data.length;i++){
                        if(left === actual_partision_data[i][0] && right === actual_partision_data[i][1]){ partision_flag= true; break;}
                    }
                    if(!partision_flag) return false;
                }
                //combination data 
                if(advancedFilter.combination_data){
                    let combination_list = advancedFilter.combination_data;
                       console.log(combination_list)
                    let actual_combination_data = [];
                    for(let k=0;k<tcl_static.length;k++){
                        if(combination_list.includes(tcl_static[k][4])) actual_combination_data.push(tcl_static[k]);
                    }
                    let combination_flag = false;
                    for(let i=0;i<actual_combination_data.length;i++){
                        if(wk === actual_combination_data[i][0] && bat === actual_combination_data[i][1] && 
                            al === actual_combination_data[i][2] && bowl === actual_combination_data[i][3])
                        { combination_flag= true; break;}
                    }
                    if(!combination_flag) return false;
                }
                return true;
                }) 
            }
        //    console.log(filtered_teams)
            //distribute filtered teams
            filtered_teams = filtered_teams.map((team,index)=>{
                let temp = {};
                temp["team_number"] = index+1;
                temp["captain"] = team.captain;
                temp["vice_captain"] = team.vice_captain;
                temp["credits"] = 99;
                temp["series_name"] = team.link;
                let final_team = [[],[],[],[]];
                for(let i=0;i<team.players.length;i++){
                     let p = get_player_data(team.players[i],left_players_data,right_players_data);
                     final_team[p.role].push(p.player_index);
                 }
                 temp["team"] = final_team;
                 return temp;
            })
            // now pick some stuff here 
            // console.log(filtered_teams.length);
            // console.log(number_of_teams)
            let final_output_teams = [];
            if(filtered_teams.length>number_of_teams){
                let size = filtered_teams.length;
                let p_sets = parseInt(size/number_of_teams);
                let value = get_rand_value(p_sets);
                let first_index = number_of_teams*value;
                let last_index = first_index+number_of_teams;
                // console.log(first_index);
                // console.log(last_index);
                // console.log(value);
                // console.log(p_sets);
                final_output_teams = filtered_teams.slice(first_index, last_index);

            }
            else
                final_output_teams = filtered_teams;
            
                final_output_teams = final_output_teams.map((team,index) =>{
                    team["display_team_number"] = index+1;
                    return team;
                })

            req_data["teams"] = final_output_teams;
            req_data["teamsCount"] = final_output_teams.length;

            let password = "coder_bobby_believer01_tg_software";
          
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
       // console.log(e)
        res.status(404).json({
            status: 'fail',
            message: 'Something went wrong!'
        })
    }
})

//just send the players data
router.get('/api/dream11/player_data/:sport/:matchId',async (req,res)=>{
    try{
        let matchId = req.params.matchId;
        let matchObj = await dream11mapper.find({tgMatchId: matchId});
        let obj = await utildb.find({});
        if(obj.length>0 && obj[0].dream11Hash && matchObj.length === 1){
            let req_match_obj = matchObj[0];
            let leftName = req_match_obj.leftName;
            let rightName = req_match_obj.rightName;
            let team_string = `${leftName}-vs-${rightName}`
            let req_hash = obj[0].dream11Hash;
            let response = null;
            let sport_index = 0;
            if(req.params.sport === 'cricket'){
                response = await axios.get(`${cricket_teams_one}${req_hash}${cricket_teams_two}${team_string}/${req_match_obj.dream11MatchId}${cricket_teams_three}${req.params.matchId}&team_names=${team_string}`);
            }
            else{
                sport_index = 1;
                response = await axios.get(`${football_teams_one}${req_hash}${football_teams_two}${team_string}/${req_match_obj.dream11MatchId}${football_teams_three}${req.params.matchId}&team_names=${team_string}`);
            }
            let role_name = [['WK','BAT','AR','BOWL'],['GK','DEF','MID','ST']]
            let data = response.data;
            let players_data = data.pageProps.matchDetailsAPIResponse.players;
            let lineup_status = data.pageProps.matchDetailsAPIResponse.match_details.lineups_available;
            let req_data = {}
            let left_players_data = [];
            let right_players_data = [];
            for(let i=0;i<players_data.length;i++){
                let p = players_data[i];
                let temp = {};
                temp["player_index"] = p.player_id;
                temp["name"] = p.player_name;
                temp["image"] = p.player_photo;
                temp["role"] = role_name[sport_index].indexOf(p.player_position);
                temp["team_index"] = p.is_home_team ? 0 : 1;
                temp["credits"] = 9;
                if(p.is_home_team){
                    left_players_data.push(temp);
                }
                else{
                    right_players_data.push(temp);
                }
            }
            req_data["left_players_data"] = left_players_data;
            req_data["right_players_data"] = right_players_data;
            req_data["left_team_name"] = data.pageProps.matchDetailsAPIResponse.match_details.home_team_short;
            req_data["right_team_name"] = data.pageProps.matchDetailsAPIResponse.match_details.away_team_short;
            req_data["left_team_logo"] = data.pageProps.matchDetailsAPIResponse.match_details.home_team_logo;
            req_data["right_team_logo"] = data.pageProps.matchDetailsAPIResponse.match_details.away_team_logo;
            req_data["lineup_available"] = lineup_status;
            let password = "coder_bobby_believer01_tg_software";
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
            status: 'fail',
            message: 'Something went wrong!'
        })
    }
})


module.exports = router