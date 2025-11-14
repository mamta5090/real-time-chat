import { useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../main';
import { setUserData } from '../redux/userSlice';
import { useDispatch } from 'react-redux';

const getCurrentUser = () => {
    const dispatch = useDispatch();

   useEffect(() => {
    const fetchUser = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/user/current`, {
                withCredentials: true
            });
            dispatch(setUserData(result.data));
        } catch (error) {
            console.log(error);
        }
    };
    fetchUser();
   }, [dispatch]);


  return null;
}

export default getCurrentUser;