import React, { useState, useEffect } from "react";
import { useStyles } from "../styles";
import { API_URL } from "./Login";
import axios from "axios";
import { Typography, IconButton } from "@mui/material";
import { Favorite, Share } from "@mui/icons-material";

const Home = () => {
  const classes = useStyles();
  const [collections, setCollections] = useState([]);

  const getCollections = async () => {
    try {
      const response = await axios.get(`${API_URL}collections`);
      setCollections(response.data);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  return (
    <div className={classes.root}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {collections.map((collection) => (
          <div key={collection.id} style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
            <img src={collection.image} alt="Collection" style={{ marginRight: "16px", width: "80px", height: "80px", objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <Typography variant="h6">{collection.name}</Typography>
              <Typography variant="body2">Theme: {collection.theme}</Typography>
              <Typography variant="body2">Created At: {new Date(collection.createdAt).toLocaleString()}</Typography>
              <Typography variant="body2">User: {collection.user.name}</Typography>
              <div style={{ display: "flex", alignItems: "center" }}>
                <IconButton>
                  <Favorite />
                </IconButton>
                <IconButton>
                  <Share />
                </IconButton>
                <a href={`/collections/${collection.id}`} style={{ marginLeft: "auto" }}>
                  Подробнее
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
