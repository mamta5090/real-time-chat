import User from "../models/user.model.js";
import genToken from "../config/token.js";
import bcrypt from 'bcryptjs';

export const SignUp=async(req,res)=>{
    try {
         const {name,password,email}=req.body;
         const exit=await User.findOne({email})
        if(!name || !password ){
            return res.status(400).json({message:"name and password are required"})
        }
        if(exit){
            return res.status(400).json({message:"user is allerady exit"})
        }
        if(password.length<6){
            return res.status(400).json({message:"password must be 6 character long"})
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const user=await User.create({
            name,
            email,
            password:hashedPassword,
        })

        const token=await genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            maxAge:30*24*60*60*1000,
            sameSite:"Strict" 
        })
        res.status(201).json(user)
    } catch (error) {
        return res.status(500).json({message:"failed to SignUp"})
    }
}

export const Login=async(req,res)=>{
   try {
    const {email,password}=req.body;
  const user=await User.findOne({email})
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(400).json({message:"wrong password"})
    }
    const token=await genToken(user._id)
    res.cookie("token",token,{
        httpOnly:true,
        secure:false,
        maxAge:30*24*60*60*1000,
        sameSite:"Strict"
    })
    return res.status(200).json(user)
   } catch (error) {
    return res.status(500).json({message:"failed to login"})
   }
}

export const Logout=async(req,res)=>{
    try {
        res.cookie("token","",{maxAge:0})
        return res.status(200).json({message:"logout successfully"})

    }catch (error) {
        return res.status(500).json({message:"failed to logout"})
    }
}
