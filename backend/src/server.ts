import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import { connectDB } from './config/mongodb';
import authRouter from './routes/auth.routes';
import productRouter from './routes/product.routes';
import customerRouter from './routes/customer.routes';
import saleRouter from './routes/sale.routes';
dotenv.config();

const app = express();

const PORT = process.env.PORT;

connectDB();

app.use(express.json());
app.set("trust proxy", 1);
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
app.use('/api/customers', customerRouter);
app.use('/api/sales', saleRouter);


app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`)
})