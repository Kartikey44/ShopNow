import React from "react";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock3,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

function Orders() {
  const orders = [
    {
      id: "ORD-2026-00124",
      date: "28 Sep 2026",
      status: "Delivered",
      total: 3298,
      items: [
        {
          name: "Premium Oversized T-Shirt",
          size: "L",
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300",
        },
        {
          name: "Classic Cotton Hoodie",
          size: "M",
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300",
        },
      ],
    },
    {
      id: "ORD-2026-00118",
      date: "21 Sep 2026",
      status: "Shipped",
      total: 1799,
      items: [
        {
          name: "Essential Casual Shirt",
          size: "M",
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?w=300",
        },
      ],
    },
  ];

  const statusIcon = {
    Delivered: <CheckCircle2 size={18} />,
    Shipped: <Truck size={18} />,
    Processing: <Clock3 size={18} />,
  };

  return (
    <div className="min-h-screen bg-[#06110d] text-white px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-emerald-400 text-xs uppercase tracking-[0.2em] mb-2">
            Your Account
          </p>

          <h1 className="text-3xl sm:text-4xl font-semibold">My Orders</h1>

          <p className="text-gray-500 mt-2">
            Track and manage your previous purchases.
          </p>
        </div>

        {/* Orders */}
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#0b1914] border border-emerald-900/50 rounded-2xl overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-5 sm:p-6 border-b border-emerald-900/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Package size={20} className="text-emerald-400" />
                  </div>

                  <div>
                    <p className="font-medium">{order.id}</p>

                    <p className="text-xs text-gray-500 mt-1">
                      Placed on {order.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <span
                    className={`flex items-center gap-2 text-sm ${
                      order.status === "Delivered"
                        ? "text-emerald-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {statusIcon[order.status]}
                    {order.status}
                  </span>

                  <span className="font-semibold">
                    ₹{order.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="p-5 sm:p-6 space-y-4">
                {order.items.map((item) => (
                  <div key={item.name} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#07130f] shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.name}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Size {item.size} · Qty {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 sm:px-6 py-4 border-t border-emerald-900/40 flex justify-end">
                <button className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition">
                  View Order
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="text-center py-24">
            <Package size={40} className="mx-auto text-emerald-500/50" />

            <h2 className="text-xl font-medium mt-5">No orders yet</h2>

            <p className="text-gray-500 mt-2">Your orders will appear here.</p>

            <Link
              to="/collection"
              className="inline-flex mt-6 px-6 py-3 rounded-lg bg-emerald-500 text-[#03100a] font-semibold hover:bg-emerald-400 transition"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
