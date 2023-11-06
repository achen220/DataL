import express from 'express';
import apiController from '../controllers/apiController.js';

const apiRouter = express.Router();

apiRouter.post('/getUser', apiController.getSummonerInfo, (req, res) => {
  return res.status(200).json('userHasBeenFound');
})

export default apiRouter;