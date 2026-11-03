import { useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import About from "./pages/About";
import Orders from "./pages/Orders";
import PlaceOrder from "./pages/PlaceOrder";
import Products from "./pages/Products";
import Contacts from "./pages/Contacts";
import Cart from "./pages/Cart";
import Collections from "./pages/Collections";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RoleRoute from "./components/RoleRoute";

import { loadCurrentUser, selectAuthStatus, selectCurrentUser } from "./features/auth/authSlice";
import { clearCartState, loadCart } from "./features/cart/cartSlice";

/* ================= PUBLIC LAYOUT ================= */

function PublicLayout() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

/* ================= STANDALONE LAYOUT ================= */

function StandaloneLayout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Outlet />
    </div>
  );
}

/* ================= APP ================= */

function App() {
  const dispatch = useDispatch();
  const authStatus = useSelector(selectAuthStatus);
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(loadCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user?.role === "user") dispatch(loadCart());
    else if (authStatus !== "checking" && !user) dispatch(clearCartState());
  }, [authStatus, dispatch, user]);

  /*
   * Wait for the initial authentication check.
   * This prevents protected routes from redirecting
   * before the current user has been loaded.
   */
  if (authStatus === "checking") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <>
    <ToastContainer autoClose={3000} position="top-right" theme="dark" />
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}

      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/collection" element={<Collections />} />

        <Route path="/about" element={<About />} />

        <Route path="/product/:productId" element={<Products />} />

        <Route path="/contact" element={<Contacts />} />
      </Route>

      {/* ================= AUTH ROUTES ================= */}

      <Route element={<StandaloneLayout />}>
        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* ================= USER PROTECTED ROUTES ================= */}

      <Route element={<RoleRoute allowedRoles={["user"]} />}>
        <Route element={<StandaloneLayout />}>
          <Route path="/cart" element={<Cart />} />

          <Route path="/order" element={<Orders />} />

          <Route path="/place-order" element={<PlaceOrder />} />
        </Route>
      </Route>

      {/* ================= ADMIN PROTECTED ROUTES ================= */}

      <Route element={<RoleRoute allowedRoles={["admin"]} />}>
        <Route element={<StandaloneLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>

      {/* ================= 404 ================= */}

      <Route element={<StandaloneLayout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
