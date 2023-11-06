import express from 'express';
import apiController from '../controllers/apiController.js';

const apiRouter = express.Router();

apiRouter.post('/getUser', apiController.getSummonerInfo, apiController.getMatchHistoryCode, apiController.getMatchInfo, (req, res) => {
  return res.status(200).json(res.locals.matchHistoryInfo);
})

export default apiRouter;