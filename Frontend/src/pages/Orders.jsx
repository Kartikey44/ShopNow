import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Truck, CheckCircle2, Clock3 } from "lucide-react";
import axiosInstance from "../api/axios";

const statusIcon = {
  DELIVERED: CheckCircle2,
  SHIPPED: Truck,
  PACKED: Package,
  CONFIRMED: CheckCircle2,
  PENDING: Clock3,
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyOrder, setBusyOrder] = useState("");
  const [expandedOrder, setExpandedOrder] = useState("");

  const loadOrders = async () => {
    try {
      const { data } = await axiosInstance.get("/orders");
      setOrders(data.orders || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Order history could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const fetchOrders = async () => {
      try {
        const { data } = await axiosInstance.get("/orders");
        if (active) setOrders(data.orders || []);
      } catch (requestError) {
        if (active) {
          setError(requestError.response?.data?.message || "Order history could not be loaded.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchOrders();
    return () => {
      active = false;
    };
  }, []);

  const cancelOrder = async (orderId) => {
    setBusyOrder(orderId);
    setError("");
    try {
      await axiosInstance.put(`/orders/${orderId}/cancel`);
      await loadOrders();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Order could not be cancelled.");
    } finally {
      setBusyOrder("");
    }
  };

  return (
    <main className="min-h-screen bg-[#06110d] px-4 py-10 pb-24 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">Your account</p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">My orders</h1>
        <p className="mt-2 text-gray-400">Order history from your ShopNow account.</p>
        {error && <p className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200" role="alert">{error}</p>}
        {loading ? <p aria-live="polite" className="py-16 text-center text-gray-400">Loading orders…</p> : orders.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-emerald-900/50 bg-[#0b1914] py-16 text-center">
            <Package className="mx-auto text-emerald-500/60" size={40} />
            <h2 className="mt-4 text-xl font-medium">No orders yet</h2>
            <Link className="mt-5 inline-block rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-[#03100a]" to="/collection">Start shopping</Link>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {orders.map((order) => {
              const StatusIcon = statusIcon[order.orderStatus] || Clock3;
              const isOpen = expandedOrder === order._id;
              return (
                <article className="overflow-hidden rounded-2xl border border-emerald-900/50 bg-[#0b1914]" key={order._id}>
                  <div className="flex flex-col gap-4 border-b border-emerald-900/40 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="flex items-center gap-3">
                      <Package className="text-emerald-400" />
                      <div><p className="font-medium">Order {order._id}</p><p className="mt-1 text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p></div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
                      <span className="flex items-center gap-2 text-sm text-emerald-300"><StatusIcon size={17} />{order.orderStatus}</span>
                      <span className="font-semibold">₹{Number(order.grandTotal).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="space-y-4 p-5 sm:p-6">
                      {order.products.map((item) => (
                        <div className="flex items-center gap-4" key={item._id || item.product?._id}>
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#07130f]">{item.product?.images?.[0]?.url && <img alt="" className="h-full w-full object-cover" src={item.product.images[0].url} />}</div>
                          <div className="min-w-0 flex-1"><p className="truncate text-sm">{item.product?.productName || "Removed product"}</p><p className="mt-1 text-xs text-gray-500">Quantity {item.quantity}</p></div>
                          <p className="text-sm">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                        </div>
                      ))}
                      <div className="border-t border-emerald-900/50 pt-4 text-sm text-gray-400">
                        <p>{order.shippingAddress?.fullname} · {order.shippingAddress?.mobile}</p>
                        <p>{order.shippingAddress?.houseNo}, {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
                        <p className="mt-2">Payment: {order.paymentInfo?.paymentMethod} ({order.paymentInfo?.paymentStatus})</p>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap justify-end gap-3 p-4">
                    {["PENDING", "CONFIRMED"].includes(order.orderStatus) && <button className="rounded-lg border border-red-900 px-4 py-2 text-sm text-red-200 disabled:opacity-50" disabled={busyOrder === order._id} onClick={() => cancelOrder(order._id)} type="button">{busyOrder === order._id ? "Cancelling…" : "Cancel order"}</button>}
                    <button className="rounded-lg border border-emerald-800 px-4 py-2 text-sm text-emerald-300" onClick={() => setExpandedOrder(isOpen ? "" : order._id)} type="button">{isOpen ? "Hide details" : "Order details"}</button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default Orders;
