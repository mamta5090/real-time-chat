import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {serverUrl} from '../main'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const Login = () => {
  const navigate=useNavigate()
  const dispatch=useDispatch()
const userData=useSelector((state)=>state.user.userData)

    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
     const [show,setShow]=useState(false)
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState()

   const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const result = await axios.post(
      `${serverUrl}/api/auth/login`,
      { email, password },
      { withCredentials: true }
    );
   dispatch(setUserData(result.data));
   console.log(result.data);
    setLoading(false);
      navigate("/profile");
  } catch (error) {
    console.log(error);
    setLoading(false);
    setError(error.response?.data?.message || "Something went wrong");
  }
};

    
        
  return (
    <div className='w-full h-[100vh] bg-slate-200 flex items-center justify-center'>
      <div className='w-full flex  max-w-[500px] h-[600px] bg-white rounded-lg shadow-gray-400 shadow-lg flex-col gap-[10px]'>
<div className='w-full h-[200px] bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg justify-center flex items-center'>
<h1 className='text-gray-600 font-bold text-[30px]'>welcome to </h1>
<span className='text-[30px] text-white flex gap-2'>chatly</span>
</div>

<form onSubmit={handleLogin} className='w-full flex flex-col gap-[20px] items-center'>

<input
onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder='email' className='w-[90%] h-[60%] shadow  outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg'/>

<div className='relative w-[90%] h-[60%] shadow  outline-none border-2 border-[#20c7ff] bg-white rounded-lg items-center'>
    <input 
    onChange={(e)=>setPassword(e.target.value)} value={password} type={`${show?"text":"password"}`} placeholder='password' className='  w-[90%] h-[60%]  px-[20px] py-[10px] outline-none'/>
    <span className='absolute top-[10px] right-2 text-[#20c7ff] font-semibold cursor-pointer' onClick={()=>setShow(prev=>!prev)}>{`${show? "show":"hide"}`}</span>
</div>

 {error && (
          <p className="text-sm text-red-600 text-center px-4">
            {error}
          </p>
        )}
<button className='px-[20px] py-[10px] bg-[#20c7ff] rounded-lg shadow-gray-400 text-[20px] w-[200px] font-semibold hover:shadow-inner shadow-lg cursor-pointer' disabled={loading}>{loading? "loading":"login"}</button>
<p className='cursor-pointer' onClick={()=>navigate("/signup")}>ypu have a account ? <span className='text-[#20c7ff] text-[bold]'>Login</span></p>
</form>
      </div>


    </div>
  )
}

export default Login
