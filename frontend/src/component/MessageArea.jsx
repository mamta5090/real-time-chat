import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import { setSelectedUser } from '../redux/userSlice';
import { serverUrl } from '../main'; 

import { MdArrowBackIosNew } from "react-icons/md";
import { RiEmojiStickerFill } from "react-icons/ri";
import { AiOutlineSend } from "react-icons/ai";
import { IoIosImages } from "react-icons/io";
import { RxCross2 } from 'react-icons/rx';
import Reciver from './Reciver';
import Sender from './Sender';
import { setMessage,addMessage } from '../redux/messageSlice';

const MessageArea = () => {

  const image = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPicker, setShowPicker] = useState(false);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);   
  const [input, setInput] = useState('');


  const selectedUser = useSelector((state) => state.user.selectedUser);
  const {userData,socket} = useSelector((state) => state.user);
  const messages = useSelector((state) => state.message.messages);

  const onEmojiClick = (emojiData) => {
    setInput(prevInput => prevInput + emojiData.emoji);
    setShowPicker(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if(input.length==0 && backendImage!=null)
    if (!input.trim() && !backendImage) {
      return; 
    }
    try {
      const formData = new FormData();
      formData.append("message", input);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
        
      );
       const newMessage = {
        ...result.data,
        sender: {
          _id: result.data.sender
        }
      };
     dispatch(addMessage(newMessage))
console.log(result)
      setInput('');
      cancelImage();
      setFrontendImage(null)
      setBackendImage(null)
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  useEffect(()=>{
socket.on("newMessage",(mess)=>{
  setInput(setMessage([...messages,mess]))
})
  },[messages,setMessage])

 useEffect(() => {
    if (socket) {
      const handleNewMessage = (newMessage) => {
        dispatch(addMessage(newMessage));
      };
      socket.on("newMessage", handleNewMessage);
      return () => {
        socket.off("newMessage", handleNewMessage);
      };
    }
  },[messages,setMessage]) 

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file)); 
    }
  };

  const cancelImage = () => {
    setBackendImage(null);
    setFrontendImage(null);
    if (image.current) {
      image.current.value = "";
    }
  };


  return (
    <div className={`lg:w-[70%] ${selectedUser ? 'flex' : 'hidden'} lg:block w-full h-full bg-slate-50 border-1-2 border-gray-300`}>
    
      {selectedUser && (
        <div className='w-full h-screen flex flex-col'>
          
        
          <div className='w-full h-[100px] bg-[#1797c2] rounded-b-[30px] shadow-gray-400 shadow-lg flex flex-row items-center px-[20px] flex-shrink-0'>
            <div className='flex justify-start absolute top-10 cursor-pointer text-white' onClick={() => dispatch(setSelectedUser(null))}>
              <MdArrowBackIosNew />
            </div>
            <div className='relative w-[50px] h-[50px] rounded-full shadow-lg cursor-pointer ml-[30px]'>
              <img
                onClick={() => navigate('/profile')}
                src={selectedUser.image}
                alt="Profile"
                className='w-full h-full rounded-full object-cover border-2 border-[#20c7ff]'
              />
            </div>
            <h1 className='ml-[20px] font-semibold text-[20px] text-white'>{selectedUser.name}</h1>
          </div>
          <div className='flex-grow bg-white py-[20px] px-[10px] overflow-auto'>
           
          

        {messages.map((message) => {
              const senderId = message.sender?._id;
              const currentUserId = userData?._id;
              const isMine = senderId && currentUserId && String(senderId) === String(currentUserId);

              return isMine ? (
                <Sender
                  key={message._id}
                  image={message.image}
                  message={message.message}
                  createdAt={message.createdAt}
                  messageId={message._id}
                />
              )
                : (
                  <Reciver
                    key={message._id}
                    image={message.image}
                    message={message.message}
                    createdAt={message.createdAt}
                    messageId={message._id}
                  />
                )
            })}
  </div>
{showPicker && (
  <div className='absolute bottom-[100px] left-[20px] shadow z-20'>
    <EmojiPicker width={350} height={450} className="shadow-lg" onEmojiClick={onEmojiClick} />
  </div>
)}
          {showPicker && (
            <div className='absolute bottom-[100px] left-[20px] shadow z-20'>
              <EmojiPicker width={350} height={450} className="shadow-lg" onEmojiClick={onEmojiClick} />
             
            </div>
          )}
          <div className='w-full p-2 sm:p-4 bg-white shrink-0'>
            {frontendImage && (
   <div className='w-fit max-w-[500px] bg-[rgb(23,151,194)] px-[20px] py-[5px] text-white text-[19px] rounded-tr-none rounded-2xl relative  right-0 ml-auto shadow-gray-400 shadow-lg'>
                <img src={frontendImage} className='max-h-32 rounded shadow:lg' alt="Preview" />
                <button
                  onClick={cancelImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                >
                  <RxCross2 size={14} />
                </button>
              </div>
            )}
            <form className='flex w-full items-center gap-2 rounded-full bg-[#1797c2] p-2' onSubmit={handleSendMessage}>
              <button type="button" title="Add emoji" className="p-2 rounded-full text-white hover:bg-sky-600" onClick={() => setShowPicker(prev => !prev)}>
                <RiEmojiStickerFill className="w-6 h-6" />
              </button>
              <input type="file" accept='image/*' hidden ref={image} onChange={handleImage} />
              <input
                type="text"
                value={input}
                placeholder="Type a message..."
                className="flex-grow bg-transparent px-2 py-1 text-white placeholder-gray-200 outline-none text-lg"
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="button" title="Attach an image" className="p-2 rounded-full text-white hover:bg-sky-600" onClick={() => image.current.click()}>
                <IoIosImages className="w-6 h-6" />
              </button>
            {input.length>0 && backendImage!=null && (   <button type="submit" title="Send message" className="p-2 rounded-full text-white hover:bg-sky-600">
                <AiOutlineSend className="w-6 h-6" />
              </button>)}
            </form>
          </div>
        </div>
      )}


      {!selectedUser && (
        <div className='w-full h-full flex flex-col justify-center items-center'>
          <h1 className='text-gray-700 font-bold text-[30px]'>welcome to Chatly</h1>
          <span>Chat friendly</span>
        </div>
      )}
    </div>
  );
};

export default MessageArea;