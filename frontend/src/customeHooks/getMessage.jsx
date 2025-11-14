import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../redux/messageSlice"; 

const getMessage = () => {
  const dispatch = useDispatch();
  const {userData,selectedUser} = useSelector((state) => state.user);


  useEffect(() => {
    if (!selectedUser?._id) return;

    const fetchMessages = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/message/get/${selectedUser._id}`,
          { withCredentials: true }
        );
        dispatch(setMessage(result.data));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedUser, dispatch]);
};

export default getMessage;

