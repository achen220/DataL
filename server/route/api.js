import express from 'express';
import apiController from '../controllers/apiController.js';

const apiRouter = express.Router();

apiRouter.post('/getUser', apiController.getSummonerInfo, (req, res) => {
  res.status(200).json('success');
})

export default apiRouter;