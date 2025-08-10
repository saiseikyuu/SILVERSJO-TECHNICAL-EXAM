import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import listingsRouter from './routes/listings';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => res.send({ status: 'ok' }));

app.use('/api/listings', listingsRouter);
// Future routes: /api/auth/*, /api/uploads

export default app;
