import express from 'express'
import { editProfile, getAllProfile, getCurrentUser, search } from '../controller/user.controller.js'
import isAuth from '../middleware/isAuth.js'
import {upload} from '../middleware/multer.js'

const userRouter=express.Router()

userRouter.get("/current",isAuth, getCurrentUser)
userRouter.put("/profile",isAuth,upload.single("image"), editProfile)
userRouter.get('/other',isAuth,getAllProfile)
userRouter.get("/search", isAuth, search);
export default userRouter
