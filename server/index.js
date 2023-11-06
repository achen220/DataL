
import express from "express";
import path from "path";
import apiRouter from "./route/api.js";
import dotenv from 'dotenv'

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 8000;
const app = express();

dotenv.config();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../src')));
app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, '../index.html'))
})

//redirect routers
app.use('/api',apiRouter)

//catchall unknown route
app.get('*', (req, res) =>  {
  res.status(404).json('<h1>catch-all route handler activated</h1>');
});

//global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'global error handler invoked' },
  }
  const errorObj = Object.assign(defaultErr, err);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(port, () => {
  console.log("Server listening on port", port);
});