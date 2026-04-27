import axios from "axios";

// const BASE_URL = "http://localhost:5000/api/chat";
const BASE_URL = "https://emergency-alert-system-v2lb.onrender.com/api/chat";
export const sendMessage = async (message) => {
  const response = await axios.post(BASE_URL, { message });
  return response.data;
};