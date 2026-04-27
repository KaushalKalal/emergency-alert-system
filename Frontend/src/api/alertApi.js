import axios from "axios";

const BASE_URL = "http://localhost:5000/api/alerts";

export const sendAlert = async (data) => {
  const response = await axios.post(`${BASE_URL}/send`, data);
  return response.data;
};

export const getAlerts = async (filters = {}) => {
  const response = await axios.get(BASE_URL, { params: filters });
  return response.data;
};

export const getAlertById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const resolveAlert = async (id) => {
  const response = await axios.patch(`${BASE_URL}/${id}/resolve`);
  return response.data;
};