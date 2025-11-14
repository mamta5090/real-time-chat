import {React,useEffect,useRef} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Sender = ({ image, message, createdAt }) => {
  const formattedTime = createdAt
    ? new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : "";

const selectedUser=useSelector((state)=>state.user.selectedUser)
const userData=useSelector((state)=>state.user.userData)
const navigate=useNavigate()

 const scrollRef = useRef(); 
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);
 
  return (
    <div className="flex justify-end mb-4">
      <div className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white p-3 rounded-2xl rounded-br-lg max-w-[70%] shadow-md">
         <div className='relative w-[50px] h-[50px] top-0 right-[-50px] rounded-full shadow-lg cursor-pointer ml-[30px]'>
              <img
                onClick={() => navigate('/profile')}
                src={userData.image}
                alt="Profile"
                className='w-full h-full rounded-full object-cover border-2 border-[#20c7ff]'
              />
            </div>
        {image && (
          <img
          ref={scrollRef}
            src={image}
            alt="Sent content"
            className="rounded-xl mb-2 max-w-xs"
          />
        )}
        
       {message && <span ref={scrollRef } className="text-sm leading-relaxed break-words">{message}</span>}

        {formattedTime && (
          <div className="text-right text-xs text-indigo-100 mt-2">
            {formattedTime}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sender;