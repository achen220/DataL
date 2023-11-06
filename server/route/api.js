import express from 'express';
import apiController from '../controllers/apiController.js';

const apiRouter = express.Router();

apiRouter.get('/getUser', apiController.sayHi, (req, res) => {
  res.status(200).json('success');
})

export default apiRouter;