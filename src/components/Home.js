import React, { useState, useEffect, useContext } from "react";
import { useStyles } from "../styles";
import { API_URL } from "./Login";
import axios from "axios";
import { Typography } from "@mui/material";
import { Paper } from "@material-ui/core";
import TagCloud from "react-tag-cloud";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { dictionary } from "../locale/dictionary.js";

const Home = () => {
  const classes = useStyles();
  const [collections, setCollections] = useState([]);
  const [items, setItems] = useState([]);
  const [tags, setTags] = useState([]);
  const { theme, lang } = useContext(AuthContext);
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
      const allItems = response.data;
      const allTags = allItems.reduce((acc, item) => {
        const itemTags = item.tags.split(",").map((tag) => tag.trim());
        return [...acc, ...itemTags];
      }, []);
      const uniqueTags = Array.from(new Set(allTags));
      setItems(allItems);
      setTags(uniqueTags);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getCollections();
    getAllItems();
  }, []);

  return (
    <div className={classes.root} style={{ display: "flex", justifyContent: "space-between", background: theme === "light" ? "#FFFFFF" : "#8a8a8a" }}>
      <div style={{ flex: "1 1 70%", textAlign: "center" }}>
        <Typography variant="h8" style={{ marginBottom: "16px", fontWeight: "bold" }}>
          {dictionary["Latest items"][lang]}
        </Typography>
        {items
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10)
          .map((item) => (
            <Link to={`/itemPage/${item.id}`} style={{ textDecoration: "none" }}>
              <Paper key={item.id + item.createdAt} style={{ marginBottom: "16px", border: "2px solid gray" }}>
                <div style={{ display: "flex", alignItems: "center", padding: "16px" }}>
                  <img src={item.image} alt="Item" style={{ marginRight: "16px", width: "80px", height: "80px", objectFit: "cover" }} />

                  <div style={{ flex: 1 }}>
                    <Typography variant="body2">{item.name}</Typography>
                    <Typography variant="body2">
                      {dictionary["Updated At:"][lang]} {new Date(item.updatedAt).toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      {dictionary["Collection:"][lang]} {item.collection.name}
                    </Typography>
                    <Typography variant="body2">
                      {dictionary["User:"][lang]}
                      {item.collection.user.name}
                    </Typography>
                    <Typography variant="body1" dangerouslySetInnerHTML={{ __html: item.descriptionHtml }} />
                  </div>
                </div>
              </Paper>
            </Link>
          ))}
      </div>
      <div style={{ flex: "1 1 70%", display: "flex", flexDirection: "column" }}>
        <div>
          {collections && collections.length > 0 && (
            <div style={{ textAlign: "center" }}>
              <Typography variant="h8" style={{ marginTop: "16px", marginBottom: "16px", fontWeight: "bold" }}>
                {dictionary["Top collections"][lang]}
              </Typography>
              {collections
                .sort((a, b) => b.itemCount - a.itemCount)
                .slice(0, 3)
                .map((collection, index) => (
                  <Paper key={collection.id} style={{ marginBottom: "16px", border: "2px solid gray" }}>
                    <div style={{ display: "flex", alignItems: "center", padding: "16px" }}>
                      {index === 0 && (
                        <div style={{ marginRight: "16px" }}>
                          <img src="https://mybucketforcourseproject.s3.eu-central-1.amazonaws.com/goldMedal.png" alt="gold medal" style={{ width: "30px" }} />
                        </div>
                      )}
                      {index === 1 && (
                        <div style={{ marginRight: "16px" }}>
                          <img src="https://mybucketforcourseproject.s3.eu-central-1.amazonaws.com/silverMedal.png" alt="silver medal" style={{ width: "30px" }} />
                        </div>
                      )}
                      {index === 2 && (
                        <div style={{ marginRight: "16px" }}>
                          <img src="https://mybucketforcourseproject.s3.eu-central-1.amazonaws.com/bronzeMedal.png" alt="bronze medal" style={{ width: "30px" }} />
                        </div>
                      )}
                      <img src={collection.image} alt="collection" style={{ marginRight: "16px", width: "80px", height: "80px", objectFit: "cover" }} />
                      <div style={{ flex: 1 }}>
                        <Typography variant="body2">
                          {dictionary["Collection:"][lang]} {collection.name}
                        </Typography>
                        <Typography variant="body2">
                          {" "}
                          {dictionary["User:"][lang]}
                          {collection.user.name}
                        </Typography>
                        <Typography variant="body2">
                          {dictionary["Items:"][lang]} {collection.itemCount}
                        </Typography>
                      </div>
                    </div>
                  </Paper>
                ))}
            </div>
          )}
        </div>

        <div>
          {tags.length > 0 && (
            <div style={{ textAlign: "center" }}>
              <Typography variant="h8" style={{ marginBottom: "16px", fontWeight: "bold" }}>
                {dictionary["Tags cloud"][lang]}
              </Typography>
              <div style={{ maxHeight: "200px", overflow: "auto" }}>
                <TagCloud className={classes.tagCloud} minsize={30} maxsize={35} style={{ flexWrap: "wrap" }}>
                  {tags.map((tag) => (
                    <div key={tag}>
                      {/* <div key={tag} className={classes.tag} style={{ fontSize: `${20 + tag.count * 10}px` }}>
                        {" "}
                      </div> */}
                      <Link to={`/items?tag=${tag.trim()}`}>{tag.trim()}</Link>
                    </div>
                  ))}
                </TagCloud>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
