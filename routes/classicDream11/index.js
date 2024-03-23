const express = require('express')
const automaticMapper = require('./../../models/automaticmapper')
const utildb = require('./../../models/Utility')
const classicDream11Mapper = require('./../../models/classicdream11mapper')
const axios = require('axios')
var CryptoJS = require("crypto-js");
const router = express.Router();

//static stuff 
let mainLoadBalanceClassic = []
let mainLoadMatchIdClassic = []
//second
let secondLoadBalanceClassic = []
let secondLoadMatchIdClassic = []

let create_load = (matchId)=>{
    mainLoadBalanceClassic.push({ matchId: matchId, loadArray:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],createdAt: Date.now()})
    secondLoadBalanceClassic.push({ matchId: matchId, loadArray:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],createdAt: Date.now()})
    mainLoadMatchIdClassic.push(matchId)
    secondLoadMatchIdClassic.push(matchId)
}
let remove_old_load = ()=>{
      //load balance intialization
      mainLoadBalanceClassic = mainLoadBalanceClassic.filter(d =>{
        let left = new Date(d.createdAt)
        let right = new Date(Date.now())
        let hours = (right-left)/3600000;
        if(hours<24) return true;
        else return false;
    })
    secondLoadBalanceClassic = secondLoadBalanceClassic.filter(d =>{
        let left = new Date(d.createdAt)
        let right = new Date(Date.now())
        let hours = (right-left)/3600000;
        if(hours<24) return true;
        else return false;
    })
    mainLoadMatchIdClassic = mainLoadBalanceClassic.map(d=> d.matchId)
    secondLoadMatchIdClassic = secondLoadBalanceClassic.map(d=> d.matchId)
}

