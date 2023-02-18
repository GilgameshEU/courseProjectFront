//import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import jwt_decode from "jwt-decode";
import { API_URL } from "./Login";
import { useStyles } from "../styles";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Tooltip } from "@material-ui/core";
import { ExitToApp as ExitToAppIcon, Home as HomeIcon, Search as SearchIcon, Brightness4 as DarkIcon, Brightness7 as LightIcon } from "@material-ui/icons";
import Flag from "react-world-flags";

import axiosJWT, { refreshToken, logout, currentUser } from "../actions/axiosJWT.js";

const Navbar = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      setName(decoded.name);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setName("");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleLogin = async () => {
    navigate("/login");
  };

  const handleRegister = async () => {
    navigate("/register");
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Button onClick={() => navigate("/")} className={classes.button}>
            <HomeIcon />
          </Button>
          <SearchIcon className={classes.search} />
          <input type="text" placeholder="Search site" value={search} onChange={(e) => setSearch(e.target.value)} className={classes.search} />
          <Box className={classes.title} />
          {isAuthenticated ? (
            <>
              <Button onClick={() => navigate("/myCollections")} className={classes.button}>
                My Collections
              </Button>
              <Button onClick={() => navigate("/dashboard")} className={classes.button}>
                Dashboard
              </Button>
              <Typography className={classes.typography}>Welcome back, {name}</Typography>
              <Button onClick={handleLogout} className={classes.button}>
                <ExitToAppIcon />
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleLogin} className={classes.button}>
                Login
              </Button>
              <Button onClick={handleRegister} className={classes.button}>
                Register
              </Button>
            </>
          )}
          <Tooltip title={lang === "en" ? "Switch to Russian" : "Переключить на английский"}>
            <IconButton onClick={() => setLang(lang === "en" ? "ru" : "en")} className={classes.iconButton}>
              {lang === "en" ? <Flag code="GB" height="30" width="30" /> : <Flag code="RU" height="30" width="30" />}
            </IconButton>
          </Tooltip>

          <Tooltip title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}>
            <IconButton onClick={() => setTheme(theme === "light" ? "dark" : "light")} className={classes.iconButton}>
              {theme === "light" ? <LightIcon /> : <DarkIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;

// const Logout = async () => {
//   try {
//     await axiosJWT.delete(`${API_URL}logout`);
//     navigate("/");
//     //  refreshToken();
//   } catch (error) {
//     console.log(error);
//   }
// };
