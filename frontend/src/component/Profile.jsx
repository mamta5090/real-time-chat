import React, { useState, useRef, useEffect } from 'react';
import dp from '../assets/dp.webp';
import { FaCameraRetro } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { MdArrowBackIosNew } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../main';
import { setUserData } from '../redux/userSlice';

const Profile = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [frontendImage, setFrontendImage] = useState(dp);
  const [backendImage, setBackendImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const imageRef = useRef();

  // Use useEffect to safely set initial state from userData
  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setFrontendImage(userData.image || dp);
    }
  }, [userData]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.put(`${serverUrl}/api/user/profile`, formData, {
        withCredentials: true,
      });

      dispatch(setUserData(result.data));
      setSaving(false);
      navigate("/");

    } catch (error) {
      console.log(error);
      // Optionally, show an error message to the user here
      setSaving(false);
    }
  };

  // If userData is not yet loaded, show a loading state
  if (!userData) {
    return <div>Loading profile...</div>;
  }



  return (
    <div className='w-full h-screen space-y-15 flex flex-col justify-center items-center'>
      <div className='flex justify-start absolute top-10 left-2 cursor-pointer' onClick={() => navigate(-1)}>
        <MdArrowBackIosNew />
      </div>

      <div
        className='relative w-[200px] h-[200px] rounded-full shadow-lg cursor-pointer'
        onClick={() => imageRef.current.click()}
      >
        <img
          src={frontendImage}
          alt="Profile"
          className='w-full h-full rounded-full object-cover border-4 border-[#20c7ff]'
        />
        <div className='absolute bottom-2 right-4 bg-white p-2 rounded-full shadow-md'>
          <FaCameraRetro className='w-[25px] h-[25px] text-[#20c7ff]' />
        </div>
      </div>

      <form className='w-full flex flex-col gap-[20px] items-center' onSubmit={handleProfile}>
        <input
          type="file"
          accept='image/*'
          ref={imageRef}
          hidden
          onChange={handleImage}
        />
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder='Enter your name'
          className='w-[90%] h-[60%] shadow outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg'
        />

        <input type="text" readOnly className='w-[90%] h-[60%] shadow outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg' value={userData?.password || ""} />
        <input type='text' readOnly className='w-[90%] h-[60%] shadow outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg' value={userData?.email || ''} />

        <button
          type="submit"
          className='px-[20px] py-[10px] bg-[#20c7ff] rounded-lg shadow-gray-400 text-[20px] w-[200px] font-semibold hover:shadow-inner shadow-lg cursor-pointer disabled:bg-gray-400'
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;