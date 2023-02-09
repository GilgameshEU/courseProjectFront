import axios from "axios";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import PersonIcon from "@material-ui/icons/Person";
import SearchIcon from "@material-ui/icons/Search";
import HomeIcon from "@material-ui/icons/Home";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Popover from "@material-ui/core/Popover";

import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { Box, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  search: {
    padding: "10px",
    fontSize: "14px",
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [open, setOpen] = useState(false);

  const Logout = async () => {
    try {
      await axios.delete("http://localhost:5000/logout");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(true);
  };

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.name);
      setExpire(decoded.exp);
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
          <Box className={classes.title} />
          {token ? (
            <>
              <Typography variant="h6">{name}</Typography>
              <Button onClick={Logout} color="inherit">
                <ExitToAppIcon />
              </Button>
            </>
          ) : (
            <PersonIcon onClick={handleClick} />
          )}
        </Toolbar>
      </AppBar>
      <Popover
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}>
        <Box p={2}>
          <Button
            onClick={() => {
              handleClose();
              navigate("/login");
            }}>
            Login
          </Button>
          <Button
            onClick={() => {
              handleClose();
              navigate("/register");
            }}>
            Register1
          </Button>
        </Box>
      </Popover>
    </div>
  );
};

export default Navbar;

// const getUsers = async () => {
//   const response = await axiosJWT.get("http://localhost:5000/users", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   setUsers(response.data);
// };

// const axiosJWT = axios.create();
// axiosJWT.interceptors.request.use(
//   async (config) => {
//     const currentDate = new Date();
//     if (expire * 1000 < currentDate.getTime()) {
//       const response = await axios.get("http://localhost:5000/token");
//       config.headers.Authorization = `Bearer ${response.data.accessToken}`;
//       setToken(response.data.accessToken);
//       const decoded = jwt_decode(response.data.accessToken);
//       setName(decoded.name);
//       setExpire(decoded.exp);
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
