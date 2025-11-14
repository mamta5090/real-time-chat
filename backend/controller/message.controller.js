import uploadOnCloudinary from "../config/cloudinary.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { getReceiverSocketId,userSocketMap } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    console.log("Incoming message body:", req.body);
    console.log("File:", req.file);
    console.log("Receiver ID:", req.params.receiver);
    console.log("Sender:", req.userId);

    const sender = req.userId;
    const receiver = req.params.receiver;
    const { message } = req.body;
const io=req.io;
    if (!sender || !receiver) {
      return res.status(400).json({ message: "Missing sender or receiver ID" });
    }

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    // Find or create conversation
   let conversation = await Conversation.findOne({
  participants: { $all: [sender, receiver] },
});

    // Create message
  const newMessage = await Message.create({
  sender,
  receiver,
  message,
  image,

});

    if (!conversation) {
      // Create a new conversation if none exists
      conversation = await Conversation.create({
        participants: [sender, receiver],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }
const receiverSocketId=getReceiverSocketId(receiver)
if(receiverSocketId){
  io.to(receiverSocketId).emit("newMessage",newMessage)
}
    return res.status(200).json(newMessage);
  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({ message: "send message error", error: error.message });
  }
};

export const getMessage=async(req,res)=>{
    try {
        let sender=req.userId
        let receiver = req.params.receiver; 
        console.log(receiver)
        let conversation=await Conversation.findOne({participants:{$all:[sender,receiver]}}).populate("messages")
        if(!conversation){
            return res.status(400).json([])
        }
        return res.status(200).json(conversation.messages)
    } catch (error) {
      console.error("Get message error:", error);
        return res.status(500).json({message:"get message error"})
    }
}