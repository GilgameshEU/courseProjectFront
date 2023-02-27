import React, { useState, useEffect, useContext } from "react";
import { Typography, Button, Grid } from "@mui/material";
import { useStyles } from "../styles";
import { API_URL } from "./Login";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import CollectionForm from "./CollectionForm";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const MyCollections = () => {
  const classes = useStyles();
  const [collections, setCollections] = useState([]);
  const [editingCollection, setEditingCollection] = useState(null);
  const { isAuthenticated, name, role } = useContext(AuthContext);

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
    setEditingCollection({ name: "", description: "", theme: "", image: "", userId: "" });
  };

  const handleEditCollection = (collection) => {
    setEditingCollection(collection);
  };
  const handleSaveNewCollection = async (collection) => {
    try {
      const newCollection = await axios.post(`${API_URL}createCollection`, collection);
      setCollections([...collections, newCollection.data]);
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
    { field: "image", headerName: "Image", width: 100 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "Description", width: 400 },
    { field: "theme", headerName: "Theme", width: 150 },
    { field: "createdAt", headerName: "Created At", width: 200, valueGetter: (params) => new Date(params.row.createdAt).toLocaleString() },
    { field: "itemCount", headerName: "Items count", width: 150 },
    { field: "user.name", headerName: "Owner", width: 150, valueGetter: (params) => params.row.user?.name },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <>
          <Button variant="contained" color="primary" onClick={() => handleEditCollection(params.row)}>
            Edit
          </Button>
          <Button variant="contained" color="error" onClick={() => handleDeleteCollection(params.row)} startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        My Collections
      </Typography>
      <Grid item xs={12}>
        {editingCollection ? (
          <CollectionForm onSave={editingCollection.id ? handleSaveExistingCollection : handleSaveNewCollection} onCancel={handleCancelEdit} initialValues={editingCollection} />
        ) : (
          <div>
            <Typography variant="h5">Add New Collection</Typography>
            <Button variant="contained" color="primary" onClick={handleAddNewCollection}>
              Add New Collection
            </Button>
          </div>
        )}
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={collections}
              columns={columns}
              components={{
                Toolbar: GridToolbar,
              }}
              disableSelectionOnClick
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default MyCollections;
