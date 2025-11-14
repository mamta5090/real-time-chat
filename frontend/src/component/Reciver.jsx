

import React, { useRef, useEffect } from 'react'; 
import dp from '../assets/dp.webp';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Reciver = ({ image, message, createdAt }) => {
  const formattedTime = createdAt
    ? new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : "";
const navigate=useNavigate()
const selectedUser=useSelector((state)=>state.user.selectedUser)
  const scrollRef = useRef(); 
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);
 

  return (
    <div className="flex justify-start mb-4"> 
      <div className="bg-gray-200 text-black p-3 rounded-2xl rounded-bl-lg max-w-[70%] shadow-md">
         <div className='relative w-[50px] h-[50px] rounded-full shadow-lg cursor-pointer ml-[30px]'>
              <img
                onClick={() => navigate('/profile')}
                src={selectedUser.image}
                alt="Profile"
                className='w-full h-full rounded-full object-cover border-2 border-[#20c7ff]'
              />
            </div>
        {image && (
          <img
          ref={scrollRef}
            src={image}
            alt="Received content"
            className="rounded-xl mb-2 max-w-xs"
          />
        )}
        
        {/* The ref is attached here during the render process */}
        {message && <p ref={scrollRef} className="text-sm leading-relaxed break-words">{message}</p>}

        {formattedTime && (
          <div className="text-right text-xs text-gray-500 mt-2">
            {formattedTime}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reciver;