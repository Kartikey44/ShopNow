import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { addItem } from "../features/cart/cartSlice";

function Products() {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [liked, setLiked] = useState(false);

  const product = {
    id: "premium-oversized-t-shirt",
    name: "Premium Oversized T-Shirt",
    category: "Men / T-Shirts",
    price: 1299,
    originalPrice: 1799,
    discount: 28,
    rating: 4.8,
    reviews: 124,
    description:
      "A premium oversized t-shirt designed for everyday comfort and effortless style. Made from heavyweight cotton with a relaxed silhouette.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1000",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1000",
      "https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=1000",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const previousImage = () => {
    setSelectedImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1,
    );
  };

  const nextImage = () => {
    setSelectedImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1,
    );
  };

  const handleAddToCart = () => {
    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        size: selectedSize,
        color: "Black",
        price: product.price,
        quantity,
        image: product.images[0],
      }),
    );
  };

  return (
    <div className="min-h-screen bg-[#06110d] text-white">
      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ================= IMAGE SECTION ================= */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-[4/5] bg-[#0b1914] rounded-2xl overflow-hidden border border-emerald-900/40">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Discount */}
              <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-emerald-500 text-[#03100a] text-xs font-bold">
                {product.discount}% OFF
              </div>

              {/* Wishlist */}
              <button
                onClick={() => setLiked(!liked)}
                className="absolute top-5 right-5 w-11 h-11 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-black/70 transition"
              >
                <Heart
                  size={20}
                  className={
                    liked ? "fill-emerald-400 text-emerald-400" : "text-white"
                  }
                />
              </button>

              {/* Previous */}
              <button
                onClick={previousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-emerald-500 hover:text-black transition"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Next */}
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-emerald-500 hover:text-black transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === index
                      ? "border-emerald-500"
                      : "border-emerald-900/40 hover:border-emerald-700"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ================= PRODUCT DETAILS ================= */}
          <div className="flex flex-col justify-center">
            {/* Category */}
            <p className="text-sm text-emerald-400 uppercase tracking-[0.2em] mb-3">
              {product.category}
            </p>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-5">
              <div className="flex items-center gap-1">
                <span className="text-emerald-400">★</span>
                <span className="font-medium">{product.rating}</span>
              </div>

              <span className="text-gray-600">|</span>

              <span className="text-sm text-gray-400">
                {product.reviews} Reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mt-7">
              <span className="text-3xl font-semibold text-emerald-400">
                ₹{product.price.toLocaleString("en-IN")}
              </span>

              <span className="text-lg text-gray-600 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>

              <span className="text-sm text-emerald-400">
                Save ₹
                {(product.originalPrice - product.price).toLocaleString(
                  "en-IN",
                )}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-400 leading-relaxed mt-7 max-w-xl">
              {product.description}
            </p>

            <div className="h-px bg-emerald-900/40 my-7" />

            {/* Size */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Select Size</span>

                <button className="text-sm text-emerald-400 hover:text-emerald-300">
                  Size Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-12 rounded-lg border text-sm font-medium transition ${
                      selectedSize === size
                        ? "bg-emerald-500 border-emerald-500 text-[#03100a]"
                        : "border-emerald-900/60 text-gray-300 hover:border-emerald-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-7">
              <span className="block font-medium mb-4">Quantity</span>

              <div className="flex items-center w-fit border border-emerald-900/60 rounded-lg">
                <button
                  onClick={decreaseQuantity}
                  className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-white hover:bg-emerald-900/30 rounded-l-lg transition"
                >
                  <Minus size={16} />
                </button>

                <span className="w-12 text-center">{quantity}</span>

                <button
                  onClick={increaseQuantity}
                  className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-white hover:bg-emerald-900/30 rounded-r-lg transition"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
              <button
                className="h-13 rounded-lg border border-emerald-600 text-emerald-400 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-[#03100a] transition"
                onClick={handleAddToCart}
                type="button"
              >
                <ShoppingBag size={19} />
                Add to Cart
              </button>

              <button className="h-13 rounded-lg bg-emerald-500 text-[#03100a] font-semibold hover:bg-emerald-400 transition hover:shadow-lg hover:shadow-emerald-500/20">
                Buy Now
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-7 border-t border-emerald-900/40">
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-emerald-400 shrink-0" />

                <div>
                  <p className="text-xs font-medium">Free Shipping</p>
                  <p className="text-[11px] text-gray-600">
                    On orders over ₹999
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <RotateCcw size={20} className="text-emerald-400 shrink-0" />

                <div>
                  <p className="text-xs font-medium">Easy Returns</p>
                  <p className="text-[11px] text-gray-600">
                    7 day return policy
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-emerald-400 shrink-0" />

                <div>
                  <p className="text-xs font-medium">Secure Payment</p>
                  <p className="text-[11px] text-gray-600">
                    100% secure checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
