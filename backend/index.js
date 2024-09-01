import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/database.js';
import authRouter from './routes/AuthRoutes.js';
import path from 'path';
import contactRouter from './routes/ContactRoutes.js';
import setupSocket from './socket.js';
import messageRouter from './routes/messagesRoutes.js';
const __dirname = path.resolve();


dotenv.config();

//app config
const app = express();
const port = process.env.PORT || 3000;
// const databaseUrl = process.env.databaseUrl;

//middleware
app.use(cors({
    origin:[process.env.ORIGIN],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true
}));
app.use("/uploads/profiles",express.static("uploads/profiles"));
app.use(cookieParser());
app.use(express.json());

//db connection
connectDB();

//api endpoint
app.use("/api/auth",authRouter);
app.use("/api/contacts",contactRouter);
app.use("/api/messages",messageRouter);

app.get("/",(req,res) => {
    res.send("Server is running...");
});

const server = app.listen(port,() => {
    console.log('Server is running...');
});

//connect socket
setupSocket(server);

