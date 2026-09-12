import { Routes, Route } from "react-router-dom";

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

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/collection" element={<Collections />} />

          <Route path="/about" element={<About />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/product/:productId" element={<Products />} />

          <Route path="/contact" element={<Contacts />} />

          <Route path="/order" element={<Orders />} />

          <Route path="/place-order" element={<PlaceOrder />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;