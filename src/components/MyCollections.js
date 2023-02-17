import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { useStyles } from "../styles";
import { API_URL } from "./Login";
import axios from "axios";

const MyCollections = () => {
  const classes = useStyles();
  const [collections, setCollections] = useState([]);

  // useEffect(() => {
  //   axios.defaults.headers.common["Authorization"] = `Bearer ${getCookie("refreshToken")}`;
  //   getCollections();
  // }, []);

  // function getCookie(name) {
  //   const cookies = document.cookie.split(";");
  //   for (let i = 0; i < cookies.length; i++) {
  //     const cookie = cookies[i].trim();
  //     if (cookie.startsWith(`${name}=`)) {
  //       return cookie.substring(name.length + 1);
  //     }
  //   }
  //   return null;
  // }
  // console.log();
  // const getCollections = async () => {
  //   try {
  //     const response = await axios.get(`${API_URL}collections`);
  //     setCollections(response.data.filter((collection) => collection.user.id === parseInt(getCookie("refreshToken"))));
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  return (
    <div className={classes.root}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {collections.map((collection) => (
          <div key={collection.id} style={{ marginBottom: "16px" }}>
            <Typography variant="h6">{collection.name}</Typography>
            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: collection.descriptionHtml }} />
            <Typography variant="body2">Theme: {collection.theme}</Typography>
            <Typography variant="body2">Created At: {new Date(collection.createdAt).toLocaleString()}</Typography>
            <Typography variant="body2">User: {collection.user.name}</Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCollections;
