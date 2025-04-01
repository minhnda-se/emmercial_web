import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../layouts/Header";
import PageNotFound from "../layouts/PageNotFound";
import Footer from "../layouts/Footer/Footer";
import Home from "../pages/Home";
import DetailPng from "../components/DetailPng/DetailPng";
import Detail from "../pages/Detail/Detail";
const MainRoutes = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/detail" element={<Detail />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default MainRoutes;
