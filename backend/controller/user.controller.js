import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

export const getCurrentUser=async(req,res)=>{
    try {
        const userId=req.userId
        let user=await User.findById(userId).select("-password")
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        console.error("GET CURRENT USER ERROR:", error);
        return res.status(500).json({message:"current user error"})
    }
}

export const editProfile=async(req,res)=>{
    try {
        let {name}=req.body
        let image;
        if(req.file){
            image=await uploadOnCloudinary(req.file.path)
        }
        let user=await User.findByIdAndUpdate(req.userId,{
            name,
            image
        },{new:true})
        console.log(user)
        return res.status(200).json(user)
        
    }catch(error){
        console.error("EDIT PROFILE ERROR:", error);
    return res.status(500).json({message:"edit profile error"})
}
}


export const getAllProfile=async(req,res)=>{
    try {
        const user=await User.find({_id:{$ne:req.userId}}).select("-password")
        return res.status(200).json(user)
    } catch (error) {
        console.log("GET ALL PROFILE ERROR:", error);
        return res.status(500).json({message:"get all profile error"})
    }
}

export const search = async (req, res) => {
    try {
        const { query } = req.query;
        const loggedInUserId = req.userId; // Get the ID of the user making the request

        if (!query) {
            return res.status(400).json({ message: "Search query is required." });
        }

        const searchPattern = new RegExp(query, "i");

        // Find users that match the search pattern AND are not the current user
        const users = await User.find({
            _id: { $ne: loggedInUserId }, // *** FIX: Exclude the logged-in user from search results ***
            $or: [
                { name: { $regex: searchPattern } },
                // Assuming you have a 'username' field in your User model
                // If not, you can remove the line below
                { username: { $regex: searchPattern } }
            ]
        }).select("-password"); // Exclude passwords from the results

        return res.status(200).json(users);

    } catch (error) {
        console.error("Error in search controller:", error);
        return res.status(500).json({ message: "An internal server error occurred." });
    }
};