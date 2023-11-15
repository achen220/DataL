const regionToContinent = {
  'AMERICAS': [ 'NA', 'BR', 'LAS', 'LAN'],
  'ASIA': [ 'KR', 'JP'],
  'SEA': [ 'PH', 'SG', 'TW', 'VN', 'TH'],
  'EUROPE': [ 'EUW', 'EUN']
}

const apiController = {
  getSummonerInfo: async (req,res,next) => {
    const apiLink = `https://${req.body.region}1${process.env.IDURL}${req.body.summonerName}?api_key=${process.env.APIKEY}`
    try {
      const response = await fetch(apiLink)
      const userInfo = await response.json()
      res.locals.userInfo = userInfo;

      return next();
    } catch (err) {
      return next('cannot find user:', err.message)
    }
  },
  getMatchHistoryCode: async (req,res,next) => {
    let continent;
    //convery region initial to continent name
    for (const cont in regionToContinent) {
      if (regionToContinent[cont].includes((req.body.region).toUpperCase())) {
        continent = cont;
        break;
      }
    }
    const apiLink = `https://${continent}${process.env.MATCHCODEURL}${res.locals.userInfo.puuid}/ids?start=0&count=35&api_key=${process.env.APIKEY}`
    try {
      const response = await fetch(apiLink);
      const matchCodes = await response.json();
      res.locals.matchCodes = matchCodes;
      res.locals.continent = continent;
      return next();
    } catch (err) {
      return next('failed to find match history code:', err.message)
    }
  },
  getMatchInfo: async (req,res,next) => {
    const apiLinkArray = [];
    for (let i = 0; i < res.locals.matchCodes.length; i++) {
      const apiLink = `https://${res.locals.continent}${process.env.MATCHINFOURL}${res.locals.matchCodes[i]}?api_key=${process.env.APIKEY}`;
      apiLinkArray.push(apiLink);
    }
    // console.log("matchHistory Link Array:", apiLinkArray)
    try {
      const matchHistoryInfo = [];
      for (let i = 0; i < apiLinkArray.length; i++) {
        const response = await fetch(apiLinkArray[i]);
        const matchInfo = await response.json();
        const filteredMatchInfo = {};
        if (matchInfo.info.gameMode !== 'CLASSIC') {
          continue;
        }
        const participantsArray= matchInfo.info.participants;
        filteredMatchInfo.queueId = matchInfo.info.queueId;
        filteredMatchInfo.participants = {
          blue: [],
          red: []
        };
        participantsArray.forEach((player,index) => {
          let userName = player.summonerName;
          //bringing current player champion and position to upper level of sent object
          if (userName === res.locals.userInfo.name){
            filteredMatchInfo.playerChampion = player.championName;
            filteredMatchInfo.playerPosition = player.individualPosition;
          }
          let playerStats = {};
          playerStats.name = userName;
          playerStats.position = player.individualPosition;
          playerStats.Champion = player.championName;
          playerStats.totalDamageDealt = player.totalDamageDealtToChampions;
          playerStats.deaths = player.deaths;
          playerStats.killParticipation = player.challenges.killParticipation;
          playerStats.totalMinionsKilled = player.totalMinionsKilled;
          playerStats.visionScore = player.visionScore;
          //determine which team each player is in
          if (player.teamId === 100) {
            filteredMatchInfo.participants.blue.push(playerStats)
          }
          else if (player.teamId === 200) {
            filteredMatchInfo.participants.red.push(playerStats)
          }
        })
        
        filteredMatchInfo.gameDuration = matchInfo.info.gameDuration;
        
        filteredMatchInfo.gameEndTime = matchInfo.info.gameEndTimestamp;
        const findMatchStatus = () => {
          let matchStatus;
          participantsArray.forEach((player) => {
            if (res.locals.userInfo.puuid === player.puuid)  {
              matchStatus = player.win;
              return;
            }
          })
          // Ensure that matchStatus is defined before returning
          if (matchStatus !== undefined) {
            return matchStatus;
          } else {
          // Handle the case where no match status was found
            throw new Error("Match status not found");
          }
        }
        filteredMatchInfo.matchStatus = findMatchStatus();
        matchHistoryInfo.push(filteredMatchInfo);
      }
      res.locals.matchHistoryInfo = matchHistoryInfo;
      return next();
    } catch (err) {
      console.log("there is an error", err)
      return next('failed to get match info:', err.message)
    }
  }
  
}

export default apiController;