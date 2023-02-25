import React, { useState, useEffect } from "react";
import { useStyles } from "../styles";
import { API_URL } from "./Login";
import axios from "axios";
import { Typography, IconButton } from "@mui/material";
import { Favorite, Share } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from "@material-ui/core";

const Home = () => {
  const classes = useStyles();
  const [collections, setCollections] = useState([]);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showItems, setShowItems] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const getCollections = async () => {
    try {
      const response = await axios.get(`${API_URL}collections`);
      setCollections(response.data);
    } catch (error) {
      throw error;
    }
  };

  const getItems = async (id) => {
    try {
      const response = await axios.get(`${API_URL}collections/${id}/items`);
      setItems(response.data);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  const handleCollectionClick = async (id) => {
    setSelectedCollection(id);
    getItems(id);
    setShowItems(true);
  };

  return (
    <div className={classes.root}>
      {collections
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .map((collection) => (
          <Paper key={collection.id} style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", padding: "16px" }}>
              <img src={collection.image} alt="Collection" style={{ marginRight: "16px", width: "80px", height: "80px", objectFit: "cover" }} />
              <div style={{ flex: 1 }}>
                <Typography variant="h8">Updated At: {new Date(collection.updatedAt).toLocaleString()}</Typography>
                <Typography variant="body2">{collection.name}</Typography>
                <Typography variant="body2">Theme: {collection.theme}</Typography>
                <Typography variant="body2">User: {collection.user.name}</Typography>
                <Typography variant="body1" dangerouslySetInnerHTML={{ __html: collection.descriptionHtml }} />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button onClick={() => handleCollectionClick(collection.id)} style={{ marginLeft: "auto" }}>
                    Подробнее
                  </button>
                </div>
                {/* Conditionally render items for selected collection only */}
                {showItems && selectedCollection === collection.id && (
                  <>
                    {items.length > 0 ? (
                      <TableContainer className={classes.container}>
                        <Table stickyHeader>
                          <TableHead>
                            <TableRow>
                              {Object.keys(items[0])
                                .filter((key) => items.some((item) => item[key] !== null && item[key] !== undefined && item[key] !== "" && key !== "id" && key !== "collectionId" && key !== "updatedAt" && key !== "createdAt"))
                                .map((key) => (
                                  <TableCell key={key}>{key}</TableCell>
                                ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {items.map((item) => (
                              <TableRow key={item.id}>
                                {Object.keys(item)
                                  .filter((key) => item[key] !== null && item[key] !== undefined && item[key] !== "" && key !== "id" && key !== "collectionId" && key !== "updatedAt" && key !== "createdAt")
                                  .map((key) => (
                                    <TableCell key={key}>{item[key]}</TableCell>
                                  ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography variant="body2">items not found</Typography>
                    )}
                  </>
                )}
              </div>
            </div>
          </Paper>
        ))}
    </div>
  );
};

export default Home;
