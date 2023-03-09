import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Paper, TextField, Button } from "@material-ui/core";
import { useStyles } from "../styles";
import { auth } from "../actions/axiosJWT.js";
import { AuthContext } from "./AuthContext";
import jwt_decode from "jwt-decode";
import { dictionary } from "../locale/dictionary.js";

export const API_URL = `http://localhost:5000/`;
//export const API_URL = "https://coursebackproject.onrender.com/";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const classes = useStyles();
  const { setName, setIsAuthenticated, setRole, setUserId, lang, theme } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await auth(email, password);
    if (result.success) {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwt_decode(token);
        setRole(decoded.role);
        setName(decoded.name);
        setUserId(decoded.userId);
      }
      setIsAuthenticated(true);
      navigate("/");
    } else {
      setMsg(result.data);
    }
    console.log("result is " + result.success);
  };

  return (
    <div className={classes.root} style={{ display: "flex", justifyContent: "space-between", background: theme === "light" ? "#FFFFFF" : "#8a8a8a" }}>
      <Grid container className={classes.formContainer}>
        <Grid item xs={6}>
          <Paper className={classes.formPaper}>
            <p>{msg}</p>
            <TextField label={dictionary["Email"][lang]} value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" />
            <TextField label={dictionary["Password"][lang]} type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" />
            <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
              {dictionary["Login"][lang]}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
