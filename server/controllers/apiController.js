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
        matchHistoryInfo.push(matchInfo);
      }
      res.locals.matchHistoryInfo = matchHistoryInfo;
      return next();
    } catch (err) {
      return next('failed to get match info:', err.message)
    }
  }
  
}

export default apiController;