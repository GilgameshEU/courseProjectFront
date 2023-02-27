import React, { useState, useContext } from "react";
import { TextField, Button } from "@mui/material";
import { useStyles } from "../styles";
import { AuthContext } from "./AuthContext";
import { s3 } from "../actions/axiosJWT.js";

const CollectionForm = ({ onSave, onCancel, initialValues }) => {
  const classes = useStyles();
  const [name, setName] = useState(initialValues.name || "");
  const [description, setDescription] = useState(initialValues.description || "");
  const [theme, setTheme] = useState(initialValues.theme || "");
  const [image, setImage] = useState(initialValues.image || "");
  const [dragging, setDragging] = useState(false);

  const { userId } = useContext(AuthContext);

  const handleSave = (e) => {
    e.preventDefault();
    onSave({ name, description, theme, image, userId });
  };

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

  return (
    <form onSubmit={handleSave}>
      <TextField label="Name" required fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="Description" fullWidth multiline rows={4} margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
      <TextField label="Theme" fullWidth margin="normal" value={theme} onChange={(e) => setTheme(e.target.value)} />
      <div className={classes.formDragAndDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        <div className={dragging ? classes.formDragAndDropDragging : classes.formDragAndDropArea}>Drag & Drop an image here</div>
      </div>
      <TextField label="Image URL" fullWidth margin="normal" value={image} onChange={(e) => setImage(e.target.value)} />
      <div className={classes.formButtons}>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
        <Button variant="contained" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CollectionForm;
