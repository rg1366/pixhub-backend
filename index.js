import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v2 as cloudinary }  from "cloudinary";
dotenv.config();

import connectDB from './config/db.js'
import userRouter from './routes/users.js';
import postRouter from './routes/posts.js';
import commentRouter from './routes/comments.js';
import likeRouter from './routes/likes.js';
import authRouter from './routes/auth.js';
import path from "path"
import {fileURLToPath} from'url'
const cloudinaryConfig = cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true
})

const app = express();
app.use(cors());
app.use(express.json());
//app.use(express.static(path.join(__dirname, '../client/build')))
app.get('/', (req, res) => {
    res.send("Welcome to the Social Media Server")
})

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/likes', likeRouter);
app.use('/api/comments', commentRouter);
app.use('/api/auth', authRouter);

app.get("/get-signature", (req, res) => {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp
      },
      cloudinaryConfig.api_secret
    )
    res.json({ timestamp, signature })
})

//esmodule fix
// const __filename=fileURLToPath(import.meta.url)
// const __dirname=path.dirname(__filename)


//rest api
// app.use('*',function(req,res){
//     res.sendFile(path.join(__dirname,'../client/build/index.html'))
//    })
// function startServer(){ 
//   app.listen(process.env.PORT, async () => {
//       await connectDB();
//       console.log('Listening to PORT', process.env.PORT);
//   })
// }
// startServer();

app.listen(process.env.PORT, async () => {
  try{
      await connectDB()
      console.log("connected to DB successfully")
  }
  catch(err){
      console.log("error while connecting to DB")
      console.log(err)
  }
  console.log("Listening on port 8000")
})