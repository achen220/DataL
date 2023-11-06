
const apiController = {
  getSummonerInfo: async (req,res,next) => {
    const apiLink = `https://${req.body.region}1${process.env.IDURL}${req.body.summonerName}?api_key=${process.env.APIKEY}`
    try {
      const response = await fetch(apiLink)
      const userInfoJSON = await response.json()
      res.locals.userInfo = userInfoJSON;
      return next()
    } catch (err) {
      return next('cannot find user:', err.message)
    }
  }
}

export default apiController;