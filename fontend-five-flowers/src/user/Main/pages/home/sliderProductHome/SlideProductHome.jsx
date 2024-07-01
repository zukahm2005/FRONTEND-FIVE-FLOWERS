import { notification } from 'antd';
import axios from 'axios';
import { motion } from "framer-motion";
import React, { useContext, useEffect, useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { CartContext } from '../../../header/components/cart/cartContext/CartProvider';
import "./slideProductHome.scss";

const SlideProductHome = () => {
  const [products, setProducts] = useState([]);
  const { addToCart, isLoggedIn } = useContext(CartContext);
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/v1/products/all', {
      params: { page: 0, size: 10 }
    })
      .then(response => {
        const productsWithDefaultPrice = response.data.content.map(product => ({
          ...product,
          originalPrice: product.originalPrice || 1000.00,
          isOnSale: true // Mock the isOnSale property for testing
        }));
        setProducts(productsWithDefaultPrice);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleAddToCart = async (e, product) => {
    e.stopPropagation(); // Ngăn chặn sự kiện lan truyền
    if (!isLoggedIn) {
      notification.error({
        message: 'Login Required',
        description: 'Please log in to add products to your cart.',
      });
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/v1/products/get/${product.productId}`);
      const availableQuantity = response.data.quantity;

      if (availableQuantity === 0) {
        notification.error({
          message: "Out of Stock",
          description: `${product.name} is out of stock.`,
        });
        return;
      }

      await addToCart(product, 1);
      notification.success({
        message: 'Added to Cart',
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      notification.error({
        message: 'Out of Stock',
        description: `Only ${product.quantity} items left in stock.`,
      });
    }
  };

  const handleNavigateToProductDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    const swiperInstance = swiperRef.current?.swiper;

    if (!swiperInstance) return;

    const handleMouseEnter = () => {
      if (swiperInstance.autoplay && swiperInstance.autoplay.stop) {
        swiperInstance.autoplay.stop();
      }
    };

    const handleMouseLeave = () => {
      if (swiperInstance.autoplay && swiperInstance.autoplay.start) {
        swiperInstance.autoplay.start();
      }
    };

    swiperInstance.el.addEventListener('mouseenter', handleMouseEnter);
    swiperInstance.el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (swiperInstance.el) {
        swiperInstance.el.removeEventListener('mouseenter', handleMouseEnter);
        swiperInstance.el.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const shouldLoop = products.length > 3; // Adjust this value based on your slidesPerView

  return (
    <div className="slide-product-home-container">
      <div className="slide-product-home-title-main">
        <div className="slide-product-title">
          <h1>Let's Go Shopping</h1>
        </div>
      </div>

      <div className="slide-product-home-content">
        <Swiper
          ref={swiperRef}
          spaceBetween={30}
          slidesPerView={3}
          loop={shouldLoop}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          autoplay={{ 
            delay: 2000,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Autoplay]}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            990: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.productId}>
              <motion.div
                className="product-card"
                whileHover="hover"
                initial="rest"
                animate="rest"
                variants={{
                  hover: { scale: 1.05 },
                  rest: { scale: 1 },
                }}
                onClick={() => handleNavigateToProductDetails(product.productId)}
              >
                <motion.div className="image-container">
                  {product.productImages && product.productImages[0] && (
                    <div className="image1-container">
                      <img
                        src={`http://localhost:8080/api/v1/images/${product.productImages[0].imageUrl}`}
                        alt={product.name}
                        className="main-image"
                      />
                      {product.isOnSale && <span className="sale-badge">Sale</span>}
                    </div>
                  )}
                  {product.productImages && product.productImages.length > 1 && (
                    <div className="image2-container">
                      <img
                        src={`http://localhost:8080/api/v1/images/${product.productImages[1].imageUrl}`}
                        alt={product.name}
                        className="hover-image"
                      />
                    </div>
                  )}

                  <motion.div
                    className="icon-slide-product-home"
                    variants={{
                      rest: { x: "100%", opacity: 0 },
                      hover: { x: "0%", opacity: 1 },
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="icon-slide-product" onClick={(e) => handleAddToCart(e, product)}>
                      <IoCartOutline className="icon" />
                    </div>
                    <div className="icon-slide-product">
                      <IoIosSearch className="icon" />
                    </div>
                  </motion.div>
                </motion.div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="price">
                    <span className="current-price">
                      Rs. {product.price}
                    </span>
                    <span className="original-price">
                      Rs. {product.originalPrice}
                    </span>
                  </div>
                  {product.quantity === 0 && <span className="out-of-stock">Out of Stock</span>}
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
          <div className="swiper-button-container">
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </div>
        </Swiper>
      </div>
    </div>
  );
};

export default SlideProductHome;
