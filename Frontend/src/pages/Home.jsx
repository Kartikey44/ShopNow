import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
    </>
  );
}

export default Home;