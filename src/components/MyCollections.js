import React, { useState, useEffect, useContext } from "react";
import { Typography, Button, Grid } from "@mui/material";
import { useStyles } from "../styles";
import { API_URL } from "./Login";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import CollectionForm from "./CollectionForm";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { dictionary } from "../locale/dictionary.js";

const MyCollections = () => {
  const classes = useStyles();
  const [collections, setCollections] = useState([]);
  const [editingCollection, setEditingCollection] = useState(null);
  const { isAuthenticated, name, role, theme, lang } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(`${API_URL}collections`);
      if (isAuthenticated) {
        if (role === "admin") {
          setCollections(result.data);
        } else {
          setCollections(result.data.filter((collection) => collection.user.name === name));
        }
      } else {
        setCollections([]);
      }
    };
    fetchData();
  }, [isAuthenticated, name, role, editingCollection]);

  const handleAddNewCollection = () => {
    setEditingCollection({ name: "", description: "", themeId: "", image: "", userId: "" });
  };

  const handleEditCollection = (collection) => {
    setEditingCollection(collection);
  };
  const handleSaveNewCollection = async (collection) => {
    try {
      const newCollection = await axios.post(`${API_URL}createCollection`, collection);
      setCollections([...collections, newCollection.data]);
      console.log(collection);
      setEditingCollection(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveExistingCollection = async (collection) => {
    try {
      const updatedCollection = await axios.put(`${API_URL}collections/${editingCollection.id}/updateCollection`, collection);
      setCollections(collections.map((c) => (c.id === updatedCollection.data.id ? updatedCollection.data : c)));
      setEditingCollection(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCollection = async (collection) => {
    try {
      await axios.delete(`${API_URL}collections/${collection.id}/deleteCollection`);
      setCollections(collections.filter((c) => c.id !== collection.id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelEdit = () => {
    setEditingCollection(null);
  };

  const columns = [
    { field: "name", headerName: dictionary["Name"][lang], width: 200 },
    { field: "description", headerName: dictionary["Description"][lang], width: 400 },
    { field: "theme.name", headerName: dictionary["Theme"][lang], width: 150, valueGetter: (params) => params.row.theme?.name },
    { field: "createdAt", headerName: dictionary["CreatedAt"][lang], width: 200, valueGetter: (params) => new Date(params.row.createdAt).toLocaleString() },
    { field: "itemCount", headerName: dictionary["Items count"][lang], width: 150 },
    { field: "user.name", headerName: dictionary["Owner"][lang], width: 150, valueGetter: (params) => params.row.user?.name },
    {
      field: "actions",
      headerName: dictionary["Actions"][lang],
      width: 350,
      renderCell: (params) => (
        <>
          <Button variant="contained" color="primary" onClick={() => handleEditCollection(params.row)}>
            {dictionary["Edit"][lang]}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={(params) => {
              navigate(`/items`);
            }}>
            {dictionary["Open collection"][lang]}
          </Button>
          <Button variant="contained" color="error" onClick={() => handleDeleteCollection(params.row)} startIcon={<DeleteIcon />}>
            {dictionary["Delete"][lang]}
          </Button>
        </>
      ),
    },
  ];
  console.log(collections);
  return (
    <div className={classes.root} style={{ background: theme === "light" ? "#FFFFFF" : "#8a8a8a" }}>
      <Grid item xs={12}>
        {editingCollection ? (
          <CollectionForm onSave={editingCollection.id ? handleSaveExistingCollection : handleSaveNewCollection} onCancel={handleCancelEdit} initialValues={editingCollection} />
        ) : (
          <div>
            <Button variant="contained" color="primary" onClick={handleAddNewCollection}>
              {dictionary["Add New Collection"][lang]}
            </Button>
          </div>
        )}
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={collections}
              columns={columns}
              components={{
                Toolbar: GridToolbar,
              }}
              disableSelectionOnClick
              // onRowClick={(params) => {
              //   navigate(`/items?${params.row.id}`);
              // }}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default MyCollections;
