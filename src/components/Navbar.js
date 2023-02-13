import axios from "axios";
import { useNavigate } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import HomeIcon from "@material-ui/icons/Home";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import React, { useState, useEffect, useContext } from "react";
import jwt_decode from "jwt-decode";
import { Box, Typography } from "@material-ui/core";
import { API_URL } from "./Login";
//import jwt, { refreshToken } from "../actions/jwt";
import { useStyles } from "../styles";

const Navbar = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [expire, setExpire] = useState("");
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState("");
  const [theme, setTheme] = useState("light");

  const Logout = async () => {
    try {
      await axios.delete(`${API_URL}logout`);
      navigate("/");
      //  refreshToken();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get(`${API_URL}token`);
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.name);
      setIsAuthenticated(true);
      // setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };
  console.log(token);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Button href="/" color="inherit">
            <HomeIcon />
          </Button>
          <SearchIcon className={classes.search} />
          <input type="text" placeholder="Search site" value={search} onChange={(e) => setSearch(e.target.value)} className={classes.search} />
          <Box className={classes.title} />
          {isAuthenticated ? (
            <>
              <Typography variant="h6">Welcome back, {name}</Typography>
              <Button onClick={Logout} color="inherit">
                <ExitToAppIcon />
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  navigate("/login");
                }}>
                <Typography variant="h6" style={{ color: "white" }}>
                  Login
                </Typography>
              </Button>
              <Button
                onClick={() => {
                  navigate("/register");
                }}>
                <Typography variant="h6" style={{ color: "white" }}>
                  Register
                </Typography>
              </Button>
            </>
          )}
          <Button onClick={() => setLang(lang === "en" ? "ru" : "en")} color="inherit">
            {lang === "en" ? "RU" : "EN"}
          </Button>
          <Button onClick={() => setTheme(theme === "light" ? "dark" : "light")} color="inherit">
            {theme === "light" ? "Dark" : "Light"}
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
