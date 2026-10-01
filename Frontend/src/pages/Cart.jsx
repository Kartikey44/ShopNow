import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseQuantity,
  increaseQuantity,
  removeItem,
  selectCartItems,
  selectCartSubtotal,
} from "../features/cart/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);

  const shipping = subtotal === 0 || subtotal >= 3000 ? 0 : 99;
  const discount = 0;
  const total = subtotal + shipping - discount;

  return (
    <div className="min-h-screen bg-[#06110d] text-white px-4 sm:px-6 lg:px-10 py-10">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <p className="text-emerald-400 text-sm uppercase tracking-[0.2em] mb-2">
          Your Bag
        </p>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold">
              Shopping Cart
            </h1>

            <p className="text-gray-500 mt-2">
              Review your items before placing your order.
            </p>
          </div>

          <span className="text-sm text-gray-400">
            {cartItems.length} Items
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* Cart Items */}
        <div className="space-y-4">
          {cartItems.length === 0 ? (
            <div className="rounded-2xl border border-emerald-900/50 bg-[#0b1914] p-8 text-center">
              <h2 className="text-xl font-semibold">Your bag is empty</h2>
              <p className="mt-2 text-sm text-gray-500">
                Add a clothing item to begin your order.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
            <div
              key={item.cartItemId}
              className="bg-[#0b1914] border border-emerald-900/50 rounded-2xl p-4 sm:p-5"
            >
              <div className="flex gap-4 sm:gap-6">
                {/* Product Image */}
                <div className="w-28 h-32 sm:w-36 sm:h-40 shrink-0 rounded-xl overflow-hidden bg-[#07130f]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h2 className="font-medium text-base sm:text-lg">
                        {item.name}
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        {item.color} · Size {item.size}
                      </p>
                    </div>

                    {/* Delete */}
                    <button
                      className="text-gray-600 hover:text-red-400 transition"
                      onClick={() => dispatch(removeItem(item.cartItemId))}
                      title="Remove item"
                      type="button"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="mt-auto pt-5 flex items-center justify-between">
                    {/* Quantity */}
                    <div className="flex items-center border border-emerald-900/60 rounded-lg">
                      <button
                        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-emerald-900/30 rounded-l-lg transition"
                        onClick={() => dispatch(decreaseQuantity(item.cartItemId))}
                        type="button"
                      >
                        <Minus size={15} />
                      </button>

                      <span className="w-9 text-center text-sm">
                        {item.quantity}
                      </span>

                      <button
                        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-emerald-900/30 rounded-r-lg transition"
                        onClick={() => dispatch(increaseQuantity(item.cartItemId))}
                        type="button"
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    {/* Price */}
                    <p className="font-semibold text-emerald-400">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            ))
          )}

          {/* Continue Shopping */}
          <Link
            to="/collection"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition mt-3"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-[#0b1914] border border-emerald-900/50 rounded-2xl p-6 sm:p-7">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            {/* Summary */}
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>

              <div className="flex justify-between text-emerald-400">
                <span>Discount</span>
                <span>- ₹{discount.toLocaleString("en-IN")}</span>
              </div>

              <div className="h-px bg-emerald-900/50 my-5" />

              <div className="flex justify-between items-center">
                <span className="text-base font-medium">Total</span>

                <span className="text-xl font-semibold text-emerald-400">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Coupon */}
            <div className="mt-7">
              <label className="text-xs text-gray-500 mb-2 block">
                HAVE A PROMO CODE?
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  className="flex-1 min-w-0 h-11 px-3 rounded-lg bg-[#07130f] border border-emerald-900/60 text-sm text-white placeholder:text-gray-600 outline-none focus:border-emerald-500 transition"
                />

                <button className="px-4 h-11 rounded-lg border border-emerald-700 text-emerald-400 text-sm hover:bg-emerald-500 hover:text-[#03100a] transition">
                  Apply
                </button>
              </div>
            </div>

            {/* Checkout */}
            <Link
              to="/place-order"
              className="mt-6 w-full h-12 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#03100a] font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-emerald-500/20"
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </Link>

            {/* Secure Checkout */}
            <p className="text-center text-xs text-gray-600 mt-5">
              Secure checkout · Safe & encrypted payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
