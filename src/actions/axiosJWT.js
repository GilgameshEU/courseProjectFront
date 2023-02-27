import axios from "axios";
import jwt_decode from "jwt-decode";
import { API_URL } from "../components/Login";
import AWS from "aws-sdk";

const axiosJWT = axios.create();
export let currentUser = null;

export const s3 = new AWS.S3({
  accessKeyId: "AKIA33ZKOPBDVNTUM4VZ",
  secretAccessKey: "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",
  region: "eu-central-1",
});

axiosJWT.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  const decoded = jwt_decode(token);

  const currentDate = new Date();
  if (decoded.exp * 1000 < currentDate.getTime()) {
    const response = await axios.get(`${API_URL}token`);
    localStorage.setItem("token", response.data.accessToken);
    config.headers.Authorization = `Bearer ${response.data.accessToken}`;
    currentUser = {
      name: decoded.name,
      role: decoded.role,
    };
  } else {
    config.headers.Authorization = `Bearer ${token}`;
    currentUser = {
      name: decoded.name,
      role: decoded.role,
    };
  }
  return config;
});

export const refreshToken = async () => {
  try {
    const response = await axiosJWT.get(`${API_URL}token`);
    localStorage.setItem("token", response.data.accessToken);
    const decoded = jwt_decode(response.data.accessToken);
    currentUser = {
      name: decoded.name,
      role: decoded.role,
    };
  } catch (error) {
    localStorage.removeItem("token");
    currentUser = null;
  }
};

export const logout = async () => {
  try {
    await axiosJWT.delete(`${API_URL}logout`);
    localStorage.removeItem("token");
    currentUser = null;
  } catch (error) {
    console.log(error);
  }
};

export const auth = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}login`, {
      email: email,
      password: password,
    });
    localStorage.setItem("token", response.data.accessToken);
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      return { success: false, data: error.response.data.msg };
    }
    return { success: false, data: error.message };
  }
};

export default axiosJWT;
