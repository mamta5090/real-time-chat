import express from "express";
import { getMessage, sendMessage } from "../controller/message.controller.js";
import isAuth from "../middleware/isAuth.js";
import { upload } from "../middleware/multer.js";


const messageRouter=express.Router()

messageRouter.post('/send/:receiver',isAuth,upload.single("image"), sendMessage)
messageRouter.get('/get/:receiver',isAuth,getMessage)

export default messageRouter