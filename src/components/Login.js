import React, { useState, useContext } from "react";
//import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Grid, Paper, TextField, Button } from "@material-ui/core";
import { useStyles } from "../styles";
import axiosJWT, { refreshToken, logout, currentUser, auth } from "../actions/axiosJWT.js";
import { AuthContext } from "./AuthContext";

export const API_URL = `http://localhost:5000/`; // const API_URL = "https://coursebackproject.onrender.com/";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const classes = useStyles();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await auth(email, password);
    if (result.success) {
      navigate("/");
    } else {
      setMsg(result.data);
    }
    console.log("result is " + result.success);
  };
  return (
    <div className={classes.root}>
      <Grid container className={classes.formContainer}>
        <Grid item xs={6}>
          <Paper className={classes.formPaper}>
            <p>{msg}</p>
            <TextField label="Email or Username" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" />
            <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
              Login
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
