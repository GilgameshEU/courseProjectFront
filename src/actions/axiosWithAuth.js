import axios from "axios";
import jwt_decode from "jwt-decode";

const axiosJWT = axios.create();

const setAuthorizationHeader = async (token, expire) => {
  const currentDate = new Date();
  if (expire * 1000 < currentDate.getTime()) {
    const response = await axios.get("http://localhost:5000/token");
    axiosJWT.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;
    const decoded = jwt_decode(response.data.accessToken);
    return {
      token: response.data.accessToken,
      name: decoded.name,
      expire: decoded.exp,
      role: decoded.role,
    };
  }
};

axiosJWT.interceptors.request.use(
  async (config) => {
    const updatedTokenData = setAuthorizationHeader(config.headers.Authorization, config.expire);
    if (updatedTokenData) {
      config.headers.Authorization = `Bearer ${updatedTokenData.token}`;
      return { ...config, ...updatedTokenData };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const updateStatusAndRole = async (id, newStatus, newRole) => {
  try {
    const response = await axiosJWT.put(`http://localhost:5000/users/${id}/updateStatusAndRole`, {
      role: newRole,
      status: newStatus,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    await axiosJWT.delete(`http://localhost:5000/users/${id}/delete`);
  } catch (error) {
    console.error(error);
  }
};

export const getUsers = async () => {
  const response = await axiosJWT.get("http://localhost:5000/users");
  return response.data;
};
// export const getUsers = async () => {
//     const response = await axiosJWT.get("http://localhost:5000/users", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     setUsers(response.data);
//   };

//   export const axiosJWT = axios.create();
//   axiosJWT.interceptors.request.use(
//     async (config) => {
//       const currentDate = new Date();
//       if (expire * 1000 < currentDate.getTime()) {
//         const response = await axios.get("http://localhost:5000/token");
//         config.headers.Authorization = `Bearer ${response.data.accessToken}`;
//         setToken(response.data.accessToken);
//         const decoded = jwt_decode(response.data.accessToken);
//         setName(decoded.name);
//         setExpire(decoded.exp);
//         setRole(decoded.role);
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );
