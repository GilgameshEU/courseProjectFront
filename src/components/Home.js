import React, { useState, useEffect } from "react";
import { useStyles } from "../styles";
import { API_URL } from "./Login";
import axios from "axios";
import { Typography, IconButton } from "@mui/material";
import { Favorite, Share } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const classes = useStyles();
  const [collections, setCollections] = useState([]);
  const navigate = useNavigate();

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

  const handleCollectionClick = (id) => {
    navigate(`collections/${id}/items`);
  };

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
              <Typography variant="body1" dangerouslySetInnerHTML={{ __html: collection.descriptionHtml }} />
              <div style={{ display: "flex", alignItems: "center" }}>
                <IconButton>
                  <Favorite />
                </IconButton>
                <IconButton>
                  <Share />
                </IconButton>
                <button onClick={() => handleCollectionClick(collection.id)} style={{ marginLeft: "auto" }}>
                  Подробнее
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
