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
            console.log(data)
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
            let req_match_obj = matchObj[0];
            let req_hash = obj[0].dream11Hash;
            let response = null;
            let favour = 'equal';
            let number_of_teams = 20;
            if(req.body.teamsCount){
                number_of_teams = parseInt(req.body.teamsCount);
            }
            if(req.body.favour){
                favour = req.body.favour;
            }
            let sport_index = 0;
            if(req.params.sport === 'cricket'){
                //console.log(`${cricket_teams_one}${req_hash}${cricket_teams_two}${req.params.matchId}${cricket_teams_three}${req.params.matchId}`)
                response = await axios.get(`${cricket_teams_one}${req_hash}${cricket_teams_two}${req_match_obj.dream11MatchId}${cricket_teams_three}${req.params.matchId}`);
            }
            else{
                sport_index = 1;
                //console.log(`${football_teams_one}${req_hash}${football_teams_two}${req.params.matchId}${football_teams_three}${req.params.matchId}`)
                response = await axios.get(`${football_teams_one}${req_hash}${football_teams_two}${req_match_obj.dream11MatchId}${football_teams_three}${req.params.matchId}`);
                console.log(response)
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
          //  console.log('here once')
            //remove unlikely combinations 
            let filtered_teams = teams_data.filter(team =>{
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
                if(favour === 'left' && right>=6) return false;
                if(favour === 'right' && left>=6) return false;
                return true;
            }) 
          //  console.log('here twice')
            
            filtered_teams = filtered_teams.map((team,index)=>{
                let temp = {};
                temp["team_number"] = index+1;
                temp["captain"] = team.captain;
                temp["vice_captain"] = team.vice_captain;
                temp["credits"] = 99;
                temp["series_name"] = team.link;
                let final_team = [[],[],[],[]];
                for(let i=0;i<team.players.length;i++){
                    // console.log('hi')
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
        console.log(e)
        res.status(404).json({
            status: 'fail',
            message: 'Something went wrong!'
        })
    }
})

module.exports = router