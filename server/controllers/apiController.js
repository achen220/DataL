import { filter } from "rxjs"

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
      //userInfoStructure
      // {
      //   "id": "Hxcc3DoLDfQ_1zeZMG7RIJvHWQsfIl8hOlNwkrfu8eH2Unk",
      //   "accountId": "tUg-kppR1wNewekBsrnUPolfB09VevFn4XS63-Lw-HLhng",
      //   "puuid": "mSV0NSAhUt0qKXEN1Kd7mPOqIEfelhQxmpsh5ZzKe8unBTl74l5YWaeSZFV-rgJlh2-NTvL4sfbsWQ",
      //   "name": "amcrsu",
      //   "profileIconId": 6337,
      //   "revisionDate": 1699185557000,
      //   "summonerLevel": 446
      // }
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
    const apiLink = `https://${continent}${process.env.MATCHCODEURL}${res.locals.userInfo.puuid}/ids?start=0&count=20&api_key=${process.env.APIKEY}`

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
    for (let i = 0; i < 20; i++) {
      const apiLink = `https://${res.locals.continent}${process.env.MATCHINFOURL}${res.locals.matchCodes[i]}?api_key=${process.env.APIKEY}`;
      apiLinkArray.push(apiLink);
    }
    try {
      const matchHistoryInfo = [];
      for (let i = 0; i < apiLinkArray.length; i++) {
        const response = await fetch(apiLinkArray[i]);
        const matchInfo = await response.json();
        const filteredMatchInfo = {};
        filteredMatchInfo.queueId = matchInfo.info.queueId;
        filteredMatchInfo.participants = matchInfo.metadata.participants;
        filteredMatchInfo.gameDuration = matchInfo.info.gameDuration;
        filteredMatchInfo.gameEndTime = matchInfo.info.gameEndTimestamp;
        const findMatchStatus = () => {
          let matchStatus;
          const participantsArray= matchInfo.info.participants;
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
        filteredMatchInfo.matchStatus = findMatchStatus()
        findMatchStatus();
        matchHistoryInfo.push(filteredMatchInfo);
      }
      res.locals.matchHistoryInfo = matchHistoryInfo;
      return next();
    } catch (err) {
      return next('failed to get match info:', err.message)
    }
  }
  
}

export default apiController;