import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Home from "./components/Home";

import React, { useState } from "react";
export const AuthContext = React.createContext();

function App() {
  //const [isAuth, setIsAuth] = useState(false);
  return (
    // <AuthContext.Provider value={{ isAuth, setIsAuth }}>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Routes>
    </BrowserRouter>
    //  </AuthContext.Provider>
  );
}

export default App;
