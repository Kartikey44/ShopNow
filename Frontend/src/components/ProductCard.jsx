import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const image = product.images?.[0]?.url;
  const price = product.discountPrice > 0
    ? product.discountPrice
    : product.originalPrice;

  return (
    <Link
      className="group overflow-hidden rounded-xl border border-emerald-900/50 bg-[#0b1914] transition hover:border-emerald-600"
      to={`/product/${product._id}`}
    >
      <div className="aspect-[4/5] overflow-hidden bg-[#07130f]">
        {image ? (
          <img
            alt={product.productName}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            src={image}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            Image unavailable
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="truncate text-sm font-medium">{product.productName}</p>
        <p className="mt-1 text-xs text-gray-500">{product.brand}</p>
        <p className="mt-3 font-semibold text-emerald-400">
          ₹{Number(price).toLocaleString("en-IN")}
          {product.discountPrice > 0 && (
            <span className="ml-2 text-xs font-normal text-gray-500 line-through">
              ₹{Number(product.originalPrice).toLocaleString("en-IN")}
            </span>
          )}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of stock"}
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;
