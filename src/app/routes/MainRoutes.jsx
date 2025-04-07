import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "../layouts/Header";
import PageNotFound from "../layouts/PageNotFound";
import Footer from "../layouts/Footer/Footer";
import Home from "../pages/Home";
import Loading from "../components/Loading";
import DetailPng from "../components/DetailPng/DetailPng";
import Detail from "../pages/Detail/Detail";
import Login from "../pages/Login";
import Checkout from "../pages/Checkout";
import Search from "../pages/Search/Search";
import ProductReviews from "../pages/Detail/partials/ProductReviews";
import Cart from "../pages/Cart";
import ScrollToTop from "../components/ScrollToTop";

const MainRoutes = () => {
  const ScrollToTop = () => {
    const location = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [location]); // This will trigger on route change

    return null;
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/detail/:url_key" element={<Detail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/search" element={<Search />} />
        <Route
          path="/comment"
          element={<ProductReviews productId="272126105" spid="272126106" />}
        />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default MainRoutes;
