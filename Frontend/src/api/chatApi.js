import axios from "axios";

const BASE_URL = "http://localhost:5000/api/chat";

export const sendMessage = async (message) => {
  const response = await axios.post(BASE_URL, { message });
  return response.data;
};