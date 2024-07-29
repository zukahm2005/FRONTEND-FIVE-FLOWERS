import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SellingAdmin.scss';

const SellingAdmin = () => {
  const [topSellingProducts, setTopSellingProducts] = useState([]);

  useEffect(() => {
    fetchTopSellingProducts();
  }, []);

  const fetchTopSellingProducts = async () => {
    try {
      const response = await axios.get('/api/v1/orders/top-selling-products');
      setTopSellingProducts(response.data);
    } catch (error) {
      console.error('Error fetching top selling products:', error);
    }
  };

  return (
    <div className="selling-admin-container">
      <h2>Top Selling Products</h2>
      <div className="top-selling-products">
        {topSellingProducts.map((product, index) => (
          <div key={index} className="product-card">
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <div className="product-info">
              <p className="product-name">{product.name}</p>
              <p className="product-category">{product.category}</p>
              <div className="product-details">
                <div className="product-rating">
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                  <span className="star">&#9734;</span>
                </div>
                <p className="product-price">{product.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellingAdmin;
