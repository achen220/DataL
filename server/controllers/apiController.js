const apiController = {
  getSummonerInfo: (req,res,next) => {
    try {
      return next()
    } catch (err) {
      return next('cannot find user:', err.message)
    }
  }
}

export default apiController;