// app.ts
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import listingsRouter from './routes/listings'
import uploadsRouter from './routes/uploads'
import authRouter from './routes/auth/signup' 
import loginRouter from './routes/auth/login' 
import autocompleteRoute from "./routes/autocomplete";
import inquiriesRoute from "./routes/inquiries";


dotenv.config()

const app = express()

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

app.use(express.json())

app.get('/health', (_, res) => res.send({ status: 'ok' }))

app.use('/api/listings', listingsRouter)
app.use('/api/uploads', uploadsRouter)
app.use('/api/auth', authRouter) 
app.use('/api/auth', loginRouter) 
app.use("/api/autocomplete", autocompleteRoute);
app.use("/api/inquiries", inquiriesRoute);

export default app
