import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Footer from "./Main/footer/Footer";
import Header from "./Main/header/Header";
import AboutUs from "./Main/pages/aboutUs/AboutUs";
import Home from "./Main/pages/home/Home";
import News from "./Main/pages/news/News";
import Shop from "./Main/pages/shop/Shop";
import ProductDetail from "./Main/pages/shop/productDetails/ProductDetails";

const User = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      <Header />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default User;
