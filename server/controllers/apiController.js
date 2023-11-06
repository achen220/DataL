const apiController = {
  getSummonerInfo: async (req,res,next) => {
    const apiLink = process.env.SUMMONERINFOURL + req.body.summonerName + '?api_key=' + process.env.APIKEY
    try {
      const response = await fetch(apiLink)
      const userInfoJSON = await response.json()
      console.log(userInfoJSON)
      res.locals.userInfo = userInfoJSON;
      return next()
    } catch (err) {
      return next('cannot find user:', err.message)
    }
  }
}

export default apiController;