import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  emptyCart,
  removeCartProduct,
  selectCartError,
  selectCartItems,
  selectCartStatus,
  selectCartSubtotal,
  setCartQuantity,
} from "../features/cart/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const status = useSelector(selectCartStatus);
  const error = useSelector(selectCartError);

  return (
    <main className="min-h-screen bg-[#06110d] px-4 py-10 pb-24 text-white sm:px-6 lg:px-10">
      <div className="mx-auto mb-8 max-w-7xl">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">Your Bag</p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Shopping Cart</h1>
        <p className="mt-2 text-gray-400">Your cart is saved to your account.</p>
      </div>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_380px]">
        <section className="space-y-4">
          {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200" role="alert">{error}</p>}
          {status === "loading" && <p aria-live="polite" className="text-sm text-gray-400">Updating cart…</p>}
          {cartItems.length === 0 ? (
            <div className="rounded-2xl border border-emerald-900/50 bg-[#0b1914] p-8 text-center">
              <h2 className="text-xl font-semibold">Your bag is empty</h2>
              <p className="mt-2 text-sm text-gray-400">Browse the catalog to add products.</p>
              <Link className="mt-5 inline-flex rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-[#03100a]" to="/collection">Browse products</Link>
            </div>
          ) : cartItems.map((item) => {
            const product = item.product;
            const productId = product?._id || item.product;
            const image = product?.images?.[0]?.url;
            return (
              <article className="flex gap-4 rounded-2xl border border-emerald-900/50 bg-[#0b1914] p-4 sm:p-5" key={productId}>
                <div className="h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-[#07130f] sm:h-36 sm:w-32">
                  {image && <img alt={product?.productName || "Product"} className="h-full w-full object-cover" src={image} />}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate font-medium">{product?.productName || "Unavailable product"}</h2>
                      <p className="mt-1 text-xs text-gray-400">{product?.brand}</p>
                    </div>
                    <button aria-label={`Remove ${product?.productName || "product"}`} className="text-gray-400 hover:text-red-300" onClick={() => dispatch(removeCartProduct(productId))} type="button"><Trash2 size={18} /></button>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <div className="flex items-center rounded-lg border border-emerald-900">
                      <button aria-label="Decrease quantity" className="p-2 text-gray-300 disabled:opacity-40" disabled={item.quantity <= 1 || status === "loading"} onClick={() => dispatch(setCartQuantity({ productId, quantity: item.quantity - 1 }))} type="button"><Minus size={15} /></button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button aria-label="Increase quantity" className="p-2 text-gray-300 disabled:opacity-40" disabled={status === "loading" || item.quantity >= (product?.stockQuantity ?? item.quantity)} onClick={() => dispatch(setCartQuantity({ productId, quantity: item.quantity + 1 }))} type="button"><Plus size={15} /></button>
                    </div>
                    <p className="font-semibold text-emerald-400">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </article>
            );
          })}
          {cartItems.length > 0 && <button className="text-sm text-gray-400 underline hover:text-white disabled:opacity-50" disabled={status === "loading"} onClick={() => dispatch(emptyCart())} type="button">Clear cart</button>}
          <Link className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400" to="/collection"><ArrowLeft size={16} />Continue shopping</Link>
        </section>
        <aside className="h-fit rounded-2xl border border-emerald-900/50 bg-[#0b1914] p-6 lg:sticky lg:top-8">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between text-gray-400"><span>Tax &amp; shipping</span><span>Calculated at checkout</span></div>
          </div>
          <Link aria-disabled={cartItems.length === 0} className={`mt-6 flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-500 font-semibold text-[#03100a] ${cartItems.length === 0 ? "pointer-events-none opacity-50" : ""}`} to="/place-order">Checkout<ArrowRight size={18} /></Link>
          <p className="mt-4 text-center text-xs text-gray-500">Tax, shipping, and final totals are calculated by the server.</p>
        </aside>
      </div>
    </main>
  );
};

export default Cart;
