import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Error from "../error/Error";
import "./admin.scss";
import HeaderAdmin from "./headerAdmin/HeaderAdmin";
import AddressAdmin from "./mainAdmin/contentAdmin/addressAdmin/AddressAdmin";
import BlogAdmin from "./mainAdmin/contentAdmin/blogAdmin/BlogAdmin";
import BrandAdmin from "./mainAdmin/contentAdmin/brandAdmin/BrandAdmin";
import CategoryAdmin from "./mainAdmin/contentAdmin/categoryAdmin/CategoryAdmin";
import HomeAdmin from "./mainAdmin/contentAdmin/homeAdmin/HomeAdmin";
import OrderAdmin from "./mainAdmin/contentAdmin/orderAdmin/OrderAdmin";
import OrderDetails from "./mainAdmin/contentAdmin/orderAdmin/getAllOrderAdmin/orderListAdminDetails/OrderListAdminDetails";
import PaymentAdmin from "./mainAdmin/contentAdmin/paymentAdmin/PaymentAdmin";
import ProductAdmin from "./mainAdmin/contentAdmin/productAdmin/ProductAdmin";
import AddProductAdmin from "./mainAdmin/contentAdmin/productAdmin/addProductAdmin/AddProductAdmin";
import SideBarAdmin from "./mainAdmin/sideBarAdmin/SideBarAdmin";

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      <HeaderAdmin />
      <div className="bottom-container-admin">
        <div className="side-bar-container-admin">
          <SideBarAdmin />
        </div>
        <div className="content-container-admin">
          <Routes>
            <Route index element={<HomeAdmin />} />
            <Route path="home" element={<HomeAdmin />} />
            <Route path="address/*" element={<AddressAdmin />} />
            <Route path="blog/*" element={<BlogAdmin />} />
            <Route path="addproducadmin" element={<AddProductAdmin />} />
            <Route path="product/*" element={<ProductAdmin />} />
            <Route path="brand/*" element={<BrandAdmin />} />
            <Route path="category/*" element={<CategoryAdmin />} />
            <Route path="orders/*" element={<OrderAdmin />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="payment/*" element={<PaymentAdmin />} /> {/* Sửa lại */}
            <Route path="*" element={<Error />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;