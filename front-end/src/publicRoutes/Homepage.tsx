import React, { useEffect, useState } from "react";
import Nav from "./Nav.jsx";
import Company from "./Company.jsx";
import Footer from "./Footer.jsx";
import "./App.scss";
import api from "./api.js";
import featured from "./assets/featured-promotional-nike-jordanmid1.mp4";
import { Link } from "react-router-dom";

const Homepage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/api/products");
        setProducts(res.data);
      } catch (err) {
        console.log("Error fetching products", err);
      }
    };

    fetchProducts();
  }, []);

  const runningShoes = products
    .filter((product) => product.category === "Running Shoes")
    .slice(0, 3);

  const casualShoes = products
    .filter((product) => product.category === "Casual Sneakers")
    .slice(0, 3);

  const basketballShoes = products
    .filter((product) => product.category === "Basketball Shoes")
    .slice(0, 3);

  return (
    <div className="homepage-container">
      <Nav />
      <div className="featured-container">
        <video className="featured-video" autoPlay muted loop>
          <source src={featured} type="video/mp4" />
        </video>
        <div className="featured-information">
          <p className="featured-new">NEW</p>
          <h1 className="featured-title">NIKE Jordan 1 Mid</h1>
          <h3 className="featured-description">
            Classic silhouette with modern colorways
          </h3>
          
        </div>
      </div>
      
      
      <div className="basketball-container">
        <div className="content-title-container">
          <h1 className="content-title">BASKETBALL</h1>
        </div>
        <div className="contents">
          {basketballShoes.map((shoe, index) => {
            return (
              <Link className="shoe-id-link" to={`/products/${shoe._id}`}>
                <div
                  key={shoe._id}
                  className={`basketball-content-${index + 1}`}
                >
                  <div className="content-upper">
                    <img
                      className="product-images-temp1"
                      src={shoe.images[0]}
                      alt={shoe.name}
                    />
                  </div>
                  <div className="content-lower">
                    <h3 className={`basketball-${index + 1}-name`}>
                      {shoe.name}
                    </h3>
                    <p className={`basketball-${index + 1}-description`}>
                      {shoe.description}
                    </p>
                    <p className={`basketball-${index + 1}-price`}>
                      ${shoe.price}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <button className="button-shop-now">Shop Basketball →</button>
      </div>
      <div className="running-container">
        <div className="content-title-container">
          <h1 className="content-title">RUNNING</h1>
        </div>
        <div className="contents">
          {runningShoes.map((shoe, index) => {
            return (
              <Link className="shoe-id-link" to={`/products/${shoe._id}`}>
                <div key={shoe._id} className={`running-content-${index + 1}`}>
                  <div className="content-upper">
                    <img
                      className="product-images-temp1"
                      src={shoe.images[0]}
                      alt={shoe.name}
                    />
                  </div>
                  <div className="content-lower">
                    <h3 className={`running-${index + 1}-name`}>{shoe.name}</h3>
                    <p className={`running-${index + 1}-description`}>
                      {shoe.description}
                    </p>
                    <p className={`running-${index + 1}-price`}>
                      ${shoe.price}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <button className="button-shop-now">Shop Running →</button>
      </div>
      <div className="casual-container">
        <div className="content-title-container">
          <h1 className="content-title">CASUAL</h1>
        </div>
        <div className="contents">
          {casualShoes.map((shoe, index) => {
            return (
              <Link className="shoe-id-link" to={`/products/${shoe._id}`}>
                <div key={shoe._id} className={`casual-content-${index + 1}`}>
                  <div className="content-upper">
                    <img
                      className="product-images-temp1"
                      src={shoe.images[0]}
                      alt={shoe.name}
                    />
                  </div>
                  <div className="content-lower">
                    <h3 className={`casual-${index + 1}-name`}>{shoe.name}</h3>
                    <p className={`casual-${index + 1}-description`}>
                      {shoe.description}
                    </p>
                    <p className={`casual-${index + 1}-price`}>${shoe.price}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <button className="button-shop-now">Shop Casual →</button>
      </div>
      <Company />
      <Footer />
    </div>
  );
};

export default Homepage;
