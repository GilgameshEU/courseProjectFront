/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";

import { updateStatusAndRole, deleteUser, getUsers } from "../actions/axiosWithAuth";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();

  const [role, setRole] = useState("");

  const useDataGridStyles = makeStyles({
    gridContainer: {
      height: "400px",
      width: "100%",
      [theme.breakpoints.down("sm")]: {
        height: "300px",
      },
    },
    title: {
      textAlign: "center",
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    button: {
      margin: theme.spacing(1),
    },
  });

  const classes = useDataGridStyles();

  useEffect(() => {
    refreshToken();
    getUsers();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.name);
      setExpire(decoded.exp);
      setRole(decoded.role);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

  const updateStatusAndRole = async (id, newStatus, newRole) => {
    try {
      const response = await axios.put(`http://localhost:5000/users/${id}/updateStatusAndRole`, {
        role: newRole,
        status: newStatus,
      });
      console.log(newRole);
      console.log(newStatus);
      console.log(id);

      getUsers();

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get("http://localhost:5000/token");
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setName(decoded.name);
        setExpire(decoded.exp);
        setRole(decoded.role);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getUsers = async () => {
    const response = await axiosJWT.get("http://localhost:5000/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(response.data);
  };

  const columns = [
    { field: "id", headerName: "No", width: 100 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "createdAt", headerName: "Created At", width: 200 },
    { field: "updatedAt", headerName: "Updated At", width: 200 },
    {
      field: "role",
      headerName: "Role",
      width: 130,
      type: "singleSelect",
      valueOptions: ["user", "admin"],
      editable: true,
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      type: "boolean",
      editable: true,
    },
    {
      headerName: "Action",
      field: "action",
      width: 100,
      renderCell: (params) => {
        return (
          <Button variant="contained" color="primary" className={useDataGridStyles.button} onClick={() => updateStatusAndRole(params.row.id, params.row.status, params.row.role)}>
            Save
          </Button>
        );
      },
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (rowData) => (
        <Button className={useDataGridStyles.button} onClick={() => deleteUser(rowData.id)}>
          Delete
        </Button>
      ),
    },
  ];

  const rows = users.map((user, index) => ({
    id: user.id,
    index: index + 1,
    name: user.name,
    email: user.email,
    createdAt: new Date(user.createdAt).toLocaleString(),
    updatedAt: new Date(user.updatedAt).toLocaleString(),
    role: user.role,
    status: user.status,
  }));

  return (
    <Box className={classes.gridContainer}>
      <Typography variant="h3" component="h3" className={classes.title}>
        Welcome Back: {name}
      </Typography>
      <DataGrid
        autoHeight
        columns={columns}
        rows={rows}
        pageSize={10}
        rowsPerPageOptions={[5]}
        getRowSpacing={(params) => ({
          top: params.isFirst ? theme.spacing(2) : 0,
          bottom: params.isLast ? theme.spacing(2) : 0,
        })}
      />
    </Box>
  );
};

export default Dashboard;