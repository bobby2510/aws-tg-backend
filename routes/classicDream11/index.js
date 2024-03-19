const express = require('express')
const automaticMapper = require('./../../models/automaticmapper')
const utildb = require('./../../models/Utility')
const axios = require('axios')
var CryptoJS = require("crypto-js");

const router = express.Router();


//function to fetch the match list by sport flag 


router.get('/api/classic/dream11/match-list/:sport', async (req,res)=>{
    try{
        let sport = req.params.sport;
        let class_dream11_match_list_url = 'https://www.dream11.com/graphql/query/react-native/shme-upcoming-matches';
        let util_db_list = await utildb.find({})
        let auth_token = util_db_list[0].classic_dream11_token_one;
     //   console.log(auth_token)
        let header_data =  {
            headers: {
              authorization: `Bearer ${auth_token}`,
              version: `1337`,
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
                "pageSize": 20,
                "shouldShowSuggestedTours": false,
                "excludedTourIdsForSuggestedTourMatches": []
            }
        }
       // console.log(req_obj,auth_token)
        //calling the api 
        await axios.post(class_dream11_match_list_url,req_obj,header_data)
        .then(res=>{
            res.status(404).json({
                status:'success',
                data:res.data,
                message:'Error while fetching data'
            })
        })
        .catch(e=>{
            res.status(404).json({
                status:'fail',
                message:'Something went wrong'
            })
        })
      
    }
    catch(e){
        res.status(404).json({
            status:'fail',
            message:'Error while fetching data'
        })
    }
})

module.exports = router;