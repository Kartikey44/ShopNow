import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../api/axios";
import ProductCard from "../components/ProductCard";

function Collections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "-createdAt",
  });

  useEffect(() => {
    let active = true;
    axiosInstance
      .get("/categories")
      .then(({ data }) => {
        if (active) setCategories(data.categories || []);
      })
      .catch(() => {
        if (active) setError("Categories could not be loaded.");
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      const params = { page, limit: 12, sort: filters.sort };
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });
      setSearchParams(
        Object.fromEntries(
          Object.entries(filters).filter(([, value]) => Boolean(value)),
        ),
        { replace: true },
      );
      try {
        const { data } = await axiosInstance.get("/products", { params });
        if (!active) return;
        setProducts(data.products || []);
        setTotalPages(Math.max(1, data.totalPages || 1));
      } catch {
        if (active) {
          setProducts([]);
          setError("Products could not be loaded. Check the API connection and try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [filters, page, setSearchParams]);

  const changeFilter = (event) => {
    setPage(1);
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  return (
    <main className="min-h-screen bg-[#06110d] px-4 py-10 pb-24 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">ShopNow store</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Shop products</h1>
          <p className="mt-2 text-sm text-gray-400">Search and filter live products from our catalog.</p>
        </header>

        <section aria-label="Product filters" className="mb-8 grid gap-3 rounded-xl border border-emerald-900/50 bg-[#0b1914] p-4 sm:grid-cols-2 lg:grid-cols-5">
          <label className="text-xs text-gray-400">
            Search
            <input className="checkout-input mt-2" name="keyword" onChange={changeFilter} placeholder="Product name" value={filters.keyword} />
          </label>
          <label className="text-xs text-gray-400">
            Category
            <select className="checkout-input mt-2" name="category" onChange={changeFilter} value={filters.category}>
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>{category.categoryName}</option>
              ))}
            </select>
          </label>
          <label className="text-xs text-gray-400">
            Minimum price
            <input className="checkout-input mt-2" min="0" name="minPrice" onChange={changeFilter} type="number" value={filters.minPrice} />
          </label>
          <label className="text-xs text-gray-400">
            Maximum price
            <input className="checkout-input mt-2" min="0" name="maxPrice" onChange={changeFilter} type="number" value={filters.maxPrice} />
          </label>
          <label className="text-xs text-gray-400">
            Sort
            <select className="checkout-input mt-2" name="sort" onChange={changeFilter} value={filters.sort}>
              <option value="-createdAt">Newest</option>
              <option value="originalPrice">Price: low to high</option>
              <option value="-originalPrice">Price: high to low</option>
              <option value="productName">Name</option>
            </select>
          </label>
        </section>

        {error && <p className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200" role="alert">{error}</p>}
        {loading ? (
          <p aria-live="polite" className="py-16 text-center text-gray-400">Loading products…</p>
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-emerald-900/50 bg-[#0b1914] py-16 text-center">
            <h2 className="text-xl font-medium">No products found</h2>
            <p className="mt-2 text-sm text-gray-500">Try changing or clearing the filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {products.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        )}

        <nav aria-label="Product pages" className="mt-8 flex items-center justify-center gap-5">
          <button className="rounded-lg border border-emerald-800 px-4 py-2 disabled:opacity-40" disabled={page <= 1 || loading} onClick={() => setPage((current) => current - 1)} type="button">Previous</button>
          <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
          <button className="rounded-lg border border-emerald-800 px-4 py-2 disabled:opacity-40" disabled={page >= totalPages || loading} onClick={() => setPage((current) => current + 1)} type="button">Next</button>
        </nav>
      </div>
    </main>
  );
}

export default Collections;