//match list
let get_classic_dream11_match_list = async (sport)=>{
   try{
    let class_dream11_match_list_url = 'https://www.dream11.com/graphql/query/react-native/shme-upcoming-matches';
    let util_db_list = await utildb.find({})
    let auth_token = util_db_list[0].classic_dream11_token_one;
    let header_data =  {
        headers: {
          "Authorization": `Bearer ${auth_token}`,
          'Content-Type': 'application/json',
            "guest-id": "14c3cb3c-5093-463d-a5a3-c1bbbb631565",
            "app_version":"5.21.2",
            "device": "androidfull",
            "deviceid":"2d3ea3da5cc24097",
            "locale":"en-US",
            "siteid":"1",
            "user-agent":"Dalvik/2.1.0 (Linux; U; Android 9; SM-G977N Build/LMY48Z)",
            "a1":"thmG6ty/YjwvaSxJjnrUBX0wxTkPx1dSoAytzrOiLXY2E7ApiLiQMv9cA90Zyd6P25si46bw/8aI1YcMlAzcRAjof+WxYXOqYaBzJQawgVGs9Hy+/xeXQdmCeb+p+eTUnUQEkGBY9KkS4V9B+cYeqa/uLp+CdR7XfTmBUEQHV+I=",
            "ek1":"0gBwPxY/tGPOUkphuqAKzA==",
            "ek2":"thmG6ty/YjwvaSxJjnrUBef3IMF1L3fMQtB0JiLya/o=",
            "version":1337
        }
    }
    let req_obj = {
        "query": "\n    query ShmeUpcomingMatches($slug: String!, $wlsId: Int!, $pageCount: Int!, $excludedTourIdsForPromotionalTourMatches: [Int!], $filterValues: [FilterValues!] = null, $filterFetch: Boolean = true, $personalizedVariant: String = null, $matchSection: MatchSection!, $page: Int!, $showCustomMatches: Boolean = false, $shouldShowMarqueePlayers: Boolean = false, $pageSize: Int = null, $excludedTourIdsForSuggestedTourMatches: [Int!], $shouldShowSuggestedTours: Boolean = false) {\n  site(slug: $slug) {\n    slug\n    name\n    filter(wlsId: $wlsId) @include(if: $filterFetch) {\n      id\n      name\n      hasOptions\n      filterOptions {\n        id\n        name\n      }\n    }\n    matches: matches(\n      excludeTourIds: $excludedTourIdsForPromotionalTourMatches\n      page: $pageCount\n      statuses: [NOT_STARTED, UP_COMING]\n      filters: $filterValues\n      personalizedVariant: $personalizedVariant\n      pageSize: $pageSize\n    ) {\n      edges {\n        ...UpcomingMatchesMatchData\n      }\n      pageInfo {\n        nextPage\n      }\n    }\n    customMatches(\n      excludeTourIds: $excludedTourIdsForPromotionalTourMatches\n      matchSection: $matchSection\n      page: $page\n    ) @include(if: $showCustomMatches) {\n      edges {\n        ...MatchData\n        ...ForyouContests\n      }\n      pageInfo {\n        nextPage\n      }\n    }\n    suggestedTours(\n      excludedTourIdsForSuggestedTourMatches: $excludedTourIdsForSuggestedTourMatches\n      statuses: [NOT_STARTED, UP_COMING]\n      wlsId: $wlsId\n    ) @include(if: $shouldShowSuggestedTours) {\n      tours {\n        tourInfo {\n          id\n          name\n          slug\n          tourTag {\n            tag\n            icon\n          }\n        }\n        matches {\n          ...MatchData\n        }\n      }\n    }\n  }\n}\n    \n    fragment UpcomingMatchesMatchData on Match {\n  marqueePlayers @include(if: $shouldShowMarqueePlayers) {\n    players {\n      name\n      nameInitial\n      image\n    }\n    tooltipText\n  }\n  id\n  name\n  startTime\n  matchDetail\n  status\n  lineupStatus\n  isFantasyLiveMatchAvailable\n  contestSummary {\n    tag\n    amountInWords\n  }\n  matchHighlight {\n    text\n    color\n  }\n  squads {\n    squadColorPalette\n    id\n    name\n    shortName\n    flag {\n      src\n    }\n    flagWithName {\n      src\n    }\n    fullName\n  }\n  tour {\n    id\n    name\n    slug\n  }\n  liveBroadcast {\n    artwork {\n      src\n    }\n  }\n  ...GUserSubscribedNotification\n}\n    \n\n    fragment GUserSubscribedNotification on Match {\n  isNotificationSubscribed\n  notificationSubscriptions {\n    name\n    notificationSubscriptionOptions {\n      id\n      type\n      name\n      isSelected\n    }\n  }\n}\n    \n\n    fragment MatchData on Match {\n  id\n  name\n  startTime\n  matchDetail\n  status\n  lineupStatus\n  isFantasyLiveMatchAvailable\n  contestSummary {\n    tag\n    amountInWords\n  }\n  matchHighlight {\n    text\n    color\n  }\n  squads {\n    squadColorPalette\n    id\n    name\n    shortName\n    flag {\n      src\n    }\n    flagWithName {\n      src\n    }\n    fullName\n  }\n  tour {\n    id\n    name\n    slug\n  }\n  liveBroadcast {\n    artwork {\n      src\n    }\n  }\n  ...GUserSubscribedNotification\n}\n    \n\n    fragment ForyouContests on Match {\n  id\n  name\n  foryouContests {\n    id\n    name\n    description\n    totalContestCount\n    displayContestCount\n    displayContests {\n      _id\n      isInfiniteEntry\n      currentPrizeDisplayText\n      isBulkJoinEnabled\n      contestType\n      contestName\n      numberOfWinners\n      prizeAmount {\n        amount\n        code\n        symbol\n      }\n      winnerBreakup {\n        amount {\n          amount\n          code\n          symbol\n        }\n        endRank\n        prizeDisplayText\n        startRank\n        winnerPercent\n      }\n      currentPrizeAmount {\n        amount\n        symbol\n        code\n      }\n      hasJoined\n      contestSize\n      currentSize\n      entryFee {\n        amount\n        code\n        symbol\n      }\n      id\n      isFreeEntry\n      site\n      contestCategory\n      teamName\n      prizeDisplayText\n      behaviour\n      isPartnerContest\n      effectiveEntryFee {\n        amount\n        code\n        symbol\n      }\n      winnerPercent\n      inviteCode\n      explanation\n      joinedTeamsCount\n      maxAllowedTeams\n      isMultipleEntry\n      isGuaranteed\n      match {\n        id\n        status\n        name\n        startTime\n        isFantasyLiveMatchAvailable\n        isFantasyCommentaryAvailable\n      }\n    }\n  }\n}\n    ",
        "variables": {
            "slug": sport.toString(),
            "pageCount": 1,
            "excludedTourIdsForPromotionalTourMatches": [],
            "wlsId": 1,
            "personalizedVariant": "mcp_default_vintage",
            "matchSection": "FORYOU",
            "page": 1,
            "showCustomMatches": false,
            "shouldShowMarqueePlayers": false,
            "pageSize": 6,
            "shouldShowSuggestedTours": false,
            "excludedTourIdsForSuggestedTourMatches": []
        }
    }
    let response = await axios.post(class_dream11_match_list_url,req_obj,header_data)
    let data =  response.data;
    if(data){
        let match_list = data.data.site.matches.edges;
        let req_match_list = []
        for(let i=0;i<match_list.length;i++){
            let p = match_list[i]
            req_match_list.push({
                d11_match_id: p.id,
                start_time: p.startTime,
                left_team_id: p.squads[0].id,
                left_shortcut_name: p.squads[0].shortName,
                right_team_id: p.squads[1].id,
                right_shortcut_name: p.squads[1].shortName,
                left_team_image: p.squads[0].flag[0].src,
                right_team_image: p.squads[1].flag[0].src,
                tour_name: p.tour.name,
                tour_id: p.tour.id
            })
        }
        return req_match_list
    }
    else return null;
   }
   catch(e){
    return null;
   }
}
//player list 
let get_classic_dream11_player_list = async (matchId,sport,tourId)=>{
    try{
        let class_dream11_player_list_url = 'https://www.dream11.com/graphql/query/react-native/shme-create-team'  
        let util_db_list = await utildb.find({})
        let auth_token = util_db_list[0].classic_dream11_token_one;
        //console.log(auth_token)
        let header_data =  {
            headers: {
              "Authorization": `Bearer ${auth_token}`,
              'Content-Type': 'application/json',
                "guest-id": "14c3cb3c-5093-463d-a5a3-c1bbbb631565",
                "app_version":"5.21.2",
                "device": "androidfull",
                "deviceid":"2d3ea3da5cc24097",
                "locale":"en-US",
                "siteid":"1",
                "user-agent":"Dalvik/2.1.0 (Linux; U; Android 9; SM-G977N Build/LMY48Z)",
                "a1":"thmG6ty/YjwvaSxJjnrUBX0wxTkPx1dSoAytzrOiLXY2E7ApiLiQMv9cA90Zyd6P25si46bw/8aI1YcMlAzcRAjof+WxYXOqYaBzJQawgVGs9Hy+/xeXQdmCeb+p+eTUnUQEkGBY9KkS4V9B+cYeqa/uLp+CdR7XfTmBUEQHV+I=",
                "ek1":"0gBwPxY/tGPOUkphuqAKzA==",
                "ek2":"thmG6ty/YjwvaSxJjnrUBef3IMF1L3fMQtB0JiLya/o=",
                "version":1337
            }
        }
        let req_data = {
            "query": "\n    query ShmeCreateTeam($site: String!, $tourId: Int!, $teamId: Int = -1, $matchId: Int!, $snapshotId: String = null, $teamSelection: TeamSelectionType = null, $marketplaceEnabled: Boolean = false, $sendDifferentLineupsStatusKey: Boolean = true, $isPreLineupsEnabled: Boolean = false, $isPostLineupsSinglePageCTEnabled: Boolean = false, $isTeamPlannerEnabled: Boolean = false, $suggestedTeamId: Int, $userStrategyId: Int) {\n  site(slug: $site) {\n    id\n    name\n    showTeamCombination {\n      count\n    }\n    teamPreviewArtwork {\n      src\n    }\n    teamCriteria {\n      totalCredits\n      maxPlayerPerSquad\n      totalPlayerCount\n    }\n    roles {\n      id\n      artwork {\n        src\n      }\n      color\n      name\n      pointMultiplier\n      shortName\n    }\n    playerTypes {\n      id\n      name\n      minPerTeam\n      maxPerTeam\n      shortName\n      artwork {\n        src\n      }\n    }\n    tour(id: $tourId) {\n      id\n      name\n      match(id: $matchId) {\n        id\n        displayLineupOrder\n        lineupOrderExpected\n        showMatchConditions\n        guru\n        userTeamsCount\n        matchHighlight {\n          color\n          text\n        }\n        squads {\n          flag {\n            src\n          }\n          squadColorPalette\n          flagWithName {\n            src\n          }\n          id\n          jerseyColor\n          name\n          shortName\n          fullName\n          playerTextBgColor\n          playerTextFontColor\n        }\n        showPlayerImages\n        startTime\n        status\n        tossResult\n        tossInfo {\n          wonBySquadId\n          wonBySquadShortName\n          decision\n          tossText\n        }\n        substitutionInfo {\n          maxSubsAllowed\n          status\n          teamPreviewText\n        }\n        players(\n          teamId: $teamId\n          snapshotId: $snapshotId\n          teamSelection: $teamSelection\n          sendDifferentLineupsStatusKey: $sendDifferentLineupsStatusKey\n          userStrategyId: $userStrategyId\n          suggestedTeamId: $suggestedTeamId\n        ) {\n          artwork {\n            src\n          }\n          squad {\n            id\n            name\n            jerseyColor\n            shortName\n            playerTextBgColor\n            playerTextFontColor\n          }\n          credits\n          statistics {\n            selectionRate\n            role {\n              id\n              selectionRate\n            }\n          }\n          id\n          name\n          nameInitial\n          points\n          type {\n            id\n            maxPerTeam\n            minPerTeam\n            name\n            shortName\n          }\n          isSelected\n          isSelectedInSharedTeam\n          roleInSharedTeam {\n            id\n            artwork {\n              src\n            }\n            color\n            name\n            pointMultiplier\n            shortName\n          }\n          role {\n            id\n            artwork {\n              src\n            }\n            color\n            name\n            pointMultiplier\n            shortName\n          }\n          lineupOrder\n          battingOrder @include(if: $isPostLineupsSinglePageCTEnabled)\n          isAvailable @include(if: $isPreLineupsEnabled)\n          lineupStatus {\n            status\n            text\n            color\n          }\n          playingStyleIcon {\n            src\n          }\n          substituteInfo {\n            isSub\n            priority\n            replacedWith {\n              id\n              role {\n                shortName\n              }\n            }\n          }\n        }\n        sharedTeamLegends {\n          iconUrl {\n            src\n          }\n          text\n        }\n        playingStyleLegends {\n          iconUrl {\n            src\n          }\n          text\n        }\n        userTeam(id: $teamId) @include(if: $marketplaceEnabled) {\n          marketPlaceTeamDetails {\n            expertId\n            expertTeamId\n          }\n        }\n        roundLineupStatus @include(if: $isPostLineupsSinglePageCTEnabled)\n        preLineupsNote @include(if: $isPreLineupsEnabled)\n        lineupGroups @include(if: $isPostLineupsSinglePageCTEnabled) {\n          squadId\n          groups {\n            name\n            displayText\n            color\n            order\n            playerStatuses\n            displayBattingOrder\n          }\n        }\n      }\n    }\n  }\n  isTeamPlannerAvailable(roundId: $matchId) @include(if: $isTeamPlannerEnabled) {\n    isOpenForUsers\n    areTeamGenerated\n  }\n  me {\n    isGuestUser\n    teamName\n    userType\n  }\n}\n    ",
            "variables": {
                "matchId": parseInt(matchId),
                "site": sport.toString(),
                "tourId": parseInt(tourId),
                "snapshotId": null,
                "teamSelection": null,
                "marketplaceEnabled": true,
                "isPreLineupsEnabled": true,
                "isPostLineupsSinglePageCTEnabled": true,
                "sendDifferentLineupsStatusKey": true,
                "isTeamPlannerEnabled": true,
                "suggestedTeamId": null,
                "userStrategyId": null
            }
        }
       // console.log(req_data)
        let response = await axios.post(class_dream11_player_list_url,req_data,header_data)
       // console.log(response.data)
        let data =  response.data;
        if(data){
           // console.log(data)
            let role = [0,1,3,0,2]
           // console.log(data.data.site.tour.match.squads)
            let team_id_list = [data.data.site.tour.match.squads[0].id,data.data.site.tour.match.squads[1].id]
           // console.log(team_id_list)
            let player_list = data.data.site.tour.match.players;
           // console.log(player_list)
            let req_player_list = []
            for(let i=0;i<player_list.length;i++){
                let p = player_list[i]
                req_player_list.push({
                    d11_player_id: p.id,
                    player_name: p.name,
                    player_role: role[p.type.id],
                    credits: p.credits,
                    player_image: p.artwork[0].src,
                    player_selection_percentage: p.statistics.selectionRate,
                    captain_selection_percentage: p.statistics.role[0].selectionRate,
                    vicecaptain_selection_percentage: p.statistics.role[1].selectionRate,
                    team_index: team_id_list.indexOf(p.squad.id),
                    team_id: p.squad.id,
                })
            }
            let req_data = {player_list: req_player_list,match_id: matchId,sport:sport,tour_id: tourId}
            return req_data
        }
        else return null;
    }
    catch(e){
       // console.log(e)
        return null;
    }
}
//classic dream11 mapper 
let classic_dream11_cricket_mapper = async ()=>{
    try{
        remove_old_load();
        let cricket_api = 'https://json.myfab11.com/fantasy/games-cricket-active.json';
        let tg_cricket_data = await axios.get(cricket_api);
        let d11_cricket_data = await get_classic_dream11_match_list("cricket")
        //cricket 
        let tg_cricket_match_list = []
        tg_cricket_data.data.result.games.forEach((match)=>{
            if(match.mode === 'regular'){
                tg_cricket_match_list.push(
                    {
                        id:match.id,
                        left_team_name:match.home_team_code,
                        right_team_name:match.away_team_code,
                        left_team_image:match.home_team.logo,
                        right_team_image:match.away_team.logo,
                        series_name: match.tournament.name,
                        match_time: match.game_date,
                        lineup_out:match.lineup_out,
                    }
                )
            }
        })
       // console.log(tg_cricket_match_list)
        for(let i=0;i<d11_cricket_data.length;i++){
            let dp = d11_cricket_data[i];
            let d_value = dp.left_shortcut_name.toString().toLowerCase()+dp.right_shortcut_name.toString().toLowerCase();
            for(let j=0;j<tg_cricket_match_list.length;j++){
                let fp = tg_cricket_match_list[j]
                let f_value = fp.left_team_name.toString().toLowerCase()+fp.right_team_name.toString().toLowerCase();
                let f_time = new Date(fp.match_time).getTime();
                let d_time = new Date(dp.start_time).getTime();
                let ipl_flag = (dp.tour_name.toString()=== 'Indian T20 League' && fp.series_name.toString() === 'Indian T20 League') && (f_time === d_time); // false after ipl
                //console.log(ipl_flag)
                if((d_value === f_value) || ipl_flag){
                    //we find the match here 
                    let d11_player_data = await get_classic_dream11_player_list(dp.d11_match_id,'cricket',dp.tour_id)
                    let f_link = 'https://json.myfab11.com/fantasy/game/playerlist-'+fp.id.toString()+'.json'
                    let f11_player_data = await axios.get(f_link)
                    let f11_player_list = []
                    let d11_player_list = d11_player_data.player_list;
                   // console.log(f11_player_data.data)
                    for(let k=0;k<f11_player_data.data.game.away_team.players.length;k++){
                        let obj = f11_player_data.data.game.away_team.players[k]
                        f11_player_list.push({
                            tg_player_id: obj.id,
                            name: obj.name
                        })
                    }
                    for(let k=0;k<f11_player_data.data.game.home_team.players.length;k++){
                        let obj = f11_player_data.data.game.home_team.players[k]
                        f11_player_list.push({
                            tg_player_id: obj.id,
                            name: obj.name
                        })
                    }
                   // console.log(f11_player_list,d11_player_list)
                    let req_player_mapper_list = [];
                    for(let k=0;k<f11_player_list.length;k++){
                        let fab_player = f11_player_list[k];
                        for(let a=0;a<d11_player_list.length;a++){
                            let dream_player = d11_player_list[a]
                            if(fab_player.name.toString().toLowerCase()===dream_player.player_name.toString().toLowerCase()){
                                req_player_mapper_list.push({
                                    tgPlayerId: fab_player.tg_player_id,
                                    dream11PlayerId: dream_player.d11_player_id,
                                    d11_credits: dream_player.credits,
                                    d11_player_image: dream_player.player_image,
                                    d11_player_selection_percentage: dream_player.player_selection_percentage,
                                    d11_captain_selection_percentange: dream_player.captain_selection_percentage,
                                    d11_vicecaptain_selection_percentage: dream_player.vicecaptain_selection_percentage,
                                })
                            }
                        }
                    }
                    //console.log(req_player_mapper_list)
                    let req_mapper_obj = {}
                    req_mapper_obj["sport"]="cricket";
                    req_mapper_obj["tgMatchId"]=fp.id;
                    req_mapper_obj["dream11MatchId"]=dp.d11_match_id;
                    req_mapper_obj["tourId"] = dp.tour_id
                    req_mapper_obj["left_team_image"] = dp.left_team_image
                    req_mapper_obj["right_team_image"] = dp.right_team_image
                    req_mapper_obj["playerMapping"] = req_player_mapper_list;
                    let vp_check_list = await classicDream11Mapper.find({tgMatchId:fp.id.toString()})
                    if(vp_check_list.length>0){
                        let vp_check = vp_check_list[0];
                        vp_check.tgMatchId = fp.id;
                        vp_check.dream11MatchId = dp.d11_match_id;
                        vp_check.tourId = dp.tour_id;
                        vp_check.playerMapping = req_player_mapper_list;
                        vp_check.createdAt = Date.now()
                        await vp_check.save()
                    }
                    else{
                        await classicDream11Mapper.create(req_mapper_obj);
                    }
                    //create new if needed
                    if(!mainLoadMatchIdClassic.includes(fp.id.toString())){
                        create_load(fp.id.toString())
                    }
                }
            }
        }
    }
    catch(e){
        console.log(e)
    }
}
//football
let classic_dream11_football_mapper = async ()=>{
    try{
        let football_api = 'https://json.myfab11.com/fantasy/games-football-active.json';
        let tg_football_data = await axios.get(football_api);
        let d11_football_data = await get_classic_dream11_match_list("football")
          //football
          let tg_football_match_list = []
          tg_football_data.data.result.games.forEach((match)=>{
              if(match.mode === 'regular'){
                  tg_football_match_list.push(
                      {
                          id:match.id,
                          left_team_name:match.home_team_code,
                          right_team_name:match.away_team_code,
                          left_team_image:match.home_team.logo,
                          right_team_image:match.away_team.logo,
                          series_name: match.tournament.name,
                          match_time: match.game_date,
                          lineup_out:match.lineup_out,
                      }
                  )
              }
          })
          for(let i=0;i<d11_football_data.length;i++){
              let dp = d11_football_data[i];
              let d_value = dp.left_shortcut_name.toString().toLowerCase()+dp.right_shortcut_name.toString().toLowerCase();
              for(let j=0;j<tg_football_match_list.length;j++){
                  let fp = tg_football_match_list[j]
                  let f_value = fp.left_team_name.toString().toLowerCase()+fp.right_team_name.toString().toLowerCase();
                  if(d_value === f_value){
                      //we find the match here 
                      let d11_player_data = await get_classic_dream11_player_list(dp.d11_match_id,'football',dp.tour_id)
                      let f_link = 'https://json.myfab11.com/fantasy/game/playerlist-'+fp.id.toString()+'.json'
                      let f11_player_data = await axios.get(f_link)
                      let f11_player_list = []
                      let d11_player_list = d11_player_data.player_list;
                     // console.log(f11_player_data.data)
                      for(let k=0;k<f11_player_data.data.game.away_team.players.length;k++){
                          let obj = f11_player_data.data.game.away_team.players[k]
                          f11_player_list.push({
                              tg_player_id: obj.id,
                              name: obj.name
                          })
                      }
                      for(let k=0;k<f11_player_data.data.game.home_team.players.length;k++){
                          let obj = f11_player_data.data.game.home_team.players[k]
                          f11_player_list.push({
                              tg_player_id: obj.id,
                              name: obj.name
                          })
                      }
                     // console.log(f11_player_list,d11_player_list)
                      let req_player_mapper_list = [];
                      for(let k=0;k<f11_player_list.length;k++){
                          let fab_player = f11_player_list[k];
                          for(let a=0;a<d11_player_list.length;a++){
                              let dream_player = d11_player_list[a]
                              if(fab_player.name.toString().toLowerCase()===dream_player.player_name.toString().toLowerCase()){
                                  req_player_mapper_list.push({
                                      tgPlayerId: fab_player.tg_player_id,
                                      dream11PlayerId: dream_player.d11_player_id
                                  })
                              }
                          }
                      }
                    //  console.log(req_player_mapper_list)
                      let req_mapper_obj = {}
                      req_mapper_obj["sport"]="football";
                      req_mapper_obj["tgMatchId"]=fp.id;
                      req_mapper_obj["dream11MatchId"]=dp.d11_match_id;
                      req_mapper_obj["tourId"] = dp.tour_id
                      req_mapper_obj["playerMapping"] = req_player_mapper_list;
                      let vp_check_list = await classicDream11Mapper.find({tgMatchId:fp.id.toString()})
                      if(vp_check_list.length>0){
                          let vp_check = vp_check_list[0];
                          vp_check.tgMatchId = fp.id;
                          vp_check.dream11MatchId = dp.d11_match_id;
                          vp_check.tourId = dp.tour_id;
                          vp_check.playerMapping = req_player_mapper_list;
                          vp_check.createdAt = Date.now()
                          await vp_check.save()
                      }
                      else{
                          await classicDream11Mapper.create(req_mapper_obj);
                      }
                      //create new if needed
                      if(!mainLoadMatchIdClassic.includes(fp.id.toString())){
                      create_load(fp.id.toString())
                      }  
                  }
              }
          }
    }
    catch(e){

    }
}
//kabaddi 
let classic_dream11_kabaddi_mapper = async ()=>{
    try{
        let kabaddi_api = 'https://json.myfab11.com/fantasy/games-kabaddi-active.json';
        let tg_kabaddi_data = await axios.get(kabaddi_api);
        let d11_kabaddi_data = await get_classic_dream11_match_list("kabaddi")
         //kabaddi
         let tg_kabaddi_match_list = []
         tg_kabaddi_data.data.result.games.forEach((match)=>{
             if(match.mode === 'regular'){
                 tg_kabaddi_match_list.push(
                     {
                         id:match.id,
                         left_team_name:match.home_team_code,
                         right_team_name:match.away_team_code,
                         left_team_image:match.home_team.logo,
                         right_team_image:match.away_team.logo,
                         series_name: match.tournament.name,
                         match_time: match.game_date,
                         lineup_out:match.lineup_out,
                     }
                 )
             }
         })
         for(let i=0;i<d11_kabaddi_data.length;i++){
             let dp = d11_kabaddi_data[i];
             let d_value = dp.left_shortcut_name.toString().toLowerCase()+dp.right_shortcut_name.toString().toLowerCase();
             for(let j=0;j<tg_kabaddi_match_list.length;j++){
                 let fp = tg_kabaddi_match_list[j]
                 let f_value = fp.left_team_name.toString().toLowerCase()+fp.right_team_name.toString().toLowerCase();
                 if(d_value === f_value){
                     //we find the match here 
                     let d11_player_data = await get_classic_dream11_player_list(dp.d11_match_id,'kabaddi',dp.tour_id)
                     let f_link = 'https://json.myfab11.com/fantasy/game/playerlist-'+fp.id.toString()+'.json'
                     let f11_player_data = await axios.get(f_link)
                     let f11_player_list = []
                     let d11_player_list = d11_player_data.player_list;
                    // console.log(f11_player_data.data)
                     for(let k=0;k<f11_player_data.data.game.away_team.players.length;k++){
                         let obj = f11_player_data.data.game.away_team.players[k]
                         f11_player_list.push({
                             tg_player_id: obj.id,
                             name: obj.name
                         })
                     }
                     for(let k=0;k<f11_player_data.data.game.home_team.players.length;k++){
                         let obj = f11_player_data.data.game.home_team.players[k]
                         f11_player_list.push({
                             tg_player_id: obj.id,
                             name: obj.name
                         })
                     }
                    // console.log(f11_player_list,d11_player_list)
                     let req_player_mapper_list = [];
                     for(let k=0;k<f11_player_list.length;k++){
                         let fab_player = f11_player_list[k];
                         for(let a=0;a<d11_player_list.length;a++){
                             let dream_player = d11_player_list[a]
                             if(fab_player.name.toString().toLowerCase()===dream_player.player_name.toString().toLowerCase()){
                                 req_player_mapper_list.push({
                                     tgPlayerId: fab_player.tg_player_id,
                                     dream11PlayerId: dream_player.d11_player_id
                                 })
                             }
                         }
                     }
                   //  console.log(req_player_mapper_list)
                     let req_mapper_obj = {}
                     req_mapper_obj["sport"]="kabaddi";
                     req_mapper_obj["tgMatchId"]=fp.id;
                     req_mapper_obj["dream11MatchId"]=dp.d11_match_id;
                     req_mapper_obj["tourId"] = dp.tour_id
                     req_mapper_obj["playerMapping"] = req_player_mapper_list;
                     let vp_check_list = await classicDream11Mapper.find({tgMatchId:fp.id.toString()})
                     if(vp_check_list.length>0){
                         let vp_check = vp_check_list[0];
                         vp_check.tgMatchId = fp.id;
                         vp_check.dream11MatchId = dp.d11_match_id;
                         vp_check.tourId = dp.tour_id;
                         vp_check.playerMapping = req_player_mapper_list;
                         vp_check.createdAt = Date.now()
                         await vp_check.save()
                     }
                     else{
                         await classicDream11Mapper.create(req_mapper_obj);
                     }
                     //create new if needed
                     if(!mainLoadMatchIdClassic.includes(fp.id.toString())){
                     create_load(fp.id.toString())
                     }  
                 }
             }
         }
     
        }
        catch(e){
         console.log(e)
        }
}
//remove classic dream11 mappers 
let remove_classic_dream11_mapper = async ()=>{
    let mapper_list = await classicDream11Mapper.find({})
    for(let i=0;i<mapper_list.length;i++){
        let obj = mapper_list[i];
        let left = new Date(obj.createdAt)
        let right = new Date(Date.now())
        let hours = (right-left)/3600000;
        if(hours>12){
            await obj.remove();
        }
    }
}
setInterval(classic_dream11_cricket_mapper,1000*3)
setInterval(classic_dream11_football_mapper,1000*4)
setInterval(classic_dream11_kabaddi_mapper,1000*5)
setInterval(remove_classic_dream11_mapper,1000*60*60)
//api info
//match list
router.get('/api/classic/dream11/match-list/:sport', async (req,res)=>{
    try{
        let sport = req.params.sport;
        let data = await get_classic_dream11_match_list(sport)
        if(data){
            res.status(200).json({
                status:'success',
                data: data,
                message:'Data Fetched Successfully!'
            })
        }
        else{
            res.status(404).json({
                status:'fail',
                message:'Error while fetching data'
            })
        }
    }
    catch(e){
        res.status(404).json({
            status:'fail',
            message:'Error while fetching data'
        })
    }
})
//player list
router.get('/api/classic/dream11/player-list/:matchId/:sport/:tourId', async (req,res)=>{
    try{
        let matchId = req.params.matchId;
        let sport = req.params.sport;
        let tourId = req.params.tourId;
        let data = await get_classic_dream11_player_list(matchId,sport,tourId)
        //console.log(data)
        if(data){
            res.status(200).json({
                status:'success',
                data: data,
                message:'Data Fetched Successfully!'
            })
        }
        else{
            res.status(404).json({
                status:'fail',
                message:'Error while fetching data'
            })
        }
    }
    catch(e){
        res.status(404).json({
            status:'fail',
            message:'Error while fetching data'
        })
    }
})
//create team into dream11 and fetch the link 
router.post('/api/classic/dream11/addteam', async (req,res)=>{
    try{
        let sport_array = ['cricket','football','kabaddi']
        let captain_value = [1,3,5]
        let vice_captain_value=[2,4,6]
        let tg_id = req.body.tgMatchId.toString();
        let index = mainLoadMatchIdClassic.indexOf(tg_id)
        if(index===-1){
            create_load(tg_id);
            index = mainLoadMatchIdClassic.indexOf(tg_id)
        }
        let first = mainLoadBalanceClassic[index]
        let second = secondLoadBalanceClassic[index]
        let first_cnt=0,second_cnt=0;
        for(let i=1;i<=20;i++)
        {
            first_cnt=first_cnt+first.loadArray[i]
            second_cnt=second_cnt+second.loadArray[i]
        }
        //body data
        let player_data = req.body.playerData;
        let captain_data = req.body.captainData;
        let vice_captain_data = req.body.vicecaptainData;
        let classic_obj_list = await classicDream11Mapper.find({tgMatchId: tg_id})
        let classic_obj = classic_obj_list[0];
        //formating the team
        let d11_players = []
        for(let i=0;i<player_data.length;i++){
            let obj = {
                id: parseInt(player_data[i])
            }
            if(player_data[i] === captain_data){
                let s_index = sport_array.indexOf(classic_obj.sport)
                obj["role"] ={id:captain_value[s_index]}
            }
            else if(player_data[i] === vice_captain_data){
                let s_index = sport_array.indexOf(classic_obj.sport)
                obj["role"] ={id:vice_captain_value[s_index]}
            }
            else
                obj["role"] = null
            d11_players.push(obj);
        }
        let req_obj = {}
        req_obj["matchId"] = parseInt(classic_obj.dream11MatchId)
        req_obj["tourId"] = parseInt(classic_obj.tourId)
        req_obj["site"] = classic_obj.sport;
        req_obj["players"] = d11_players;
        req_obj["substitutes"]=[]
        req_obj["sourceMetadata"] = null
        //save team
        if(first_cnt<=second_cnt){
            //main line 
            let flag_index = -1;
            for(let i=1;i<=20;i++){
                if(mainLoadBalanceClassic[index].loadArray[i]===0){
                    flag_index = i;
                    mainLoadBalanceClassic[index].loadArray[i] = 1;
                    break;
                }
            }
            if(flag_index === -1){
                res.status(404).json({
                    status:'fail',
                    message:'Please try again!!'
                })
                return;
            }
            req_obj["teamId"]=flag_index
            let class_dream11_save_team_url = 'https://www.dream11.com/graphql/mutation/react-native/shme-create-user-team';
            let util_db_list = await utildb.find({})
            let auth_token = util_db_list[0].classic_dream11_token_one;
            let header_data =  {
                headers: {
                  "Authorization": `Bearer ${auth_token}`,
                  'Content-Type': 'application/json',
                    "guest-id": "14c3cb3c-5093-463d-a5a3-c1bbbb631565",
                    "app_version":"5.21.2",
                    "device": "androidfull",
                    "deviceid":"2d3ea3da5cc24097",
                    "locale":"en-US",
                    "siteid":"1",
                    "user-agent":"Dalvik/2.1.0 (Linux; U; Android 9; SM-G977N Build/LMY48Z)",
                    "a1":"thmG6ty/YjwvaSxJjnrUBX0wxTkPx1dSoAytzrOiLXY2E7ApiLiQMv9cA90Zyd6P25si46bw/8aI1YcMlAzcRAjof+WxYXOqYaBzJQawgVGs9Hy+/xeXQdmCeb+p+eTUnUQEkGBY9KkS4V9B+cYeqa/uLp+CdR7XfTmBUEQHV+I=",
                    "ek1":"0gBwPxY/tGPOUkphuqAKzA==",
                    "ek2":"thmG6ty/YjwvaSxJjnrUBef3IMF1L3fMQtB0JiLya/o=",
                    "version":1337
                }
            }
            let req_data = {
                "query": "\n    mutation ShmeCreateUserTeam($teamId: Int, $matchId: Int!, $players: [PlayerInput]!, $tourId: Int!, $site: String!, $substitutes: [SubstituteInput!], $sourceMetadata: CreateTeamSourceData) {\n  createUserTeam(\n    teamId: $teamId\n    matchId: $matchId\n    players: $players\n    tourId: $tourId\n    site: $site\n    substitutes: $substitutes\n    sourceMetadata: $sourceMetadata\n  ) {\n    id\n  }\n}\n    ",
                "variables": req_obj
            }
          //  console.log(req_obj)
            axios.post(class_dream11_save_team_url,req_data,header_data)
            .then(vp_res=>{
               // console.log(vp_res.data)
                let classic_snapshot_url = 'https://www.dream11.com/graphql/mutation/react-native/save-team-snapshot'
                let snap_shot_data = {
                    teamId: vp_res.data.data.createUserTeam.id,
                    roundId: parseInt(classic_obj.dream11MatchId)
                }
                let final_snapshot_data = {
                    "query": "\n    mutation SaveTeamSnapshot($teamId: Int!, $roundId: Int!) {\n  saveTeamSnapshot(teamId: $teamId, roundId: $roundId) {\n    snapshotId\n  }\n}\n    ",
                    "variables": snap_shot_data
                }
                axios.post(classic_snapshot_url,final_snapshot_data,header_data)
                .then(snap_res=>{
                    //console.log(snap_res.data.data.saveTeamSnapshot.snapshotId)
                    mainLoadBalanceClassic[index].loadArray[flag_index]=0;
                    let link_build = `https://www.dream11.com/team/${classic_obj.sport}/${classic_obj.dream11MatchId}/${classic_obj.tourId}/${snap_res.data.data.saveTeamSnapshot.snapshotId}`
                    let password = "coder_bobby_believer01_tg_software";
                    let stuff_data = CryptoJS.AES.encrypt(JSON.stringify({"link": link_build}),password).toString();
                    res.status(200).json({
                        status:'success',
                        data: stuff_data
                    })
                })
                .catch(e=>{
                   // console.log(e)
                    mainLoadBalanceClassic[index].loadArray[flag_index]=0;
                    res.status(404).json({
                        status:'fail',
                        message:'Error while transfering the team!'
                    })
                    return;
                })
            })
            .catch(e=>{
               // console.log(e)
                mainLoadBalanceClassic[index].loadArray[flag_index]=0;
                res.status(404).json({
                    status:'fail',
                    message:'Error while transfering the team!'
                })
            })
        }
        else{
            //second line
              let flag_index = -1;
              for(let i=1;i<=20;i++){
                  if(secondLoadBalanceClassic[index].loadArray[i]===0){
                      flag_index = i;
                      secondLoadBalanceClassic[index].loadArray[i] = 1;
                      break;
                  }
              }
              if(flag_index === -1){
                  res.status(404).json({
                      status:'fail',
                      message:'Please try again!!'
                  })
                  return;
              }
              req_obj["teamId"]=flag_index
              let class_dream11_save_team_url = 'https://www.dream11.com/graphql/mutation/react-native/shme-create-user-team';
              let util_db_list = await utildb.find({})
              let auth_token = util_db_list[0].classic_dream11_token_two;
              let header_data =  {
                  headers: {
                    "Authorization": `Bearer ${auth_token}`,
                    'Content-Type': 'application/json',
                      "guest-id": "14c3cb3c-5093-463d-a5a3-c1bbbb631565",
                      "app_version":"5.21.2",
                      "device": "androidfull",
                      "deviceid":"2d3ea3da5cc24097",
                      "locale":"en-US",
                      "siteid":"1",
                      "user-agent":"Dalvik/2.1.0 (Linux; U; Android 9; SM-G977N Build/LMY48Z)",
                      "a1":"thmG6ty/YjwvaSxJjnrUBX0wxTkPx1dSoAytzrOiLXY2E7ApiLiQMv9cA90Zyd6P25si46bw/8aI1YcMlAzcRAjof+WxYXOqYaBzJQawgVGs9Hy+/xeXQdmCeb+p+eTUnUQEkGBY9KkS4V9B+cYeqa/uLp+CdR7XfTmBUEQHV+I=",
                      "ek1":"0gBwPxY/tGPOUkphuqAKzA==",
                      "ek2":"thmG6ty/YjwvaSxJjnrUBef3IMF1L3fMQtB0JiLya/o=",
                      "version":1337
                  }
              }
              let req_data = {
                  "query": "\n    mutation ShmeCreateUserTeam($teamId: Int, $matchId: Int!, $players: [PlayerInput]!, $tourId: Int!, $site: String!, $substitutes: [SubstituteInput!], $sourceMetadata: CreateTeamSourceData) {\n  createUserTeam(\n    teamId: $teamId\n    matchId: $matchId\n    players: $players\n    tourId: $tourId\n    site: $site\n    substitutes: $substitutes\n    sourceMetadata: $sourceMetadata\n  ) {\n    id\n  }\n}\n    ",
                  "variables": req_obj
              }
             // console.log(req_obj)
              axios.post(class_dream11_save_team_url,req_data,header_data)
              .then(vp_res=>{
                  //console.log(vp_res.data)
                  let classic_snapshot_url = 'https://www.dream11.com/graphql/mutation/react-native/save-team-snapshot'
                  let snap_shot_data = {
                      teamId: vp_res.data.data.createUserTeam.id,
                      roundId: parseInt(classic_obj.dream11MatchId)
                  }
                  let final_snapshot_data = {
                      "query": "\n    mutation SaveTeamSnapshot($teamId: Int!, $roundId: Int!) {\n  saveTeamSnapshot(teamId: $teamId, roundId: $roundId) {\n    snapshotId\n  }\n}\n    ",
                      "variables": snap_shot_data
                  }
                  axios.post(classic_snapshot_url,final_snapshot_data,header_data)
                  .then(snap_res=>{
                     // console.log(snap_res)
                      secondLoadBalanceClassic[index].loadArray[flag_index]=0;
                      let link_build = `https://www.dream11.com/team/${classic_obj.sport}/${classic_obj.dream11MatchId}/${classic_obj.tourId}/${snap_res.data.data.saveTeamSnapshot.snapshotId}`
                      let password = "coder_bobby_believer01_tg_software";
                      let stuff_data = CryptoJS.AES.encrypt(JSON.stringify({"link": link_build}),password).toString();
                      res.status(200).json({
                          status:'success',
                          data: stuff_data
                      })
                  })
                  .catch(e=>{
                    //console.log(e)
                      secondLoadBalanceClassic[index].loadArray[flag_index]=0;
                      res.status(404).json({
                          status:'fail',
                          message:'Error while transfering the team!'
                      })
                      return;
                  })
              })
              .catch(e=>{
                //console.log(e)
                  secondLoadBalanceClassic[index].loadArray[flag_index]=0;
                  res.status(404).json({
                      status:'fail',
                      message:'Error while transfering the team!'
                  })
              })
        }
    }
    catch(e){
       // console.log(e)
        res.status(404).json({
            status:'fail',
            message:'Error while transfering the team!'
        })
    }
})


