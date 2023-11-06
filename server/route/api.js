import express from 'express';
import apiController from '../controllers/apiController.js';

const apiRouter = express.Router();

apiRouter.get('/getUser', apiController.searchUser, (req, res) => {
  res.status(200).json('success');
})

export default apiRouter;