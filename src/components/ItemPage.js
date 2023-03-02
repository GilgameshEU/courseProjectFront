import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { Grid, Typography, TextField, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, ListItemSecondaryAction } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCommentIcon from "@mui/icons-material/AddComment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CloseIcon from "@mui/icons-material/Close";
import { dictionary } from "../locale/dictionary.js";
import ItemEdit from "./ItemEdit";
import { API_URL } from "./Login";
import io from "socket.io-client";

const ItemPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isOwner, setOwner] = useState(false);
  const { userId, lang, theme, isAuthenticated, name, role } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);

  const getItem = async () => {
    setLoading(true);
    try {
      const itemResponse = await axios.get(`${API_URL}itemPage/${id}`);
      setItem(itemResponse.data);
      setLikes(itemResponse.data.likes.length);
      if (itemResponse.data.collection.user?.name === name || role === "admin") {
        setOwner(true);
      }
      setComments(itemResponse.data.comments);
      setCommentCount(itemResponse.data.comments.length);
      // установка соединения с сервером
      const socket = io(`${API_URL}`);
      setSocket(socket);
      socket.on("newComment", (comment) => {
        // обновление списка комментариев при получении нового комментария
        setComments((prevComments) => [...prevComments, comment]);
        setCommentCount((prevCount) => prevCount + 1);
      });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getLikes = async (id) => {
    try {
      if (userId) {
        const likeResponse = await axios.get(`${API_URL}itemPage/${id}/likes/${userId}`);
        setLiked(likeResponse.data != null ? true : false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLikes(id);
  }, [id, userId]);

  useEffect(() => {
    const fetchData = async () => {
      await getItem(id);
      await getLikes(id);
    };
    fetchData();
    // отключение соединения с сервером при размонтировании компонента
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [id, commentCount, isEditing]);

  const handleLike = async () => {
    try {
      if (liked) {
        await axios.delete(`${API_URL}itemPage/${id}/likes/${userId}`);
        setLikes(likes - 1);
        setLiked(false);
      } else {
        await axios.post(`${API_URL}itemPage/${id}/likes`, { userId });
        setLikes(likes + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}itemPage/${id}/comment`, { comment_text: comment, userId: userId });
      setComments([...comments, response.data]);
      setCommentCount(commentCount + 1);
      socket.emit("addComment", response.data);
      setComment("");
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return <Typography>{dictionary["Loading"][lang]}</Typography>;
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}itemPage/${id}`);
      navigate("/items");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  if (item != null) {
    return (
      <div style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "10px", marginBottom: "20px", position: "relative", background: theme === "light" ? "#FFFFFF" : "#8a8a8a" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle2" gutterBottom style={{ fontWeight: "bold" }}>
            {dictionary["CreatedAt"][lang]} {new Date(item.createdAt).toLocaleDateString() + " "}
            {dictionary["by"][lang]}
            {item.collection.user?.name}
          </Typography>
          {isAuthenticated && isOwner && (
            <div style={{ position: "absolute", top: "10px", right: "10px" }}>
              {isEditing ? (
                <>
                  <IconButton onClick={handleCancelClick}>
                    <CloseIcon color="secondary" />
                  </IconButton>
                </>
              ) : (
                <IconButton onClick={handleEditClick}>
                  <EditIcon color="primary" />
                </IconButton>
              )}
              <IconButton onClick={handleDelete}>
                <DeleteIcon color="secondary" />
              </IconButton>
            </div>
          )}
        </div>

        {isEditing ? (
          <ItemEdit onCancel={handleCancelClick} item={item} />
        ) : (
          <Grid container spacing={2}>
            {/* {/ First column: item image /} */}
            <Grid item xs={12} md={3}>
              <img src={item.image} alt={item.name} style={{ height: "100%", width: "100%", objectFit: "fill", border: "1px solid black", borderRadius: "5px" }} />
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
                {dictionary["Collection:"][lang]}
                {item.collection.name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {dictionary["Tags"][lang]} {item.tags}
              </Typography>
            </Grid>
            {/* {/ Fourth column: comments, likes, edit and delete buttons /} */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom style={{ fontWeight: "bold" }}>
                {dictionary["Comments"][lang]}
              </Typography>
              <List style={{ maxHeight: "400px", overflowY: "auto" }}>
                {isAuthenticated && (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <TextField id="comment" label={dictionary["Add a comment"][lang]} fullWidth multiline rows={4} value={comment} onChange={(e) => setComment(e.target.value)} margin="normal" style={{ marginLeft: "10px" }} />
                    <IconButton onClick={handleComment} style={{ marginLeft: "10px" }}>
                      <AddCommentIcon color="primary" />
                    </IconButton>
                  </div>
                )}
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
            <div style={{ display: "flex", alignItems: "center" }}>
              {!isAuthenticated ? (
                <IconButton>
                  <FavoriteIcon color="primary" />
                </IconButton>
              ) : (
                <IconButton onClick={handleLike}>{liked ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}</IconButton>
              )}
              <Typography variant="subtitle1" gutterBottom>
                {likes}
              </Typography>
            </div>
          </Grid>
        )}
      </div>
    );
  }
};

export default ItemPage;
