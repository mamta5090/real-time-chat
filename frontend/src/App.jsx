import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/Login';
import SignUp from './component/SignUp';
import Home from './page/Home';
import { useDispatch, useSelector } from 'react-redux';
import Profile from './component/Profile';
import GetCurrentUser from './customeHooks/getCurrentUser'; 
import getOtherUser from './customeHooks/GetOtherUser';
import {io} from 'socket.io-client'
import { serverUrl } from './main';
import { setOnlineUsers, setSocket } from './redux/userSlice';

const App = () => {
  const { userData,socket,onlineUsers } = useSelector((state) => state.user);
  const dispatch=useDispatch()

      useEffect(()=>{
        if(userData){
const socketio=io(`${serverUrl}`,{
  query:{
    userId:userData?._id
  }
})
dispatch(setSocket(socketio))

socketio.on("getOnlineUsers",(users)=>{
  dispatch(setOnlineUsers(users))
})
return ()=>socketio.close()
        }else{
          if(socket){
            socket.close()
            dispatch(setSocket(null))
          }
        }



      },[userData])


getOtherUser()
  return (
    <>
  
      <GetCurrentUser />
      <Routes>
        <Route path='/login' element={!userData ? <Login /> : <Navigate to="/" />} />
        <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to="/" />} />
        
      
        <Route 
          path='/profile' 
          element={userData ? <Profile /> : <Navigate to="/login" />} 
        />
        
        <Route path='/' element={userData ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
};

export default App;