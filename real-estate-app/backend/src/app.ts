import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import listingsRouter from './routes/listings';
import uploadsRouter from './routes/uploads';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => res.send({ status: 'ok' }));

app.use('/api/listings', listingsRouter);
app.use('/api/uploads', uploadsRouter);
// Future routes: /api/auth/*, /api/uploads

export default app;
