import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, CreditCard, Banknote, ShieldCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../api/axios";
import { emptyCart, selectCartItems, selectCartSubtotal } from "../features/cart/cartSlice";

const initialAddress = {
  fullname: "",
  mobile: "",
  houseNo: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
};

function PlaceOrder() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const [address, setAddress] = useState(initialAddress);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateAddress = (event) => {
    setAddress((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data: addressData } = await axiosInstance.post("/addresses", {
        ...address,
        country: "India",
        addressType: "home",
        isDefault: true,
      });
      await axiosInstance.post("/orders", {
        shippingAddress: addressData.address._id,
        paymentMethod,
      });
      await dispatch(emptyCart()).unwrap();
      navigate("/order", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to place your order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#06110d] px-4 pb-24 text-white sm:px-6 lg:px-10">
      <header className="border-b border-emerald-900/40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
          <Link className="text-sm text-gray-400 hover:text-emerald-400" to="/cart">← Back to cart</Link>
          <span className="flex items-center gap-2 text-sm text-emerald-400"><ShieldCheck size={18} /> Secure checkout</span>
        </div>
      </header>
      <div className="mx-auto max-w-7xl py-10">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">Checkout</p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Complete your order</h1>
        {items.length === 0 ? (
          <div className="mt-8 rounded-xl border border-emerald-900/50 bg-[#0b1914] p-8 text-center">
            <p>Your cart is empty.</p><Link className="mt-4 inline-block text-emerald-400" to="/collection">Shop products</Link>
          </div>
        ) : (
          <form className="mt-8 grid gap-8 lg:grid-cols-[1fr_390px]" onSubmit={placeOrder}>
            <div className="space-y-6">
              <section className="rounded-2xl border border-emerald-900/50 bg-[#0b1914] p-6 sm:p-8">
                <h2 className="mb-6 flex items-center gap-3 text-xl font-semibold"><MapPin className="text-emerald-400" />Delivery address</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["fullname", "Full name", "text"],
                    ["mobile", "Mobile number", "tel"],
                    ["pincode", "Pincode", "text"],
                    ["houseNo", "House / flat", "text"],
                    ["street", "Street / area", "text"],
                    ["city", "City", "text"],
                    ["state", "State", "text"],
                  ].map(([name, label, type]) => (
                    <label className={`${name === "fullname" ? "sm:col-span-2" : ""} text-sm text-gray-300`} key={name}>
                      {label}
                      <input autoComplete={name === "fullname" ? "name" : name === "mobile" ? "tel" : "off"} className="checkout-input mt-2" name={name} onChange={updateAddress} required value={address[name]} type={type} />
                    </label>
                  ))}
                </div>
              </section>
              <section className="rounded-2xl border border-emerald-900/50 bg-[#0b1914] p-6 sm:p-8">
                <h2 className="mb-5 flex items-center gap-3 text-xl font-semibold"><CreditCard className="text-emerald-400" />Payment method</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { value: "COD", label: "Cash on delivery", detail: "Pay when your order arrives", icon: Banknote },
                    { value: "MOCK", label: "Demo online payment", detail: "Test-only payment; no charge is made", icon: CreditCard },
                  ].map(({ value, label, detail, icon: Icon }) => (
                    <label className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${paymentMethod === value ? "border-emerald-500 bg-emerald-500/5" : "border-emerald-900/50"}`} key={value}>
                      <input checked={paymentMethod === value} name="paymentMethod" onChange={() => setPaymentMethod(value)} type="radio" value={value} />
                      <span><span className="flex items-center gap-2 font-medium"><Icon size={18} className="text-emerald-400" />{label}</span><span className="mt-1 block text-xs text-gray-400">{detail}</span></span>
                    </label>
                  ))}
                </div>
              </section>
            </div>
            <aside className="h-fit rounded-2xl border border-emerald-900/50 bg-[#0b1914] p-6 lg:sticky lg:top-8">
              <h2 className="text-xl font-semibold">Order summary</h2>
              <div className="mt-5 space-y-3">
                {items.map((item) => (
                  <div className="flex justify-between gap-3 text-sm" key={item.product?._id}>
                    <span className="min-w-0 truncate text-gray-300">{item.product?.productName} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 flex justify-between border-t border-emerald-900/50 pt-4 text-sm text-gray-400"><span>Subtotal (server cart)</span><span>₹{subtotal.toLocaleString("en-IN")}</span></p>
              {error && <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200" role="alert">{error}</p>}
              <button className="mt-6 h-12 w-full rounded-lg bg-emerald-500 font-semibold text-[#03100a] disabled:opacity-50" disabled={submitting} type="submit">{submitting ? "Placing order…" : "Place order"}</button>
              <p className="mt-3 text-center text-xs text-gray-500">Tax, shipping, price, and inventory are calculated by the server.</p>
            </aside>
          </form>
        )}
      </div>
    </main>
  );
}

export default PlaceOrder;
