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
import ProductReviews from "../pages/Detail/partials/ProductReviews";

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
        <Route path="/checkout" element={<Checkout />}></Route>
        <Route
          path="/comment"
          element={<ProductReviews productId="272126105" spid="272126106" />}
        ></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default MainRoutes;
