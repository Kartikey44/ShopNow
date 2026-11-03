import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Minus, Plus, ShoppingBag, Truck, ShieldCheck } from "lucide-react";
import axiosInstance from "../api/axios";
import { addProductToCart } from "../features/cart/cartSlice";
import { selectCurrentUser } from "../features/auth/authSlice";

function Products() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loadedProductId, setLoadedProductId] = useState(null);
  const loading = loadedProductId !== productId;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    axiosInstance
      .get(`/products/${productId}`)
      .then(({ data }) => {
        if (active) {
          setProduct(data.product);
          setLoadedProductId(productId);
          setError("");
        }
      })
      .catch((requestError) => {
        if (active) {
          setProduct(null);
          setLoadedProductId(productId);
          setError(requestError.response?.data?.message || "Product could not be loaded.");
        }
      });
    return () => {
      active = false;
    };
  }, [productId]);

  const addToCart = async (goToCart = false) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSubmitting(true);
    setError("");
    const result = await dispatch(addProductToCart({ productId, quantity }));
    setSubmitting(false);
    if (addProductToCart.fulfilled.match(result)) {
      if (goToCart) navigate("/cart");
    } else {
      setError(result.payload || "Unable to add this product to your cart.");
    }
  };

  if (loading) return <main className="min-h-screen bg-[#06110d] p-10 text-center text-gray-400">Loading product…</main>;
  if (!product) {
    return (
      <main className="min-h-screen bg-[#06110d] px-4 py-20 text-center text-white">
        <p role="alert">{error || "Product not found."}</p>
        <Link className="mt-5 inline-block text-emerald-400" to="/collection">Back to products</Link>
      </main>
    );
  }

  const images = product.images || [];
  const price = product.discountPrice > 0 ? product.discountPrice : product.originalPrice;

  return (
    <main className="min-h-screen bg-[#06110d] px-4 py-10 pb-24 text-white sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:gap-16">
        <section>
          <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[#0b1914]">
            {images[selectedImage]?.url && <img alt={product.productName} className="h-full w-full object-cover" src={images[selectedImage].url} />}
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-3">
              {images.map((image, index) => (
                <button aria-label={`Show product image ${index + 1}`} className={`aspect-square overflow-hidden rounded-lg border-2 ${selectedImage === index ? "border-emerald-500" : "border-emerald-900"}`} key={image.public_id || image.url} onClick={() => setSelectedImage(index)} type="button">
                  <img alt="" className="h-full w-full object-cover" src={image.url} />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col justify-center">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">{product.category?.categoryName || "ShopNow"}</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{product.productName}</h1>
          <p className="mt-2 text-sm text-gray-400">{product.brand}</p>
          <p className="mt-6 text-3xl font-semibold text-emerald-400">₹{Number(price).toLocaleString("en-IN")}
            {product.discountPrice > 0 && <span className="ml-3 text-lg text-gray-500 line-through">₹{Number(product.originalPrice).toLocaleString("en-IN")}</span>}
          </p>
          <p className="mt-6 whitespace-pre-line leading-7 text-gray-300">{product.description}</p>
          <p className={`mt-5 text-sm ${product.stockQuantity > 0 ? "text-emerald-400" : "text-red-300"}`}>
            {product.stockQuantity > 0 ? `${product.stockQuantity} available` : "Out of stock"}
          </p>
          <div className="mt-5 flex w-fit items-center rounded-lg border border-emerald-900">
            <button aria-label="Decrease quantity" className="p-3 text-gray-300 disabled:opacity-40" disabled={quantity <= 1} onClick={() => setQuantity((current) => Math.max(1, current - 1))} type="button"><Minus size={16} /></button>
            <span className="w-10 text-center">{quantity}</span>
            <button aria-label="Increase quantity" className="p-3 text-gray-300 disabled:opacity-40" disabled={quantity >= product.stockQuantity} onClick={() => setQuantity((current) => Math.min(product.stockQuantity, current + 1))} type="button"><Plus size={16} /></button>
          </div>
          {error && <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200" role="alert">{error}</p>}
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-emerald-500 text-emerald-300 disabled:opacity-50" disabled={submitting || product.stockQuantity < 1} onClick={() => addToCart()} type="button"><ShoppingBag size={18} />{submitting ? "Adding…" : "Add to Cart"}</button>
            <button className="min-h-12 rounded-lg bg-emerald-500 font-semibold text-[#03100a] disabled:opacity-50" disabled={submitting || product.stockQuantity < 1} onClick={() => addToCart(true)} type="button">Buy Now</button>
          </div>
          <div className="mt-8 grid gap-4 border-t border-emerald-900/50 pt-6 text-sm sm:grid-cols-2">
            <p className="flex items-center gap-3"><Truck className="text-emerald-400" size={20} /> Stock ships after checkout</p>
            <p className="flex items-center gap-3"><ShieldCheck className="text-emerald-400" size={20} /> Secure checkout</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Products;
