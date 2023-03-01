import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useStyles } from "../styles";
import { Grid, Paper, TextField, Button } from "@material-ui/core";
import { API_URL } from "./Login";
import { dictionary } from "../locale/dictionary.js";
import { AuthContext } from "./AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const classes = useStyles();
  const { lang, theme } = useContext(AuthContext);

  const Register = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}users`, {
        name: name,
        email: email,
        password: password,
        confPassword: confPassword,
      });
      navigate("/");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div className={classes.root} style={{ display: "flex", justifyContent: "space-between", background: theme === "light" ? "#FFFFFF" : "#8a8a8a" }}>
      <Grid container className={classes.formContainer}>
        <Grid item xs={6}>
          <Paper className={classes.formPaper}>
            <p>{msg}</p>
            <TextField label={dictionary["Name:"][lang]} type="text" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" />
            <TextField label={dictionary["Email"][lang]} type="text" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" />
            <TextField label={dictionary["Password"][lang]} type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" />
            <TextField label={dictionary["ConfirmPassword"][lang]} type="password" value={confPassword} onChange={(e) => setConfPassword(e.target.value)} fullWidth margin="normal" />
            <Button variant="contained" color="primary" fullWidth onClick={Register}>
              Register
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Register;
