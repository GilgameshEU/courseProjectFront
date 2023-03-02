import React, { useState, useContext, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { useStyles } from "../styles";
import { AuthContext } from "./AuthContext";
import { s3 } from "../actions/axiosJWT.js";
import { API_URL } from "./Login";
import axios from "axios";
import { dictionary } from "../locale/dictionary.js";

const ItemForm = ({ onSave, onCancel, initialValues }) => {
  const classes = useStyles();
  const [itemName, setItemName] = useState(initialValues.itemName || "");
  const [description, setDescription] = useState(initialValues.description || "");
  const [collection, setCollection] = useState(initialValues.collectionId || 1);
  const [image, setImage] = useState(initialValues.image || "");
  const [tags, setTags] = useState(initialValues.tags || "");
  const [dragging, setDragging] = useState(false);
  const { userId, lang, isAuthenticated, role, name } = useContext(AuthContext);
  const [collections, setCollections] = useState([]);

  const handleSave = (e) => {
    e.preventDefault();
    onSave({ name: itemName, description, image, collectionId: collection, tags });
  };

  const getCollections = async () => {
    try {
      const response = await axios.get(`${API_URL}collections`);
      if (isAuthenticated) {
        if (role === "admin") {
          setCollections(response.data);
        } else {
          setCollections(response.data.filter((collection) => collection.user.name === name));
        }
      } else {
        setCollections([]);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  useEffect(() => {
    if (collections.length > 0) {
      setCollection(initialValues.collectionId || collections[0].id);
    }
  }, [collections]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    const fileName = file.name;
    const fileType = file.type;
    const params = {
      Bucket: "mybucketforcourseproject",
      Key: fileName,
      Body: file,
      ACL: "public-read",
      ContentType: fileType,
    };
    s3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        setImage(data.Location);
      }
    });
  };

  const handleCollectionsChange = (event) => {
    setCollection(event.target.value);
  };

  return (
    <form onSubmit={handleSave}>
      <TextField label={dictionary["Name"][lang]} required fullWidth margin="normal" value={itemName} onChange={(e) => setItemName(e.target.value)} />
      <TextField label={dictionary["Description"][lang]} fullWidth multiline rows={4} margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
      <div>
        <label htmlFor="collection-select">{dictionary["Collections"][lang]}</label>
        <select id="collection-select" value={collection} onChange={handleCollectionsChange}>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.name}
            </option>
          ))}
        </select>
      </div>
      <div className={classes.formDragAndDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        <div className={dragging ? classes.formDragAndDropDragging : classes.formDragAndDropArea}>{dictionary["DragDrop"][lang]}</div>
      </div>
      <TextField label={dictionary["Image URL"][lang]} fullWidth margin="normal" value={image} onChange={(e) => setImage(e.target.value)} />
      <TextField label={dictionary["Tags"][lang]} fullWidth margin="normal" value={tags} onChange={(e) => setTags(e.target.value)} />
      <div className={classes.formButtons}>
        <Button type="submit" variant="contained" color="primary">
          {dictionary["Save"][lang]}
        </Button>
        <Button variant="contained" color="secondary" onClick={onCancel}>
          {dictionary["Cancel"][lang]}
        </Button>
      </div>
    </form>
  );
};

export default ItemForm;
