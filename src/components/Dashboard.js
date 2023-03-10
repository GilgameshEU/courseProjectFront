/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@material-ui/core/styles";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import { API_URL } from "./Login";
import { useStyles } from "../styles";
import axiosJWT from "../actions/axiosJWT.js";
import axios from "../actions/axiosJWT.js";

const Dashboard = () => {
  const [token] = useState("");
  const [users, setUsers] = useState([]);
  const theme = useTheme();
  const classes = useStyles();

  useEffect(() => {
    getUsers();
  }, []);

  const updateStatusAndRole = async (id, newStatus, newRole) => {
    try {
      const response = await axiosJWT.put(`${API_URL}users/${id}/updateStatusAndRole`, {
        role: newRole,
        status: newStatus,
      });
      getUsers();

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteUser = async (id) => {
    try {
      await axiosJWT.delete(`${API_URL}users/${id}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const getUsers = async () => {
    const response = await axios.get(`${API_URL}users`, {
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
          <Button variant="contained" color="primary" className={classes.button} onClick={() => updateStatusAndRole(params.row.id, params.row.status, params.row.role)}>
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
        <Button className={classes.button} onClick={() => deleteUser(rowData.id)}>
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
        components={{
          Toolbar: GridToolbar,
        }}
        disableSelectionOnClick
      />
    </Box>
  );
};

export default Dashboard;
