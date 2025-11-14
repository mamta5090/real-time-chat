import React, { useEffect } from 'react'
import {serverUrl} from '../main'
import { setOtherUserData } from '../redux/userSlice'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'


const GetOtherUser = () => {
    let dispatch=useDispatch()
    let userData=useSelector((state)=>state.user.userData)


    useEffect(()=>{
        const fetchUser=async()=>{
            try {
            let result=await axios.get(`${serverUrl}/api/user/other`,{withCredentials:true})
            dispatch(setOtherUserData(result.data))
        } catch (error) {
            console.log(error)
        }
        }
        fetchUser();
    },[dispatch])
 return null
}

export default GetOtherUser
