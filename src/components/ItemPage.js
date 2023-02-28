import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { Grid, Typography, TextField, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, ListItemSecondaryAction } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCommentIcon from "@mui/icons-material/AddComment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// // import DeleteIcon from '@mui/icons-material/Delete';
// import { FavoriteIcon, EditIcon, DeleteIcon } from "@material-ui/icons";
import { API_URL } from "./Login";

const ItemPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const { userId } = useContext(AuthContext);

  const getItem = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}itemPage/${id}`);
      setItem(response.data);
      setComments(response.data.comments);
      setLikes(response.data.likes);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getItem(id);
  }, [id, commentCount]);

  const handleLike = async () => {
    try {
      // Check if the user has already liked the item
      const hasLiked = likes.find((like) => like.userId === userId);
      if (hasLiked) {
        setLiked(true);
        // If the user has already liked the item, do nothing
        return;
      }
      // If the user hasn't liked the item, send a POST request to like the item
      const response = await axios.post(`${API_URL}itemPage/${id}/like`, { userId: userId });
      setLikes(response.data.likes);
      setLiked(true);
    } catch (error) {
      throw error;
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}itemPage/${id}/comment`, { comment_text: comment, userId: userId });
      setComments([...comments, response.data]);
      setComment("");
      setCommentCount(commentCount + 1);
    } catch (error) {
      throw error;
    }
  };
  console.log(liked);
  if (loading) {
    return <Typography>Loading...</Typography>;
  }
  const handleEdit = async () => {};
  const handleDelete = async () => {};

  if (item != null) {
    return (
      <div style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "10px", marginBottom: "20px", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle2" gutterBottom style={{ fontWeight: "bold" }}>
            Created: {new Date(item.createdAt).toLocaleDateString()}
          </Typography>
          <div style={{ position: "absolute", top: "10px", right: "10px" }}>
            <IconButton onClick={handleEdit}>
              <EditIcon color="primary" />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteIcon color="secondary" />
            </IconButton>
          </div>
        </div>
        <Grid container spacing={2}>
          {/* {/ First column: item image /} */}
          <Grid item xs={12} md={3}>
            <img src={item.image} alt={item.name} style={{ height: "100%", width: "100%", objectFit: "contain", border: "1px solid black", borderRadius: "5px" }} />
          </Grid>
          {/* {/ Second column: item name and description /} */}
          <Grid item xs={12} md={3}>
            <Typography variant="h4" gutterBottom style={{ fontWeight: "bold" }}>
              {item.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {item.description}
            </Typography>
          </Grid>
          {/* {/ Third column: additional item fields /} */}
          <Grid item xs={12} md={3}>
            <table>
              <tbody>
                {Object.entries(item).map(([key, value]) => {
                  if (key.startsWith("field_") && value !== null && value !== "") {
                    return (
                      <tr key={key}>
                        <td>
                          <b>{key.replace("field_", "Field ")}:</b>
                        </td>
                        <td>{value}</td>
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
            <Typography variant="subtitle1" gutterBottom>
              Collection: {item.collection.name}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Tags: {item.tags}
            </Typography>
          </Grid>
          {/* {/ Fourth column: comments, likes, edit and delete buttons /} */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom style={{ fontWeight: "bold" }}>
              Comments
            </Typography>
            <List style={{ maxHeight: "250px", overflowY: "auto" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={handleLike}>{liked ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon color="primary" />}</IconButton>
                {/* <Typography variant="subtitle1" gutterBottom>
              {likes}
            </Typography> */}
                <TextField id="comment" label="Add a comment" fullWidth multiline rows={4} value={comment} onChange={(e) => setComment(e.target.value)} margin="normal" style={{ marginLeft: "10px" }} />
                <IconButton onClick={handleComment} style={{ marginLeft: "10px" }}>
                  <AddCommentIcon color="primary" />
                </IconButton>
              </div>
              {comments &&
                comments.map((comment) => (
                  <ListItem key={comment.id}>
                    <ListItemAvatar>
                      <Avatar alt={comment.user?.name} src={comment.user?.avatar} />
                    </ListItemAvatar>
                    <ListItemText primary={comment.user?.name} secondary={comment.comment_text} />
                    <ListItemSecondaryAction>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
            </List>
          </Grid>
        </Grid>
      </div>
    );
  }
};

export default ItemPage;
