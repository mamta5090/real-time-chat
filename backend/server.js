import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.route.js';
import cookieParser from 'cookie-parser';
import messageRouter from './routes/message.route.js';
import { app,server ,io} from './socket/socket.js';

dotenv.config();



const PORT = process.env.PORT || 8000;

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));

app.use((req, res, next) => {
  req.io = io;
  next(); // Pass control to the next middleware or route handler
});

app.use(bodyParser.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    res.send("server is running")
})
app.use("/api/auth",authRouter)
app.use('/api/user', userRouter);
app.use('/api/message', messageRouter);

connectDB();

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
