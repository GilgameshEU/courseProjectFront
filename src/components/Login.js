import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, TextField, Button } from "@material-ui/core";

// const API_URL = "https://coursebackproject.onrender.com/";
export const API_URL = `http://localhost:5000/`;

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
}));

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const classes = useStyles();

  const Auth = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}login`, {
        email: email,
        password: password,
      });
      navigate("/");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div className={classes.root}>
      <Grid container className={classes.formContainer}>
        <Grid item xs={6}>
          <Paper className={classes.formPaper}>
            <p>{msg}</p>
            <TextField label="Email or Username" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" />
            <Button variant="contained" color="primary" fullWidth onClick={Auth}>
              Login
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
