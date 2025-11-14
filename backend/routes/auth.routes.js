import express from "express";
import { SignUp ,Logout, Login} from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup",SignUp)
authRouter.post("/login",Login)
authRouter.get("/logout",Logout)

export default authRouter;