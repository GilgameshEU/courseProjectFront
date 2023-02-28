import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Home from "./components/Home";
import MyCollections from "./components/MyCollections";
import Items from "./components/Items";
import ItemPage from "./components/ItemPage";

import { AuthProvider } from "./components/AuthContext";

import React, { useState } from "react";
export const AuthContext = React.createContext();

function App() {
  //const [isAuth, setIsAuth] = useState(false);
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/myCollections" element={<MyCollections />}></Route>
          <Route path="/items" element={<Items />}></Route>
          <Route path="/itemPage/:id" element={<ItemPage />}></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
