import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { API_URL } from "./Login";

const useStyles = makeStyles({
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textField: {
    margin: "10px 0",
  },
});

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const classes = useStyles();

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
    <Container maxWidth="sm">
      <form className={classes.form} onSubmit={Register}>
        <h3>{msg}</h3>
        <TextField label="Name" type="text" className={classes.textField} value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Email" type="text" className={classes.textField} value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" className={classes.textField} value={password} onChange={(e) => setPassword(e.target.value)} />
        <TextField label="Confirm Password" type="password" className={classes.textField} value={confPassword} onChange={(e) => setConfPassword(e.target.value)} />
        <Button type="submit" variant="contained" color="primary">
          Register
        </Button>
      </form>
    </Container>
  );
};

export default Register;
