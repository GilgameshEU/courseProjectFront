import React, { useState, useEffect } from "react";
import { useStyles } from "../styles";
import { API_URL } from "./Login";
import axios from "axios";
import { Typography } from "@mui/material";

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
          <div key={collection.id} style={{ marginBottom: "16px" }}>
            <Typography variant="h6">{collection.name}</Typography>
            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: collection.descriptionHtml }} />
            <Typography variant="body2">Theme: {collection.theme}</Typography>
            <Typography variant="body2">Created At: {new Date(collection.createdAt).toLocaleString()}</Typography>
            {/* <Typography variant="body2">User: {collection.user.name}</Typography> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
