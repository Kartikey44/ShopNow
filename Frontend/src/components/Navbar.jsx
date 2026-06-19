import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/frontend_assets/assets";
import { navbar } from "../assets/data";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartCount] = useState(2);

  return (
    <header className="text-center">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-wide text-slate-900">
          QuickMart
          <span className="text-4xl text-slate-900 rounded-full">.</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navbar.map((item) => (
            <NavLink
              key={item.id}
              to={item.link}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:underline "
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center justify-center gap-5 md:flex">
          <button className="transition hover:scale-105">
            <img src={assets.search_icon} className="w-5" alt="search" />
          </button>

          <div className="relative">
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              className="transition hover:scale-105"
            >
              <img
                src={assets.profile_icon}
                className="w-5 cursor-pointer"
                alt="profile"
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-10 z-50 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="flex flex-col py-2">
                  <Link
                    to="/profile"
                    className="px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                    onClick={() => setProfileOpen(false)}
                  >
                    My Profile
                  </Link>

                  <Link
                    to="/orders"
                    className="px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                    onClick={() => setProfileOpen(false)}
                  >
                    Orders
                  </Link>

                  <Link
                    to="/logout"
                    className="px-4 py-2 text-sm text-red-500 transition hover:bg-red-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    Logout
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link to="/cart" className="relative transition hover:scale-105">
            <img src={assets.cart_icon} className="w-5" alt="cart" />

            <div className="absolute -bottom-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[11px] text-white">
              {cartCount}
            </div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        {!menuOpen && (
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle Menu"
          >
            <img src={assets.menu_icon} className="w-5" alt="menu" />
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className=" absolute left-0 bottom-0 top-0 w-full bg-white md:hidden">
          <div className="flex justify-between items-center p-4">
            <div
              to="/"
              className="text-xl font-bold tracking-wide text-slate-900"
            >
              QuickMart
              <span className="text-4xl text-slate-900 rounded-full">.</span>
            </div>
            <button
              type="button"
              className=" items-center justify-center md:hidden"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle Menu"
            >
              <img src={assets.cross_icon} className="w-5" alt="menu" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-4 py-4">
            {navbar.map((item) => (
              <NavLink
                key={item.id}
                to={item.link}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600  hover:text-slate-900"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="mt-3 flex items-center gap-5 px-4">
              <img src={assets.search_icon} className="w-5" alt="search" />

              <Link to="/profile">
                <img src={assets.profile_icon} className="w-5" alt="profile" />
              </Link>

              <Link to="/cart" className="relative">
                <img src={assets.cart_icon} className="w-5" alt="cart" />

                <div className="absolute -bottom-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[11px] text-white">
                  {cartCount}
                </div>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;