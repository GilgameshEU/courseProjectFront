import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "./Login";
import axios from "axios";
import { Typography, Button } from "@mui/material";

const ItemPage = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const getItem = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}items/${itemId}`);
      setItem(response.data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getItem();
  }, [itemId]);

  const handleLike = () => {
    // логика для отправки лайка на сервер
  };

  const handleComment = () => {
    // логика для отправки комментария на сервер
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!item) {
    return <Typography>Item not found</Typography>;
  }

  return (
    <div>
      <Typography variant="h6">{item.name}</Typography>
      <Typography>{item.description}</Typography>
      <Typography>Collection: {item.collection.name}</Typography>
      <Typography>Tags: {item.tags}</Typography>
      <Typography>Created At: {new Date(item.createdAt).toLocaleString()}</Typography>
      <Typography>Updated At: {new Date(item.updatedAt).toLocaleString()}</Typography>
      <Button variant="outlined" onClick={handleLike}>
        Like
      </Button>
      <Button variant="outlined" onClick={handleComment}>
        Comment
      </Button>
    </div>
  );
};

export default ItemPage;
