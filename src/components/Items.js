import React, { useState, useEffect, useContext } from "react";
import { useStyles } from "../styles";
import { API_URL } from "./Login";
import axios from "axios";
import { Typography, TextField, Grid, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Autocomplete } from "@mui/material";
import { AuthContext, AuthProvider } from "./AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { dictionary } from "../locale/dictionary.js";

const Items = () => {
  const classes = useStyles();
  const [collections, setCollections] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, setName, setIsAuthenticated, name, lang, setLang, theme, setTheme, role, setRole, setUserId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tagValue, setTagValue] = useState("");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tag = searchParams.get("tag");

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
    setTagValue(tag || "");
  }, [tag]);

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
    { field: "name", headerName: dictionary["Name"][lang], width: 250 },
    { field: "description", headerName: dictionary["Description"][lang], width: 400 },
    { field: "collection", headerName: dictionary["Collection"][lang], width: 200, valueGetter: (params) => params.row.collection.name },
    { field: "tags", headerName: dictionary["Tags"][lang], width: 200 },
    { field: "createdAt", headerName: dictionary["CreatedAt"][lang], width: 200, valueGetter: (params) => new Date(params.row.createdAt).toLocaleString() },
  ];
  console.log(tagValue);
  return (
    <div className={classes.root} style={{ background: theme === "light" ? "#FFFFFF" : "#8a8a8a" }}>
      <Typography variant="h6" gutterBottom>
        {dictionary["Items"][lang]}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <Autocomplete options={collections} getOptionLabel={(option) => option.name} value={selectedCollection} onChange={handleCollectionChange} renderInput={(params) => <TextField {...params} label={dictionary["Enter collection"][lang]} variant="outlined" />} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Autocomplete
            multiple
            options={Array.from(new Set(tags))}
            getOptionLabel={(option) => option}
            value={selectedTags}
            onChange={handleTagsChange}
            inputValue={tagValue}
            onInputChange={(event, newInputValue) => {
              setTagValue(newInputValue);
            }}
            renderInput={(params) => <TextField {...params} label={dictionary["Enter tags"][lang]} variant="outlined" />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Button variant="outlined" onClick={handleClearFilters}>
            {dictionary["Reset filters"][lang]}
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
            navigate(`/itemPage/${params.row.id}`);
          }}
        />
      </div>
    </div>
  );
};

export default Items;
