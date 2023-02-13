import jwt_decode from "jwt-decode";
import axios from "axios";
import { API_URL } from "./Login";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const useJwt = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");

  const Logout = async () => {
    try {
      await axios.delete(`${API_URL}logout`);

      navigate("/");
      //  refreshToken();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get(`${API_URL}token`);
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.name);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

  return { name, token, expire, Logout, refreshToken };
};
