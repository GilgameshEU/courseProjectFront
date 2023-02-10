import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, TextField, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    backgroundColor: theme.palette.grey[200],
  },
  formContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  formPaper: {
    padding: theme.spacing(2),
  },
  itemContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: theme.spacing(2),
  },
  item: {
    width: "30%",
    padding: theme.spacing(2),
    textAlign: "center",
  },
  itemImage: {
    width: "100%",
    height: 200,
    objectFit: "cover",
  },
  itemTitle: {
    marginTop: theme.spacing(2),
  },
}));

const Home = () => {
  const classes = useStyles();
  const [items, setItems] = useState([]);

  // useEffect(() => {
  //   const fetchItems = async () => {
  //     try {
  //       const response = await axios.get("/api/items");
  //       setItems(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchItems();
  // }, []);

  return (
    <div className={classes.root}>
      {/* <Grid container className={classes.formContainer}>
        <Grid item xs={6}>
          <Paper className={classes.formPaper}>
            <h2>Welcome to Your Collection</h2>
            <p>Here are some of your items:</p>
            <div className={classes.itemContainer}>
              {items.map((item) => (
                <Paper key={item._id} className={classes.item}>
                  <img src={item.imageUrl} alt={item.title} className={classes.itemImage} />
                  <h3 className={classes.itemTitle}>{item.title}</h3>
                </Paper>
              ))}
            </div>
          </Paper>
        </Grid>
      </Grid> */}
    </div>
  );
};

export default Home;
