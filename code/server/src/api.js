import express from 'express';
import cors from 'cors';

const api = express();

api.use(cors());
api.use(express.json())

api.get('/', (_, res) => {
  res.send('');
});