// router.get('/api/getotp',async (req,res)=>{
//     try{
//         let auth_url = 'https://api.dream11.com/auth/passwordless/init'
//         let auth_vp_data = {
//             "phoneNumber": "6281735219",
//             "channel": "sms"
//         }
        
//         axios.post(auth_url, auth_vp_data,{
//             headers: {
//                 'Content-Type': 'application/json',
//                 "guest-id": "14c3cb3c-5093-463d-a5a3-c1bbbb631565",
//                 "app_version":"5.21.2",
//                 "device": "androidfull",
//                 "deviceid":"2d3ea3da5cc24097",
//                 "locale":"en-US",
//                 "siteid":"1",
//                 "user-agent":"Dalvik/2.1.0 (Linux; U; Android 9; SM-G977N Build/LMY48Z)",
//                 "a1":"thmG6ty/YjwvaSxJjnrUBX0wxTkPx1dSoAytzrOiLXY2E7ApiLiQMv9cA90Zyd6P25si46bw/8aI1YcMlAzcRAjof+WxYXOqYaBzJQawgVGs9Hy+/xeXQdmCeb+p+eTUnUQEkGBY9KkS4V9B+cYeqa/uLp+CdR7XfTmBUEQHV+I=",
//                 "ek1":"0gBwPxY/tGPOUkphuqAKzA==",
//                 "ek2":"thmG6ty/YjwvaSxJjnrUBef3IMF1L3fMQtB0JiLya/o=",
//                 "version":1337
//             },
           
//         })      
//         .then((response) => {
//             console.log(response.data)
//         })
//         .catch((error) => {
//             console.log('error dream11')
//         })

//     }
//     catch(e){
//         console.log('error')
//     }
// })

module.exports = router;