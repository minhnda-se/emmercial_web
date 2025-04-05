import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../layouts/Header";
import PageNotFound from "../layouts/PageNotFound";
import Footer from "../layouts/Footer/Footer";
import Home from "../pages/Home";

import Loading from "../components/Loading";

import DetailPng from "../components/DetailPng/DetailPng";
import Detail from "../pages/Detail/Detail";

import Login from "../pages/Login";
import Checkout from "../pages/Checkout";
import Cart from "../pages/Cart";

const MainRoutes = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="*" element={<PageNotFound />} />

        <Route path="/loading" element={<Loading />} />

        {/* <Route path="/detail" element={<Detail />} /> */}
        <Route path="/detail" element={<Detail />} />
        <Route path="/checkout" element={<Checkout />}/>
        <Route path="/cart" element={<Cart/>}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default MainRoutes;
