const express = require('express')
const axios = require('axios')
const router = express.Router()
let base_url_one = 'https://api.cricpick.in/games/view/'   
let base_url_two = '/1.1.json'
let all_matches_api = 'https://api.cricpick.in/games/listing/active/safe.json'



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







//cricket = 1,2,3,4 
//football = 5 
//basketball = 7
//lineupStatus: "LINEUP_ANNOUNCED"
router.get('/api/fantasy/matches',async (req,res)=>{
    let response = await axios.post(all_matches_api)
    let data = response.data
    // 0 -> cricket, 1 -> football , 2 -> basketball 
    let category_list = [
        [1,2,3,4],
        [5],
        [7],
        [6]
    ]
    let req_data = []
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
                let new_response = await axios.post(`${base_url_one}${match.id}${base_url_two}`)
                if(new_response.data.game.lineupStatus === 'LINEUP_ANNOUNCED')
                    match.lineup_out = 1 
            }
        }
    }
    res.status(200).json({
        status:'success',
        data: req_data
    })
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
    let response = await axios.post(`${base_url_one}${req.params.id}${base_url_two}`)
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
  
    if(response.data.game.home_team.players.length === 0 || response.data.game.away_team.players.length ===0)
    {
        if(response.data.game.home_team.players.length === 0)
        {
            //right team having player data
            response.data.game.away_team.players.forEach((player,index)=>{
                if(response.data.game.home_team_code === player.team_code)
                {
                    left_team_players.push({
                        name: player.name,
                        image: getPlayerImage(player.image),
                        playing: player.playing ===1? 1 : 0,
                        role: getRoleId(category_list,sport_category_id_list,player.position),
                        credits: Number(player.cost)/10,
                        points: player.points,
                        selected_by: player.selected_by,
                        team_index:0,
                        team_name: response.data.game.home_team_code,
                        player_index:index+1
                    })
                }
                else 
                {
                    right_team_players.push({
                        name: player.name,
                        image: getPlayerImage(player.image),
                        playing: player.playing ===1? 1 : 0,
                        role: getRoleId(category_list,sport_category_id_list,player.position),
                        credits: Number(player.cost)/10,
                        points: player.points,
                        selected_by: player.selected_by,
                        team_index:0,
                        team_name: response.data.game.away_team_code,
                        player_index:left_team_players.length+index+1
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
                    left_team_players.push({
                        name: player.name,
                        image: getPlayerImage(player.image),
                        playing: player.playing ===1? 1 : 0,
                        role: getRoleId(category_list,sport_category_id_list,player.position),
                        credits: Number(player.cost)/10,
                        points: player.points,
                        selected_by: player.selected_by,
                        team_index:0,
                        team_name: response.data.game.home_team_code,
                        player_index:index+1
                    })
                }
                else 
                {
                    right_team_players.push({
                        name: player.name,
                        image: getPlayerImage(player.image),
                        playing: player.playing ===1? 1 : 0,
                        role: getRoleId(category_list,sport_category_id_list,player.position),
                        credits: Number(player.cost)/10,
                        points: player.points,
                        selected_by: player.selected_by,
                        team_index:0,
                        team_name: response.data.game.away_team_code,
                        player_index:left_team_players.length+index+1
                    })
                }
            })
        }
    }
    else {
        //left team data 
        response.data.game.home_team.players.forEach((player,index)=>{
            left_team_players.push({
                name: player.name,
                image: getPlayerImage(player.image),
                playing: player.playing ===1? 1 : 0,
                role: getRoleId(category_list,sport_category_id_list,player.position),
                credits: Number(player.cost)/10,
                points: player.points,
                selected_by: player.selected_by,
                team_index:0,
                team_name: response.data.game.home_team_code,
                player_index:index+1
            })
        })
        //right team data 
        response.data.game.away_team.players.forEach((player,index)=>{
            right_team_players.push({
                name: player.name,
                image: getPlayerImage(player.image),
                playing: player.playing ===1? 1 : 0,
                role: getRoleId(category_list,sport_category_id_list,player.position),
                credits: Number(player.cost)/10,
                points: player.points,
                selected_by: player.selected_by,
                team_index:1,
                team_name: response.data.game.away_team_code,
                player_index:left_team_players.length+index+1
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
    res.status(200).json({
        status:'success',
        data: req_data
    })
})

module.exports = router