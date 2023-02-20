import React, { useState, useEffect, useContext } from "react";
import { Typography, Button } from "@mui/material";
import { useStyles } from "../styles";
import { API_URL } from "./Login";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import jwt_decode from "jwt-decode";
import CollectionForm from "./CollectionForm";

const MyCollections = () => {
  const classes = useStyles();
  const [collections, setCollections] = useState([]);
  const [editingCollection, setEditingCollection] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(`${API_URL}collections`);
      if (isAuthenticated && localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        const decoded = jwt_decode(token);
        console.log(decoded.role);
        if (decoded.role === "admin") {
          setCollections(result.data);
        } else {
          setCollections(result.data.filter((collection) => collection.user.name === decoded.name));
        }
      } else {
        setCollections([]);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  const handleAddNewCollection = () => {
    setEditingCollection({ name: "", description: "", theme: "", imageUrl: "" });
  };

  const handleEditCollection = (collection) => {
    setEditingCollection(collection);
  };

  const handleSaveCollection = async (collection) => {
    try {
      if (editingCollection) {
        // Update existing collection
        const updatedCollection = await axios.put(`${API_URL}collections/${editingCollection.id}`, collection);
        setCollections(collections.map((c) => (c.id === updatedCollection.data.id ? updatedCollection.data : c)));
      } else {
        // Add new collection
        const newCollection = await axios.post(`${API_URL}collections`, collection);
        setCollections([...collections, newCollection.data]);
      }
      setEditingCollection(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelEdit = () => {
    setEditingCollection(null);
  };

  return (
    <div className={classes.root}>
      {editingCollection ? (
        <CollectionForm onSave={handleSaveCollection} onCancel={handleCancelEdit} initialValues={editingCollection} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {collections.map((collection) => (
            <div key={collection.id} style={{ marginBottom: "16px" }}>
              <Typography variant="h6">{collection.name}</Typography>
              <Typography variant="body1" dangerouslySetInnerHTML={{ __html: collection.descriptionHtml }} />
              <Typography variant="body2">Theme: {collection.theme}</Typography>
              <Typography variant="body2">Created At: {new Date(collection.createdAt).toLocaleString()}</Typography>
              <Typography variant="body2">User: {collection.user.name}</Typography>
              <Button variant="contained" color="primary" onClick={() => handleEditCollection(collection)}>
                Edit
              </Button>
            </div>
          ))}
          <Button variant="contained" color="primary" onClick={handleAddNewCollection}>
            Add New Collection
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyCollections;
