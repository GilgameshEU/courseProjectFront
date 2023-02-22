import React, { useState, useEffect, useContext } from "react";
import { Typography, Button } from "@mui/material";
import { useStyles } from "../styles";
import { API_URL } from "./Login";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import jwt_decode from "jwt-decode";
import CollectionForm from "./CollectionForm";
import DeleteIcon from "@mui/icons-material/Delete";

const MyCollections = () => {
  const classes = useStyles();
  const [collections, setCollections] = useState([]);
  const [editingCollection, setEditingCollection] = useState(null);
  const { isAuthenticated, userId, name, role } = useContext(AuthContext);

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
  }, [isAuthenticated, name, role]);

  const handleAddNewCollection = () => {
    setEditingCollection({ name: "", description: "", theme: "", imageUrl: "", userId: "" });
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
  console.log(userId);

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        My Collections
      </Typography>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ flex: "1" }}>
          <Typography variant="h5">Collection Summary</Typography>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Theme</th>
                <th>Created At</th>
                <th>User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((collection) => (
                <tr key={collection.id}>
                  <td>{collection.id}</td>
                  <td>{collection.name}</td>
                  {/* <td>
                    <div dangerouslySetInnerHTML={{ __html: collection.descriptionHtml }} />
                  </td> */}
                  <td>{collection.description}</td>
                  <td>{collection.theme}</td>
                  <td>{new Date(collection.createdAt).toLocaleString()}</td>
                  <td>{collection.user?.name}</td>

                  <td>
                    <Button variant="contained" color="primary" onClick={() => handleEditCollection(collection)}>
                      Edit
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleDeleteCollection(collection)} startIcon={<DeleteIcon />}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ flex: "1" }}>
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
        </div>
      </div>
    </div>
  );
};

export default MyCollections;

// const token = localStorage.getItem("token");
// const decoded = jwt_decode(token);
