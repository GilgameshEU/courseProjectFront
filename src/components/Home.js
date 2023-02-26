import React, { useState, useEffect } from "react";
import { useStyles } from "../styles";
import { API_URL } from "./Login";
import axios from "axios";
import { Typography } from "@mui/material";
import { Paper } from "@material-ui/core";
import TagCloud from "react-tag-cloud";

const Home = () => {
  const classes = useStyles();
  const [collections, setCollections] = useState([]);
  const [items, setItems] = useState([]);
  const [tags, setTags] = useState([]);

  const getCollections = async () => {
    try {
      const response = await axios.get(`${API_URL}collections`);
      setCollections(response.data);
    } catch (error) {
      throw error;
    }
  };

  const getAllItems = async (id) => {
    try {
      const response = await axios.get(`${API_URL}collections/items`);
      setItems(response.data);
      setTags(response.data.flatMap((item) => item.tags.split(",")));
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getCollections();
    getAllItems();
  }, []);

  return (
    <div className={classes.root} style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ flex: "1 1 70%" }}>
        <Typography variant="h8" style={{ marginBottom: "16px" }}>
          Latest Items
        </Typography>
        {items
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10)
          .map((item) => (
            <Paper key={item.id} style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", padding: "16px" }}>
                <img src={item.image} alt="Item" style={{ marginRight: "16px", width: "80px", height: "80px", objectFit: "cover" }} />
                <div style={{ flex: 1 }}>
                  <Typography variant="body2">{item.name}</Typography>
                  <Typography variant="body2">Updated At: {new Date(item.updatedAt).toLocaleString()}</Typography>
                  <Typography variant="body2">Collection: {item.collection.name}</Typography>
                  <Typography variant="body2">User: {item.collection.user.name}</Typography>
                  <Typography variant="body1" dangerouslySetInnerHTML={{ __html: item.descriptionHtml }} />
                </div>
              </div>
            </Paper>
          ))}
      </div>
      <div style={{ flex: "1 1 30%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          {tags.length > 0 && (
            <>
              <Typography variant="h8" style={{ marginBottom: "16px" }}>
                Tags
              </Typography>
              <TagCloud className={classes.tagCloud} minsize={30} maxsize={35}>
                {tags.map((tag) => (
                  <div key={tag} className={classes.tag}>
                    {/* <div key={tag} className={classes.tag} style={{ fontSize: `${20 + tag.count * 10}px` }}>  */}
                    {tag.trim()}
                  </div>
                ))}
              </TagCloud>
            </>
          )}
        </div>
        <div style={{ marginTop: "100px" }}>
          {collections && collections.length > 0 && (
            <>
              <Typography variant="h8" style={{ marginTop: "16px", marginBottom: "16px" }}>
                Top Collections
              </Typography>
              {collections
                .sort((a, b) => b.item_count - a.item_count)
                .slice(0, 5)
                .map((collection) => (
                  <div key={collection.id} style={{ marginBottom: "16px" }}>
                    <Typography variant="body2">{collection.name}</Typography>
                    <Typography variant="body2">Items: {collection.item_count}</Typography>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
