import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, House, Package, Store, ShieldCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItemCount } from "../features/cart/cartSlice";
import { logoutUser, selectCurrentUser } from "../features/auth/authSlice";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItemCount = useSelector(selectCartItemCount);
  const user = useSelector(selectCurrentUser);
  const [keyword, setKeyword] = useState("");

  const search = (event) => {
    event.preventDefault();
    navigate(`/collection${keyword.trim() ? `?keyword=${encodeURIComponent(keyword.trim())}` : ""}`);
  };

  const logout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/80 px-4 py-3 text-white backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link className="shrink-0 text-xl font-bold tracking-tight sm:text-2xl" to="/">ShopNow</Link>
          <nav className="hidden items-center gap-5 text-sm md:flex">
            <Link className="hover:text-emerald-400" to="/">Home</Link>
            <Link className="hover:text-emerald-400" to="/collection">Shop</Link>
            <Link className="hover:text-emerald-400" to="/about">About</Link>
            <Link className="hover:text-emerald-400" to="/contact">Contact</Link>
            {user?.role === "admin" && <Link className="flex items-center gap-1 hover:text-emerald-400" to="/admin"><ShieldCheck size={16} />Admin</Link>}
            {user?.role === "user" && <Link className="hover:text-emerald-400" to="/order">Orders</Link>}
          </nav>
          <form className="hidden max-w-xs flex-1 items-center gap-2 rounded-full border border-white/15 px-3 py-2 lg:flex" onSubmit={search}>
            <Search className="shrink-0 text-gray-400" size={17} />
            <input aria-label="Search products" className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500" onChange={(event) => setKeyword(event.target.value)} placeholder="Search products" value={keyword} />
          </form>
          <div className="flex shrink-0 items-center gap-3">
            <Link aria-label={`Cart, ${cartItemCount} items`} className="relative p-2" to={user?.role === "user" ? "/cart" : "/login"}>
              <ShoppingBag size={21} />
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-bold text-black">{cartItemCount}</span>
            </Link>
            {user ? <button className="rounded-full bg-white px-3 py-2 text-sm font-medium text-black sm:px-4" onClick={logout} type="button">Logout</button> : <Link className="rounded-full bg-white px-3 py-2 text-sm font-medium text-black sm:px-4" to="/login">Login</Link>}
          </div>
        </div>
      </header>
      <div className="fixed left-0 top-[57px] z-40 w-full bg-black/90 px-4 py-2 md:hidden">
        <form className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-2" onSubmit={search}>
          <Search className="text-gray-400" size={17} />
          <input aria-label="Search products" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500" onChange={(event) => setKeyword(event.target.value)} placeholder="Search products" value={keyword} />
        </form>
      </div>
      <nav aria-label="Mobile navigation" className="fixed bottom-0 left-0 z-50 w-full border-t border-white/10 bg-black/95 pb-[env(safe-area-inset-bottom)] text-white md:hidden">
        <div className="flex h-16 items-center justify-around">
          <Link className="flex flex-col items-center gap-1" to="/"><House size={20} /><span className="text-[10px]">Home</span></Link>
          <Link className="flex flex-col items-center gap-1" to="/collection"><Store size={20} /><span className="text-[10px]">Shop</span></Link>
          {user?.role === "user" && <Link className="flex flex-col items-center gap-1" to="/order"><Package size={20} /><span className="text-[10px]">Orders</span></Link>}
          {!user && <Link className="flex flex-col items-center gap-1" to="/login"><User size={20} /><span className="text-[10px]">Account</span></Link>}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
