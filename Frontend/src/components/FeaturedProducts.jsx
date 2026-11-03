import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import ProductCard from "./ProductCard";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    axiosInstance.get("/products", { params: { limit: 4, sort: "-createdAt" } })
      .then(({ data }) => {
        if (active) setProducts(data.products || []);
      })
      .catch(() => {
        if (active) setError("Featured products are temporarily unavailable.");
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="bg-[#06110d] px-4 py-14 pb-24 text-white sm:px-6 md:pb-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-400">Shop the catalog</p><h2 className="mt-2 text-3xl font-bold md:text-4xl">Featured products</h2></div>
          <Link className="text-sm text-emerald-400 hover:text-emerald-300" to="/collection">View all</Link>
        </div>
        {error && <p className="mb-4 text-sm text-gray-400">{error}</p>}
        {products.length === 0 && !error ? <p className="py-12 text-center text-gray-400">No products available yet.</p> : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">{products.map((product) => <ProductCard key={product._id} product={product} />)}</div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts;
