import React from 'react'
import SideBar from '../component/SideBar'
import MessageArea from '../component/MessageArea'
import { useSelector } from 'react-redux'
//import  {setMessage}  from "../redux/userSlice"; 
import getMessage from '../customeHooks/getMessage'
const Home = () => {

  const selectedUser=useSelector((state)=>state.user.selectedUser)
  getMessage()
  return (
    <div className='flex h-[100vh] w-full'>
      <SideBar/>
      <MessageArea/>
    </div>
  )
}

export default Home
