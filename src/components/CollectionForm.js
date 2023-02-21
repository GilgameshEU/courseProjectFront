import React, { useState, useContext } from "react";
import { TextField, Button } from "@mui/material";
import { useStyles } from "../styles";
import { AuthContext } from "./AuthContext";

const CollectionForm = ({ onSave, onCancel, initialValues }) => {
  const classes = useStyles();
  const [name, setName] = useState(initialValues.name || "");
  const [description, setDescription] = useState(initialValues.description || "");
  const [theme, setTheme] = useState(initialValues.theme || "");
  const [imageUrl, setImageUrl] = useState(initialValues.imageUrl || "");

  const { userId } = useContext(AuthContext);

  const handleSave = (e) => {
    e.preventDefault();
    onSave({ name, description, theme, imageUrl, userId });
  };

  return (
    <form onSubmit={handleSave}>
      <TextField label="Name" required fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="Description" fullWidth multiline rows={4} margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
      <TextField label="Theme" fullWidth margin="normal" value={theme} onChange={(e) => setTheme(e.target.value)} />
      <TextField label="Image URL" fullWidth margin="normal" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
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
