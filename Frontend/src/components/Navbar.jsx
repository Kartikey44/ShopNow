import { navbar } from "../assets/data/data.js";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, User, House,Package } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItemCount } from "../features/cart/cartSlice";
import {
  logoutUser,
  selectCurrentUser,
} from "../features/auth/authSlice";

function Navbar() {
  const dispatch = useDispatch();
  const cartItemCount = useSelector(selectCartItemCount);
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <>
      <div className="hidden md:block absolute bg-transparent top-10 left-0 w-full z-50 px-6">
        <div className="mx-auto flex items-center justify-around">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-white whitespace-nowrap"
          >
            ShopNow
          </Link>

          {/* Main Navbar */}
          <nav className="flex items-center gap-8 border border-slate-700 px-8 py-4 rounded-full bg-black/80 backdrop-blur-md text-white">
            {navbar.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className="relative overflow-hidden h-6 group whitespace-nowrap"
              >
                <span className="block group-hover:-translate-y-full transition-transform duration-300">
                  {item.label}
                </span>

                <span className="absolute top-full left-0 block group-hover:-translate-y-full transition-transform duration-300">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex items-center gap-2 px-4 h-12 rounded-full bg-black/80 border border-slate-700 backdrop-blur-md">
              <Search size={18} className="text-slate-400" />

              <input
                type="text"
                placeholder="Search"
                className="w-24 bg-transparent outline-none text-sm text-white placeholder:text-slate-400"
              />
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center justify-center h-12 w-12 text-white hover:text-slate-300 transition"
            >
              <ShoppingBag size={22} />

              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-white text-black text-[10px] font-bold">
                {cartItemCount}
              </span>
            </Link>

            {user ? (
              <button
                onClick={handleLogout}
                className="
     flex items-center gap-2
     h-12 px-5
     rounded-full
     bg-white
     text-black
     font-medium
     shadow-[0_0_25px_rgba(255,255,255,0.35)]
     hover:shadow-[0_0_35px_rgba(255,255,255,0.6)]
              "
            >
              <User size={18} />
              Logout
            </button>
            ) : (
              <Link
                to="/login"
                className="
     flex items-center gap-2
     h-12 px-5
     rounded-full
     bg-white
     text-black
     font-medium
     shadow-[0_0_25px_rgba(255,255,255,0.35)]
     hover:shadow-[0_0_35px_rgba(255,255,255,0.6)]
                "
              >
                <User size={18} />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE TOP BAR
      ====================================================== */}

      <div className="md:hidden absolute top-6 left-0 w-full z-50 px-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-white">
            ShopNow
          </Link>

          {/* Search */}
          <button className="flex items-center justify-center w-11 h-11 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white">
            <Search size={21} />
          </button>
        </div>
      </div>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ====================================================== */}

      <nav className="  md:hidden  fixed  bottom-0  left-0  z-50  w-full  h-18  px-5  pb-[env(safe-area-inset-bottom)] bg-black/90 backdrop-blur-xl border-t border-white/10">
        <div className="h-full flex items-center justify-around">
          {/* Home */}
          <Link to="/" className="flex flex-col items-center gap-1 text-white">
            <House size={21} />
            <span className="text-[10px]">Home</span>
          </Link>

          {/* Search */}
          <Link
            to="/order"
            className="flex flex-col items-center gap-1 text-white"
          >
            <Package size={21} />
            <span className="text-[10px]">Orders</span>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex flex-col items-center gap-1 text-white"
          >
            <ShoppingBag size={21} />

            <span className="absolute -top-1 ml-5 flex items-center justify-center w-4 h-4 rounded-full bg-white text-black text-[9px] font-bold">
                {cartItemCount}
            </span>

            <span className="text-[10px]">Cart</span>
          </Link>

          {/* Profile */}
          <Link
            to={user ? "/order" : "/login"}
            className="flex flex-col items-center gap-1 text-white"
          >
            <User size={21} />
            <span className="text-[10px]">Profile</span>
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
