import { Link } from "react-router-dom";
import {
  Boxes,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";

const managementCards = [
  {
    title: "Products",
    description: "Create clothing listings, sizes, colours, prices, and stock.",
    icon: Boxes,
  },
  {
    title: "Orders",
    description: "Review incoming orders and update delivery status.",
    icon: PackageCheck,
  },
  {
    title: "Customers",
    description: "View customer accounts and manage account access.",
    icon: Users,
  },
];

function AdminDashboard() {
  const user = useSelector(selectCurrentUser);

  return (
    <div className="min-h-screen bg-[#06110d] px-4 py-10 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-5 rounded-2xl border border-emerald-900/60 bg-[#0b1914] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">
              ShopNow Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
              Welcome, {user?.fullname || "Admin"}
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Manage your clothing catalog and customer orders from one place.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            <ShieldCheck size={18} />
            Administrator
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {managementCards.map(({ title, description, icon: Icon }) => (
            <section
              key={title}
              className="rounded-2xl border border-emerald-900/50 bg-[#0b1914] p-6"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                <Icon className="text-emerald-400" size={21} />
              </div>
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-400">{description}</p>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-emerald-900/50 bg-[#0b1914] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Customer storefront</h2>
              <p className="mt-1 text-sm text-gray-400">
                View the public clothing store exactly as your customers see it.
              </p>
            </div>
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-[#03100a] transition hover:bg-emerald-400"
              to="/"
            >
              <ShoppingBag size={18} />
              Open storefront
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
