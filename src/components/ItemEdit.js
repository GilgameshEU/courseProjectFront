import { useState } from "react";
import axios from "axios";
import { Grid, TextField, Button } from "@material-ui/core";
import { API_URL } from "./Login";

const ItemEdit = ({ item, onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    name: item.name,
    description: item.description,
    image: item.image,
    tags: item.tags,
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}itemPage/${item.id}`, formData);
      onCancel();
    } catch (error) {
      console.error(error);
    }
  };
  console.log(formData);
  return (
    <form onSubmit={handleSave}>
      <div style={{ position: "absolute", top: "10px", right: "10px" }}> </div>
      <Grid container spacing={2}>
        {/* First column: item image */}
        <Grid item xs={12} md={3}>
          <img
            src={formData.image}
            alt={formData.name}
            style={{
              height: "100%",
              width: "100%",
              objectFit: "fill",
              border: "1px solid black",
              borderRadius: "5px",
            }}
          />
        </Grid>
        {/* Second column: item name and description */}
        <Grid item xs={12} md={3}>
          <TextField fullWidth name="name" label="Name" variant="outlined" value={formData.name} onChange={handleFormChange} required />
          <TextField fullWidth name="description" label="Description" variant="outlined" value={formData.description} onChange={handleFormChange} multiline required />
          <TextField fullWidth name="image" label="Image URL" variant="outlined" value={formData.image} onChange={handleFormChange} required />
        </Grid>
        {/* Third column: additional item fields */}
        <Grid item xs={12} md={3}>
          <TextField fullWidth name="tags" label="Tags" variant="outlined" value={formData.tags} onChange={handleFormChange} required />
          <Button type="submit" variant="contained" color="primary" onClick={onSave}>
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </Grid>
        {/* Fourth column: collection and tags */}
        <Grid item xs={12} md={3}></Grid>
      </Grid>
    </form>
  );
};

export default ItemEdit;
