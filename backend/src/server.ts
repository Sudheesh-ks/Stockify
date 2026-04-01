import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import { connectDB } from './config/mongodb';
import authRouter from './routes/auth.routes';
import productRouter from './routes/product.routes';
dotenv.config();

const app = express();

const PORT = process.env.PORT;

connectDB();

app.use(express.json());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);
app.use(cookieparser());

app.get('/', (req,res) => {
    res.send('API is running....')
})

app.use('/api', authRouter);
app.use('/api/products', productRouter);


app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`)
})