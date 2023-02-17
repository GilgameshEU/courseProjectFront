import axios from "axios";
import jwt_decode from "jwt-decode";
import { API_URL } from "../components/Login";
//export const API_URL = "http://localhost:5000/api/";

const axiosJWT = axios.create();
export let currentUser = null;

axiosJWT.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  const decoded = jwt_decode(token);

  const currentDate = new Date();
  if (decoded.exp * 1000 < currentDate.getTime()) {
    const response = await axios.get(`${API_URL}token`);
    localStorage.setItem("token", response.data.accessToken);
    config.headers.Authorization = `Bearer ${response.data.accessToken}`;
  } else {
    config.headers.Authorization = `Bearer ${token}`;
  }
  currentUser = {
    name: decoded.name,
    role: decoded.role,
  };
  return config;
});

export default axiosJWT;
