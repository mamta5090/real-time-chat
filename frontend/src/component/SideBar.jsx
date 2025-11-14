import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dp from '../assets/dp.webp';
import { FcSearch } from "react-icons/fc";
import { RxCross2 } from "react-icons/rx";
import { IoLogOut } from "react-icons/io5";
import axios from 'axios';
import { setOtherUserData, setSearchData, setSelectedUser, setUserData } from '../redux/userSlice';
import { serverUrl } from '../main'; // Assuming serverUrl is correctly exported
import { useNavigate } from 'react-router-dom';
import { MdArrowBackIosNew } from "react-icons/md";

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- Data from Redux Store ---
  const userData = useSelector((state) => state.user.userData);
  const otherUserData = useSelector((state) => state.user.otherUserData);
  const onlineUsers = useSelector((state) => state.user.onlineUsers);
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const searchData = useSelector((state) => state.user.searchData);

  // --- Component State ---
  const [search, setSearch] = useState(false);
  const [input, setInput] = useState("");

  // --- Handlers ---
  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      // Clear all relevant user data from Redux on logout.
      dispatch(setUserData(null));
      dispatch(setOtherUserData([]));
      dispatch(setSelectedUser(null));
      dispatch(setSearchData([])); // Also clear any search data.
      navigate('/login');
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

  const handSearch = async (query) => {
    if (!query) {
      dispatch(setSearchData([]));
      return;
    }
    try {
      const response = await axios.get(`${serverUrl}/api/user/search?query=${query}`, { withCredentials: true });
      dispatch(setSearchData(response.data));
    } catch (error)
    {
      console.log("Search Error:", error);
    }
  };

  // --- Effects ---
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (input) {
        handSearch(input);
      } else {
        dispatch(setSearchData([]));
      }
    }, 300); // Debounce search to prevent API calls on every keystroke.

    return () => {
      clearTimeout(timerId); // Cleanup the timer.
    };
  }, [input, dispatch]);

  // --- Rendering Logic ---
  const usersToDisplay = search && input ? searchData : otherUserData;

  return (
    <div className={`lg:w-[30%] w-full h-full bg-slate-50 ${selectedUser ? 'hidden' : 'block'} lg:flex flex-col justify-between border-r-2 border-gray-300 relative`}>
      <div className='flex flex-col h-full'>
        {/* Top Header Section */}
        <div className='w-full px-5 pt-8 pb-4 flex-col bg-[#20c7ff] rounded-b-[30%] shadow-lg justify-center flex'>
          <div className='flex justify-start absolute top-10 left-4 cursor-pointer text-white' onClick={() => navigate(-1)}>
            <MdArrowBackIosNew size={24} />
          </div>
          <h1 className='text-white font-bold text-4xl'>chatly</h1>
          <div className='flex w-full items-center justify-between mt-4'>
            <h1 className='text-white text-lg'>Hi, {userData?.name}</h1>
            <div className='relative w-24 h-24 shadow-lg rounded-full cursor-pointer'>
              <img
                onClick={() => navigate('/profile')}
                src={userData?.image || dp}
                alt="Profile"
                className='w-full h-full rounded-full object-cover border-4 border-white'
              />
            </div>
          </div>
          <div className='w-full flex flex-row items-center gap-4 mt-4'>
            {!search ? (
              <>
                <div className='w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-md' onClick={() => setSearch(true)}>
                  <FcSearch size={22} />
                </div>
                <div className='flex w-full gap-4 overflow-x-auto pb-2'>
                  {otherUserData
                    ?.filter(user => onlineUsers?.includes(user._id))
                    .map(user => (
                      <div key={user._id} className='relative w-12 h-12 rounded-full shadow-lg cursor-pointer shrink-0'>
                        <img src={user.image || dp} alt="Profile" className='w-full h-full rounded-full object-cover border-4 border-white' />
                        <span className='w-3 h-3 rounded-full absolute bottom-0 right-0 bg-[#3aff20] border-2 border-white'></span>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <div className='w-full h-11 flex items-center px-4 bg-white rounded-full shadow-md gap-3'>
                <FcSearch size={22} />
                <input
                  type="text"
                  placeholder='Search user...'
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  className='w-full bg-transparent outline-none'
                  autoFocus
                />
                <RxCross2 onClick={() => { setSearch(false); setInput(""); }} className='cursor-pointer' size={22} />
              </div>
            )}
          </div>
        </div>

        {/* User List Section */}
        <div className='w-full mt-4 overflow-y-auto p-3 flex flex-col gap-3 flex-grow'>
          {usersToDisplay && usersToDisplay.length > 0 ? (
            usersToDisplay.map((user) => (
              <div
                key={user._id}
                onClick={() => dispatch(setSelectedUser(user))}
                className={`flex w-full items-center gap-4 p-2 rounded-lg cursor-pointer transition-colors shadow-md ${selectedUser?._id === user._id ? 'bg-sky-200' : 'bg-white hover:bg-sky-100'}`}
              >
                <div className='relative w-12 h-12 shrink-0'>
                  <img src={user.image || dp} alt={user.name} className='w-full h-full rounded-full object-cover border-2 border-[#20c7ff]' />
                  {onlineUsers?.includes(user._id) && (
                    <span className='w-3 h-3 rounded-full absolute bottom-0 right-0 bg-[#3aff20] border-2 border-white'></span>
                  )}
                </div>
                <p className='font-semibold text-gray-700 truncate'>{user.name || "No Name"}</p>
              </div>
            ))
          ) : (
            <p className='text-center text-gray-500 mt-10'>
              {search && input ? "No users found." : "Find users to start a chat."}
            </p>
          )}
        </div>

        {/* Logout Button Section */}
        <div className='p-4'>
          <div className='bg-[#20c7ff] w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg' onClick={handleLogout}>
            <IoLogOut className='text-white' size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;