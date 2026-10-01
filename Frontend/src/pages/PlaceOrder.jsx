import { useState } from "react";
import {
  MapPin,
  CreditCard,
  Banknote,
  ShieldCheck,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartSubtotal,
} from "../features/cart/cartSlice";

function PlaceOrder() {
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const orderItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);

  const [address, setAddress] = useState({
    fullname: "",
    mobile: "",
    houseNo: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const discount = 0;
  const shipping = subtotal === 0 || subtotal >= 3000 ? 0 : 99;
  const total = subtotal - discount + shipping;

  return (
    <div className="min-h-screen bg-[#06110d] text-white">
      {/* Header */}
      <header className="border-b border-emerald-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
          <Link
            to="/cart"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition"
          >
            <ArrowLeft size={17} />
            Back to Cart
          </Link>

          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck size={19} />
            <span className="text-xs sm:text-sm">Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        {/* Heading */}
        <div className="mb-10">
          <p className="text-emerald-400 text-xs uppercase tracking-[0.2em] mb-2">
            Checkout
          </p>

          <h1 className="text-3xl sm:text-4xl font-semibold">
            Complete Your Order
          </h1>

          <p className="text-gray-500 mt-2">
            Enter your delivery details and choose a payment method.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-8">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <section className="bg-[#0b1914] border border-emerald-900/50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <MapPin size={19} className="text-emerald-400" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">Delivery Address</h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="checkout-label">Full Name</label>

                  <input
                    type="text"
                    name="fullname"
                    value={address.fullname}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="checkout-input"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="checkout-label">Mobile Number</label>

                  <input
                    type="tel"
                    name="mobile"
                    value={address.mobile}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="checkout-input"
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label className="checkout-label">Pincode</label>

                  <input
                    type="text"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleChange}
                    placeholder="201301"
                    className="checkout-input"
                  />
                </div>

                {/* House */}
                <div>
                  <label className="checkout-label">House / Flat No.</label>

                  <input
                    type="text"
                    name="houseNo"
                    value={address.houseNo}
                    onChange={handleChange}
                    placeholder="House no. / Flat no."
                    className="checkout-input"
                  />
                </div>

                {/* Street */}
                <div>
                  <label className="checkout-label">Street / Area</label>

                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleChange}
                    placeholder="Street / Locality"
                    className="checkout-input"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="checkout-label">City</label>

                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="checkout-input"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="checkout-label">State</label>

                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="checkout-input"
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-[#0b1914] border border-emerald-900/50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CreditCard size={19} className="text-emerald-400" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">Payment Method</h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Choose how you want to pay
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* COD */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between text-left transition ${
                    paymentMethod === "COD"
                      ? "border-emerald-500 bg-emerald-500/5"
                      : "border-emerald-900/50 hover:border-emerald-700"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Banknote size={21} className="text-emerald-400" />

                    <div>
                      <p className="text-sm font-medium">Cash on Delivery</p>

                      <p className="text-xs text-gray-500 mt-1">
                        Pay when your order arrives
                      </p>
                    </div>
                  </div>

                  {paymentMethod === "COD" && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check size={14} className="text-[#03100a]" />
                    </div>
                  )}
                </button>

                {/* Razorpay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("RAZORPAY")}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between text-left transition ${
                    paymentMethod === "RAZORPAY"
                      ? "border-emerald-500 bg-emerald-500/5"
                      : "border-emerald-900/50 hover:border-emerald-700"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <CreditCard size={21} className="text-emerald-400" />

                    <div>
                      <p className="text-sm font-medium">Online Payment</p>

                      <p className="text-xs text-gray-500 mt-1">
                        Card, UPI, Net Banking & more
                      </p>
                    </div>
                  </div>

                  {paymentMethod === "RAZORPAY" && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check size={14} className="text-[#03100a]" />
                    </div>
                  )}
                </button>
              </div>
            </section>
          </div>

          {/* RIGHT SIDE */}
          <aside className="lg:sticky lg:top-8 h-fit">
            <div className="bg-[#0b1914] border border-emerald-900/50 rounded-2xl p-6 sm:p-7">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              {/* Products */}
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.cartItemId} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#07130f] shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />

                      <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-emerald-500 text-[#03100a] text-[10px] font-bold flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.name}
                      </p>

                      <p className="text-xs text-gray-600 mt-1">
                        {item.color} · {item.size}
                      </p>
                    </div>

                    <p className="text-sm text-gray-300">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="h-px bg-emerald-900/50 my-6" />

              {/* Pricing */}
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
              </div>

              <div className="h-px bg-emerald-900/50 my-6" />

              <div className="flex items-center justify-between">
                <span className="font-medium">Total</span>

                <span className="text-2xl font-semibold text-emerald-400">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Place Order */}
              <button
                type="button"
                className="w-full h-13 mt-7 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#03100a] font-semibold transition-all hover:shadow-lg hover:shadow-emerald-500/20"
              >
                Place Order
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-600 mt-5">
                <ShieldCheck size={14} />
                Secure & encrypted checkout
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default PlaceOrder;
