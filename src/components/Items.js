import React, { useState, useEffect, useContext } from "react";
import { useStyles } from "../styles";
import { API_URL } from "./Login";
import axios from "axios";
import { Typography, TextField, Grid, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Autocomplete } from "@mui/material";
import { AuthContext, AuthProvider } from "./AuthContext";
import { Link } from "react-router-dom";
const Items = () => {
  const classes = useStyles();
  const [collections, setCollections] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, setName, setIsAuthenticated, name, lang, setLang, theme, setTheme, role, setRole, setUserId } = useContext(AuthContext);

  const getCollections = async () => {
    try {
      const response = await axios.get(`${API_URL}collections`);
      setCollections(response.data);
    } catch (error) {
      throw error;
    }
  };

  const getAllItems = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}collections/items`;
      if (selectedCollection) {
        url += `?collection=${selectedCollection.id}`;
      }
      if (selectedTags.length > 0) {
        url += `${selectedCollection ? "&" : "?"}tags=${selectedTags.join(",")}`;
      }
      const response = await axios.get(url);
      setItems(response.data);
      setTags(response.data.flatMap((item) => item.tags.split(",")));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  useEffect(() => {
    getAllItems();
  }, [selectedCollection, selectedTags]);

  const handleCollectionChange = (event, newValue) => {
    setSelectedCollection(newValue);
  };

  const handleTagsChange = (event, newValue) => {
    setSelectedTags(newValue);
  };

  const handleClearFilters = () => {
    setSelectedCollection(null);
    setSelectedTags([]);
  };

  const columns = [
    { field: "name", headerName: "Name", width: 250 },
    { field: "description", headerName: "Description", width: 400 },
    { field: "collection", headerName: "Collection", width: 200, valueGetter: (params) => params.row.collection.name },
    { field: "tags", headerName: "Tags", width: 200 },
    { field: "createdAt", headerName: "Created At", width: 200, valueGetter: (params) => new Date(params.row.createdAt).toLocaleString() },
    {
      field: "itemPageLink",
      headerName: "Link",
      width: 200,
      renderCell: (params) => (
        <Link to={`/item/${params.row.id}`} onClick={() => (window.location.href = `/item/${params.row.id}`)}>
          Open
        </Link>
      ),
    },
  ];

  console.log("collect", selectedCollection);
  console.log("tags", selectedTags);

  return (
    <div className={classes.root}>
      <Typography variant="h6" gutterBottom>
        Items
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <Autocomplete options={collections} getOptionLabel={(option) => option.name} value={selectedCollection} onChange={handleCollectionChange} renderInput={(params) => <TextField {...params} label="Введите название коллекции" variant="outlined" />} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Autocomplete multiple options={Array.from(new Set(tags))} getOptionLabel={(option) => option} value={selectedTags} onChange={handleTagsChange} renderInput={(params) => <TextField {...params} label="Введите теги" variant="outlined" />} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Button variant="outlined" onClick={handleClearFilters}>
            Сбросить фильтры
          </Button>
        </Grid>
      </Grid>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={items}
          columns={columns}
          loading={loading}
          components={{
            Toolbar: GridToolbar,
          }}
          disableSelectionOnClick
          onRowClick={(params) => {
            const url = `/item/${params.row.id}`;
            window.open(url, "_blank");
          }}
        />
      </div>
    </div>
  );
};

export default Items;
