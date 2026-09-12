import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Collection",
      path: "/collection",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ];

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    console.log("Searching:", search);

    // Later connect this with your product search API
    // navigate(`/products?search=${search}`);
  };

  return (
    <header className="relative z-50 w-full bg-white">
      {/* ================= TOP NAVBAR ================= */}

      <nav className="flex h-20 items-center justify-between border-b border-slate-100">
        {/* ================= LOGO ================= */}

        <Link to="/" onClick={closeMenu} className="shrink-0">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{
              type: "spring",
              stiffness: 300,
            }}
            className="text-2xl font-extrabold tracking-tight sm:text-3xl"
          >
            Shop
            <span className="text-sky-500">Now</span>
          </motion.div>
        </Link>

        {/* ================= DESKTOP NAVIGATION ================= */}

        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `relative py-7 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-sky-500"
                    : "text-slate-600 hover:text-sky-500"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.name}

                  {isActive && (
                    <motion.span
                      layoutId="navbar-active"
                      className="absolute bottom-0 left-0 h-0.5 w-full bg-sky-500"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* ================= RIGHT SECTION ================= */}

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}

          <div className="hidden md:block">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 transition-all focus-within:border-sky-400 focus-within:bg-white">
                <Search size={17} className="text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-32 bg-transparent px-2 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 lg:w-44"
                />
              </div>
            </form>
          </div>

          {/* Mobile Search Button */}

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Search"
          >
            <Search size={20} />
          </motion.button>

          {/* Account */}

          <Link to="/login" className="hidden sm:block">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-sky-500"
            >
              <User size={20} />
            </motion.div>
          </Link>

          {/* Cart */}

          <Link to="/cart">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-sky-500"
            >
              <ShoppingCart size={21} />

              {/* Cart Count */}

              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-sky-500 px-1 text-[9px] font-bold text-white">
                0
              </span>
            </motion.div>
          </Link>

          {/* Mobile Menu */}

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>
      </nav>

      {/* ================= MOBILE SEARCH ================= */}

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="overflow-hidden border-b border-slate-100 md:hidden"
          >
            <form onSubmit={handleSearch} className="py-3">
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 focus-within:border-sky-400">
                <Search size={18} className="text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                  placeholder="Search products..."
                  className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
                />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MOBILE MENU ================= */}

      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 top-20 bg-black/20 backdrop-blur-sm lg:hidden"
            />

            {/* Menu */}

            <motion.div
              initial={{
                opacity: 0,
                y: -15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -15,
              }}
              transition={{
                duration: 0.2,
              }}
              className="absolute left-0 right-0 top-20 border-b border-slate-100 bg-white shadow-lg lg:hidden"
            >
              <div className="px-4 py-5">
                {/* Navigation */}

                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-lg px-4 py-3.5 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-sky-50 text-sky-500"
                            : "text-slate-600 hover:bg-slate-50"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span>{link.name}</span>

                          {isActive && (
                            <motion.span
                              initial={{
                                scale: 0,
                              }}
                              animate={{
                                scale: 1,
                              }}
                              className="h-2 w-2 rounded-full bg-sky-500"
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>

                {/* Divider */}

                <div className="my-4 h-px bg-slate-100" />

                {/* Account */}

                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <User size={19} />
                  <span>Login / Signup</span>
                </Link>

                {/* Cart */}

                <Link
                  to="/cart"
                  onClick={closeMenu}
                  className="flex items-center justify-between rounded-lg px-4 py-3.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart size={19} />
                    <span>Shopping Cart</span>
                  </div>

                  <span className="rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    0
                  </span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;