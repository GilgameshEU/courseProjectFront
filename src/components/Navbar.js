import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import jwt_decode from "jwt-decode";
import { API_URL } from "./Login";
import { useStyles } from "../styles";
import { AppBar, Toolbar, Typography, Button, Box } from "@material-ui/core";
import { ExitToApp as ExitToAppIcon, Home as HomeIcon, Search as SearchIcon, Brightness4 as DarkIcon, Brightness7 as LightIcon } from "@material-ui/icons";

const Navbar = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

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
              <Button onClick={() => navigate("/collections")}>
                <Typography variant="h6" style={{ color: "white" }}>
                  My Collections
                </Typography>
              </Button>
              <Button onClick={() => navigate("/dashboard")}>
                <Typography variant="h6" style={{ color: "white" }}>
                  Dashboard{" "}
                </Typography>
              </Button>
              <Typography variant="h6" style={{ color: "white" }}>
                Welcome back, {name}
              </Typography>
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
