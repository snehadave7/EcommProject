

import React, { useEffect, useState } from "react";
import Carousel from "./Carousel";
import Bestsellers from "./Bestsellers";
import Categories from "./Categories";
import Footer from "./Footer";

const Home = () => {
    const [bestsellerProducts, setBestsellerProducts] = useState([]);
    const [loading, setLoading] = useState(true);
 
    const fetchBestsellers = async () => {
      try {
        const response = await fetch("https://localhost:7152/api/Products"); // Your API endpoint
        const data = await response.json();
        const randomProducts = data.$values
          .sort(() => 0.5 - Math.random()) // Randomize the products
          .slice(0, 4); // Get top 4 products

        setBestsellerProducts(randomProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    }; 
    useEffect(() => {
      fetchBestsellers();
    }, []);

  return (
    <div>
      <Carousel />
      {!loading && <Bestsellers products={bestsellerProducts} />}
      <Categories />
      <Footer />
    </div>
  );
};

export default Home;
