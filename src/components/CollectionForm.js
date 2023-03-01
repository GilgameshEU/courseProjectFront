import React, { useState, useContext, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { useStyles } from "../styles";
import { AuthContext } from "./AuthContext";
import { s3 } from "../actions/axiosJWT.js";
import axios from "axios";
import { API_URL } from "./Login";
import { dictionary } from "../locale/dictionary.js";

const CollectionForm = ({ onSave, onCancel, initialValues }) => {
  const classes = useStyles();
  const [name, setName] = useState(initialValues.name || "");
  const [description, setDescription] = useState(initialValues.description || "");
  const [theme, setTheme] = useState(initialValues.themeId || 1);
  const [image, setImage] = useState(initialValues.image || "");
  const [dragging, setDragging] = useState(false);

  const { userId, lang } = useContext(AuthContext);
  const [themes, setThemes] = useState([]);

  const handleSave = (e) => {
    e.preventDefault();
    onSave({ name, description, themeId: theme, image, userId });
  };

  const getThemes = async () => {
    try {
      const response = await axios.get(`${API_URL}themes`);
      setThemes(response.data);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getThemes();
  }, []);

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

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  return (
    <form onSubmit={handleSave}>
      <TextField label={dictionary["Name"][lang]} required fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label={dictionary["Description"][lang]} fullWidth multiline rows={4} margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />

      <div>
        <label htmlFor="theme-select">{dictionary["Theme"][lang]}</label>
        <select id="theme-select" value={theme} onChange={handleThemeChange}>
          {themes.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </select>
      </div>
      <div className={classes.formDragAndDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        <div className={dragging ? classes.formDragAndDropDragging : classes.formDragAndDropArea}>{dictionary["DragDrop"][lang]}</div>
      </div>
      <TextField label={dictionary["Image URL"][lang]} fullWidth margin="normal" value={image} onChange={(e) => setImage(e.target.value)} />
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

export default CollectionForm;
