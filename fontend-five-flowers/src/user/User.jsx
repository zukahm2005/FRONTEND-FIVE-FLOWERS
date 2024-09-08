import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Error from "../error/Error";
import Footer from "./Main/footer/Footer";
import Header from "./Main/header/Header";
import CartProvider from "./Main/header/components/cart/cartContext/CartProvider";
import CartUser from "./Main/header/components/cart/cartUser/CartUser";
import CheckOut from "./Main/header/components/cart/checkOut/CheckOut";
import OrderReceive from "./Main/header/components/cart/orderReceive/OrderReceive";
import ShoppingCart from "./Main/header/components/cart/shoppingCart/ShoppingCart";
import Profile from "./Main/header/components/profile/Profile";
import AboutUs from "./Main/pages/aboutUs/AboutUs";
import Home from "./Main/pages/home/Home";
import BlogDetail from "./Main/pages/news/Blog/BlogDetail";
import News from "./Main/pages/news/News";
import Shop from "./Main/pages/shop/Shop";
import ProductDetail from "./Main/pages/shop/productDetails/ProductDetails";
import LoginAdmin from "./Main/header/components/profile/login/loginAdmin/LoginAdmin";
import YourBike from "./Main/header/components/yourBike/YourBike";
import ScrollIndicator from "./scrollLayout/ScrollIndicator";
import "./user.scss";
import CalorieChart from "./Main/header/components/calorieConsumption/CalorieChart";
import DistanceTracker from "./Main/header/components/calorieConsumption/mapComponent";
import Service from "./Main/header/components/calorieConsumption/Service";

const User = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    console.log("User component rendered");
  }, []);

  return (
    <CartProvider>
      <div className="user-container">
        <Header cart={cart} setCart={setCart} />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home setCart={setCart} cart={cart} />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:blogId" element={<BlogDetail />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shopping-cart" element={<ShoppingCart />} />
            <Route path="/checkout" element={<CheckOut />} />
            <Route path="/cart-user" element={<CartUser />} />
            <Route path="/order-receive" element={<OrderReceive />} />
            <Route path="/your-bike" element={<YourBike />} /> {/* Add this line */}
            <Route path="*" element={<Error />} />
            <Route path="/loginadmin" element={<LoginAdmin />} />
            <Route path='/calo' element={<CalorieChart />} />
            <Route path='/practice' element={<DistanceTracker />} />
            <Route path="/service" element={<Service />} />
          </Routes>
        </div>
        <ScrollIndicator />
        <Footer />
      </div>
    </CartProvider>
  );
};

export default User;
