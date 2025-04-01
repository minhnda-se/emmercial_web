import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../layouts/Header";
import PageNotFound from "../layouts/PageNotFound";
import Footer from "../layouts/Footer/Footer";
import Home from "../pages/Home";
import Login from "../pages/Login";
const MainRoutes = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>}></Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default MainRoutes;
