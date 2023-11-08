const express = require('express')
const axios = require('axios')
var CryptoJS = require("crypto-js");
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
router.get('/api/fantasy/matches',async (req,res)=>{
    try{
        let req_data = []
        let vp = false;
        if(vp){
            let cricket_api = 'https://json.myfab11.com/fantasy/games-cricket-active.json';
            let football_api = 'https://json.myfab11.com/fantasy/games-football-active.json';
            let kabaddi_api = 'https://json.myfab11.com/fantasy/games-kabaddi-active.json';
            let resp1 = await axios.get(cricket_api);
            let resp2 = await axios.get(football_api);
            let resp3 = await axios.get(kabaddi_api);
            req_data = [[],[],[],[]];
            //cricket 
            resp1.data.result.games.forEach((match)=>{
                if(match.mode === 'regular'){
                    req_data[0].push(
                        {
                            id:match.id,
                            left_team_name:match.home_team_code,
                            right_team_name:match.away_team_code,
                            left_team_image:match.home_team.logo,
                            right_team_image:match.away_team.logo,
                            series_name: match.tournament.name,
                            match_time: match.game_date,
                            lineup_out:match.lineup_out
                        }
                    )
                }
            })
            //football
            resp2.data.result.games.forEach((match)=>{
                if(match.mode === 'regular'){
                    req_data[1].push(
                        {
                            id:match.id,
                            left_team_name:match.home_team_code,
                            right_team_name:match.away_team_code,
                            left_team_image:match.home_team.logo,
                            right_team_image:match.away_team.logo,
                            series_name: match.tournament.name,
                            match_time: match.game_date,
                            lineup_out:match.lineup_out
                        }
                    )
                }
            })
            //kabaddi
            resp3.data.result.games.forEach((match)=>{
                if(match.mode === 'regular'){
                    req_data[3].push(
                        {
                            id:match.id,
                            left_team_name:match.home_team_code,
                            right_team_name:match.away_team_code,
                            left_team_image:match.home_team.logo,
                            right_team_image:match.away_team.logo,
                            series_name: match.tournament.name,
                            match_time: match.game_date,
                            lineup_out:match.lineup_out
                        }
                    )
                }
            })

        }
        else{
            let response = await axios.get(all_matches_api)
            let cricket_api = 'https://json.myfab11.com/fantasy/games-cricket-active.json';
            let resp1 = await axios.get(cricket_api);
            let data = response.data

            //extra cricket data 
               //cricket 
               let cricket_list  = []
               resp1.data.result.games.forEach((match)=>{
                if(match.mode === 'regular'){
                    cricket_list.push(
                        {
                            id:match.id,
                            left_team_name:match.home_team_code,
                            right_team_name:match.away_team_code,
                            left_team_image:match.home_team.logo,
                            right_team_image:match.away_team.logo,
                            series_name: match.tournament.name,
                            match_time: match.game_date,
                            lineup_out:match.lineup_out
                        }
                    )
                }
            })

            //end 
          //  console.log(data)
            // 0 -> cricket, 1 -> football , 2 -> basketball 
            let category_list = [
                [1,2,3,4],
                [5],
                [7],
                [6]
            ]
           // console.log(data)
            for(let i =0;i<category_list.length;i++)
                req_data.push([])
            data.result.games.forEach((match)=>{
                category_list.forEach((array,index)=>{
                    if(array.includes(match.tournament.sport_category_id) && match.mode === 'regular')
                    {
                        req_data[index].push({
                            id:match.id,
                            left_team_name:match.home_team_code,
                            right_team_name:match.away_team_code,
                            left_team_image:match.home_team.logo,
                            right_team_image:match.away_team.logo,
                            series_name: match.tournament.name,
                            match_time: match.game_date,
                            lineup_out:match.lineup_out
                        })
                    }
                })
            })

            req_data[0] = cricket_list;

        }
       
        //extra data temporery
        let tm = extra_data.filter(d =>{
            let mt = new Date(d.match_time);
            let pt = new Date(Date.now());
            if(mt>pt) return true;
            else return false;
        })
        for(let i=0;i<tm.length;i++)
        req_data[0].push(tm[i]);
    
         //sorting the matches based on the time
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
    
        for(let i=0;i<req_data.length;i++)
        {
            let sport_array = req_data[i]
            let present_time = new Date(Date.now())
            for(let j=0;j<sport_array.length;j++)
            {
                let match = sport_array[j]
                let current_match_time = new Date(match.match_time)
                let time_obj = timeDifference(current_match_time,present_time)
                if(time_obj.days ==0 && time_obj.hours==0 && time_obj.minutes<=45 )
                {
                    let req_url = get_base_second_url(match.id)
                    console.log(req_url)
                    let new_response = await axios.get(req_url)
                    console.log(new_response)
                    if(new_response.data.game.lineupStatus === 'LINEUP_ANNOUNCED')
                        match.lineup_out = 1 
                }
            }
        }
        let password = "coder_bobby_believer01_tg_software";
        //do encryption here 
       let stuff_data = [[],[],[],[]];
        for(let i=0;i<req_data.length;i++){
            for(let j=0;j<req_data[i].length;j++){
                let vp = JSON.stringify(req_data[i][j]);
                let hashed_value = CryptoJS.AES.encrypt(vp,password).toString();
                stuff_data[i].push(hashed_value);
            }
        }
        
        res.status(200).json({
            status:'success',
            data: stuff_data
        })
    }
    catch(e){
        console.log('hi here')
        console.log(e)
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
           // console.log(response.data.game.home_team.players)
            if(response.data.game.home_team.players.length === 0 || response.data.game.away_team.players.length ===0)
            {
                if(response.data.game.home_team.players.length === 0)
                {
                    //right team having player data
                    response.data.game.away_team.players.forEach((player,index)=>{
                        if(response.data.game.home_team_code === player.team_code)
                        {
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
                        }
                        else 
                        {
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
                                player_index:index+1,
                                player_fixed_id: player.id
                            })
                        }
                    })
                }
                else 
                {
                    // left team having player data 
                    response.data.game.home_team.players.forEach((player,index)=>{
                        if(response.data.game.home_team_code === player.team_code)
                        {
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
                        }
                        else 
                        {
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
                                player_index:index+1,
                                player_fixed_id: player.id
                            })
                        }
                    })
                }
            }
            else {
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
                    console.log(kvp)
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
            }
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
            stuff_data.left_team_name = CryptoJS.AES.encrypt(req_data.left_team_name,password).toString();
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
