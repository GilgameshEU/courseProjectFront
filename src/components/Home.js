import React, { useState, useEffect } from "react";
import { useStyles } from "../styles";
import { API_URL } from "./Login";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

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
    //  refreshToken();
    getCollections();
  }, []);

  return (
    <div className={classes.root}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Theme</TableCell>
              <TableCell>Image URL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {collections.map((collection) => (
              <TableRow key={collection.id}>
                <TableCell>{collection.id}</TableCell>
                <TableCell>{collection.name}</TableCell>
                <TableCell>{collection.description}</TableCell>
                <TableCell>{collection.theme}</TableCell>
                <TableCell>{collection.image_url}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Home;
