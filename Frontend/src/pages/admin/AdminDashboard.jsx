import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Boxes, PackageCheck, ShieldCheck, ShoppingBag, Users, Layers, Plus, Pencil, Trash2 } from "lucide-react";
import axiosInstance from "../../api/axios";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";

const emptyProduct = {
  productName: "",
  description: "",
  brand: "",
  category: "",
  originalPrice: "",
  discountPrice: "0",
  stockQuantity: "0",
  slug: "",
};

const tabs = [
  ["overview", "Overview"],
  ["products", "Products"],
  ["orders", "Orders"],
  ["customers", "Customers"],
  ["categories", "Categories"],
];

const fetchAdminSection = async (section) => {
  if (section === "overview") {
    const { data } = await axiosInstance.get("/admin/dashboard");
    return { stats: data.stats };
  }
  if (section === "products") {
    const [productResponse, categoryResponse] = await Promise.all([
      axiosInstance.get("/products/admin/product"),
      axiosInstance.get("/categories"),
    ]);
    return {
      products: productResponse.data.product || [],
      categories: categoryResponse.data.categories || [],
    };
  }
  if (section === "orders") {
    const { data } = await axiosInstance.get("/orders/admin/all");
    return { orders: data.orders || [] };
  }
  if (section === "customers") {
    const { data } = await axiosInstance.get("/auth/admin/users");
    return { customers: data.users || [] };
  }
  const { data } = await axiosInstance.get("/categories");
  return { categories: data.categories || [] };
};

function AdminDashboard() {
  const user = useSelector(selectCurrentUser);
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [imageFiles, setImageFiles] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const applySectionData = (section, result) => {
    if (section === "overview") setStats(result.stats);
    if (section === "products") {
      setProducts(result.products);
      setCategories(result.categories);
    }
    if (section === "orders") setOrders(result.orders);
    if (section === "customers") setCustomers(result.customers);
    if (section === "categories") setCategories(result.categories);
  };

  const loadSection = async (section = tab) => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchAdminSection(section);
      applySectionData(section, result);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || `Unable to load ${section}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const result = await fetchAdminSection(tab);
        if (active) {
          applySectionData(tab, result);
          setError("");
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.response?.data?.message || `Unable to load ${tab}.`);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [tab]);

  const updateProductField = (event) => {
    const { name, value } = event.target;
    setProductForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "productName" && !editingProduct
        ? { slug: value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }
        : {}),
    }));
  };

  const editProduct = (product) => {
    setEditingProduct(product._id);
    setProductForm({
      productName: product.productName || "",
      description: product.description || "",
      brand: product.brand || "",
      category: product.category?._id || product.category || "",
      originalPrice: String(product.originalPrice ?? ""),
      discountPrice: String(product.discountPrice ?? 0),
      stockQuantity: String(product.stockQuantity ?? 0),
      slug: product.slug || "",
    });
    setImageFiles([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const formData = new FormData();
    Object.entries(productForm).forEach(([key, value]) => formData.append(key, value));
    imageFiles.forEach((image) => formData.append("images", image));
    try {
      if (editingProduct) {
        await axiosInstance.put(`/products/admin/product/${editingProduct}`, formData);
        toast.success("Product updated.");
      } else {
        await axiosInstance.post("/products/admin/product/create", formData);
        toast.success("Product created.");
      }
      setProductForm(emptyProduct);
      setImageFiles([]);
      setEditingProduct(null);
      await loadSection("products");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Product could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("Delete this product and its Cloudinary images?")) return;
    try {
      await axiosInstance.delete(`/products/admin/product/${productId}`);
      toast.success("Product deleted.");
      await loadSection("products");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Product could not be deleted.");
    }
  };

  const setOrderStatus = async (orderId, orderStatus) => {
    try {
      await axiosInstance.put(`/orders/admin/${orderId}/status`, { orderStatus });
      toast.success("Order status updated.");
      await loadSection("orders");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Order could not be updated.");
    }
  };

  const updateCustomer = async (customer, field, value) => {
    try {
      const path = field === "role" ? "role" : "status";
      await axiosInstance.put(`/auth/admin/user/${customer._id}/${path}`, { [field === "role" ? "role" : "accountStatus"]: value });
      toast.success("Customer account updated.");
      await loadSection("customers");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Customer could not be updated.");
    }
  };

  const saveCategory = async (event) => {
    event.preventDefault();
    try {
      await axiosInstance.post("/categories", { categoryName });
      setCategoryName("");
      toast.success("Category created.");
      await loadSection("categories");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Category could not be created.");
    }
  };

  const renameCategory = async (category) => {
    const name = window.prompt("Category name", category.categoryName);
    if (!name || name.trim().toLowerCase() === category.categoryName) return;
    try {
      await axiosInstance.patch(`/categories/${category._id}`, { categoryName: name });
      toast.success("Category updated.");
      await loadSection("categories");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Category could not be updated.");
    }
  };

  const deleteCategory = async (categoryId) => {
    if (!window.confirm("Delete this category? Products in it will retain the category reference.")) return;
    try {
      await axiosInstance.delete(`/categories/${categoryId}`);
      toast.success("Category deleted.");
      await loadSection("categories");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Category could not be deleted.");
    }
  };

  const statCards = stats ? [
    ["Products", stats.productCount, Boxes],
    ["Orders", stats.orderCount, PackageCheck],
    ["Customers", stats.customerCount, Users],
    ["Categories", stats.categoryCount, Layers],
    ["Paid sales", `₹${Number(stats.sales).toLocaleString("en-IN")}`, ShoppingBag],
  ] : [];

  return (
    <main className="min-h-screen bg-[#06110d] px-4 py-8 pb-24 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 flex flex-col gap-4 rounded-2xl border border-emerald-900/60 bg-[#0b1914] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-xs uppercase tracking-[0.2em] text-emerald-400">ShopNow administration</p><h1 className="mt-2 text-3xl font-semibold">Welcome, {user?.fullname || "Admin"}</h1></div>
          <div className="flex items-center gap-2 self-start rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300"><ShieldCheck size={18} />Administrator</div>
        </header>

        <nav aria-label="Admin sections" className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {tabs.map(([value, label]) => <button aria-pressed={tab === value} className={`shrink-0 rounded-lg px-4 py-2 text-sm ${tab === value ? "bg-emerald-500 font-semibold text-black" : "border border-emerald-900 text-gray-300"}`} key={value} onClick={() => { setLoading(true); setTab(value); }} type="button">{label}</button>)}
        </nav>
        {error && <p className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200" role="alert">{error}</p>}
        {loading && <p aria-live="polite" className="mb-5 text-sm text-gray-400">Loading {tab}…</p>}

        {tab === "overview" && (
          <section>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {statCards.map(([label, value, Icon]) => <article className="rounded-xl border border-emerald-900/50 bg-[#0b1914] p-5" key={label}><Icon className="text-emerald-400" size={20} /><p className="mt-4 text-sm text-gray-400">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></article>)}
            </div>
            <div className="mt-7 grid gap-6 lg:grid-cols-2">
              <section className="rounded-xl border border-emerald-900/50 bg-[#0b1914] p-5">
                <h2 className="text-lg font-semibold">Recent orders</h2>
                <div className="mt-4 space-y-3">
                  {(stats?.recentOrders || []).map((order) => <div className="flex flex-wrap justify-between gap-2 border-b border-emerald-900/40 pb-3 text-sm" key={order._id}><span>{order.user?.fullname || "Customer"} · {order._id.slice(-8)}</span><span className="text-emerald-300">{order.orderStatus}</span><span>₹{Number(order.grandTotal).toLocaleString("en-IN")}</span></div>)}
                  {stats?.recentOrders?.length === 0 && <p className="py-6 text-sm text-gray-400">No orders yet.</p>}
                </div>
              </section>
              <section className="rounded-xl border border-emerald-900/50 bg-[#0b1914] p-5">
                <h2 className="text-lg font-semibold">Sales by month</h2>
                <div className="mt-4 space-y-3">
                  {(stats?.monthlySales || []).map((month) => <div className="flex justify-between gap-3 text-sm" key={`${month._id.year}-${month._id.month}`}><span className="text-gray-400">{new Date(month._id.year, month._id.month - 1).toLocaleString(undefined, { month: "short", year: "numeric" })} · {month.orders} orders</span><span className="text-emerald-300">₹{Number(month.total).toLocaleString("en-IN")}</span></div>)}
                  {stats?.monthlySales?.length === 0 && <p className="py-6 text-sm text-gray-400">No sales recorded in this period.</p>}
                </div>
              </section>
            </div>
            <Link className="mt-6 inline-flex rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-[#03100a]" to="/">Open storefront</Link>
          </section>
        )}

        {tab === "products" && (
          <section>
            <form className="mb-8 grid gap-4 rounded-2xl border border-emerald-900/50 bg-[#0b1914] p-5 sm:grid-cols-2 lg:grid-cols-3" onSubmit={submitProduct}>
              <h2 className="text-xl font-semibold sm:col-span-2 lg:col-span-3">{editingProduct ? "Edit product" : "Create product"}</h2>
              <label className="text-sm text-gray-300">Product name<input className="checkout-input mt-2" maxLength="120" name="productName" onChange={updateProductField} required value={productForm.productName} /></label>
              <label className="text-sm text-gray-300">Brand<input className="checkout-input mt-2" maxLength="80" name="brand" onChange={updateProductField} required value={productForm.brand} /></label>
              <label className="text-sm text-gray-300">Category<select className="checkout-input mt-2" name="category" onChange={updateProductField} required value={productForm.category}><option value="">Select category</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.categoryName}</option>)}</select></label>
              <label className="text-sm text-gray-300">Original price<input className="checkout-input mt-2" min="0" name="originalPrice" onChange={updateProductField} required type="number" value={productForm.originalPrice} /></label>
              <label className="text-sm text-gray-300">Discount price<input className="checkout-input mt-2" min="0" name="discountPrice" onChange={updateProductField} type="number" value={productForm.discountPrice} /></label>
              <label className="text-sm text-gray-300">Stock quantity<input className="checkout-input mt-2" min="0" name="stockQuantity" onChange={updateProductField} required type="number" value={productForm.stockQuantity} /></label>
              <label className="text-sm text-gray-300">Slug<input className="checkout-input mt-2" name="slug" onChange={updateProductField} required value={productForm.slug} /></label>
              <label className="text-sm text-gray-300 sm:col-span-2 lg:col-span-2">Description<textarea className="checkout-input mt-2 min-h-24 py-3" maxLength="2000" name="description" onChange={updateProductField} required value={productForm.description} /></label>
              <label className="text-sm text-gray-300">Product images {editingProduct && "(select to replace current images)"}<input accept="image/jpeg,image/png,image/webp" className="mt-3 block w-full text-sm text-gray-300 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-500 file:px-3 file:py-2 file:font-semibold file:text-black" multiple name="images" onChange={(event) => setImageFiles(Array.from(event.target.files || []))} required={!editingProduct} type="file" /></label>
              <div className="flex flex-wrap gap-3 sm:col-span-2 lg:col-span-3">
                <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-black disabled:opacity-50" disabled={saving} type="submit"><Plus size={17} />{saving ? "Saving…" : editingProduct ? "Save changes" : "Create product"}</button>
                {editingProduct && <button className="rounded-lg border border-emerald-800 px-5 py-3" onClick={() => { setEditingProduct(null); setProductForm(emptyProduct); setImageFiles([]); }} type="button">Cancel edit</button>}
              </div>
            </form>
            <div className="overflow-x-auto rounded-xl border border-emerald-900/50">
              <table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-[#0b1914] text-gray-400"><tr><th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Actions</th></tr></thead><tbody>{products.map((product) => <tr className="border-t border-emerald-900/40" key={product._id}><td className="p-3">{product.productName}</td><td className="p-3">{product.category?.categoryName || "—"}</td><td className="p-3">₹{Number(product.discountPrice || product.originalPrice).toLocaleString("en-IN")}</td><td className="p-3">{product.stockQuantity}</td><td className="p-3"><div className="flex gap-3"><button aria-label={`Edit ${product.productName}`} className="text-emerald-300" onClick={() => editProduct(product)} type="button"><Pencil size={17} /></button><button aria-label={`Delete ${product.productName}`} className="text-red-300" onClick={() => deleteProduct(product._id)} type="button"><Trash2 size={17} /></button></div></td></tr>)}</tbody></table>
              {products.length === 0 && !loading && <p className="p-6 text-sm text-gray-400">No products in the catalog.</p>}
            </div>
          </section>
        )}

        {tab === "orders" && (
          <section className="overflow-x-auto rounded-xl border border-emerald-900/50">
            <table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-[#0b1914] text-gray-400"><tr><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Amount</th><th className="p-3">Payment</th><th className="p-3">Status</th></tr></thead><tbody>{orders.map((order) => <tr className="border-t border-emerald-900/40" key={order._id}><td className="p-3">{order._id.slice(-10)}</td><td className="p-3">{order.user?.fullname || "—"}</td><td className="p-3">₹{Number(order.grandTotal).toLocaleString("en-IN")}</td><td className="p-3">{order.paymentInfo?.paymentMethod} · {order.paymentInfo?.paymentStatus}</td><td className="p-3"><select aria-label={`Status for order ${order._id}`} className="rounded-lg border border-emerald-900 bg-[#07130f] p-2" onChange={(event) => setOrderStatus(order._id, event.target.value)} value={order.orderStatus}>{["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"].map((status) => <option key={status} value={status}>{status}</option>)}</select></td></tr>)}</tbody></table>
            {orders.length === 0 && !loading && <p className="p-6 text-sm text-gray-400">No orders yet.</p>}
          </section>
        )}

        {tab === "customers" && (
          <section className="overflow-x-auto rounded-xl border border-emerald-900/50">
            <table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-[#0b1914] text-gray-400"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Account</th><th className="p-3">Joined</th></tr></thead><tbody>{customers.map((customer) => <tr className="border-t border-emerald-900/40" key={customer._id}><td className="p-3">{customer.fullname}</td><td className="p-3">{customer.email}</td><td className="p-3"><select aria-label={`Role for ${customer.fullname}`} className="rounded-lg border border-emerald-900 bg-[#07130f] p-2" onChange={(event) => updateCustomer(customer, "role", event.target.value)} value={customer.role}>{["user", "admin", "seller", "delivery_partner"].map((role) => <option key={role} value={role}>{role}</option>)}</select></td><td className="p-3"><select aria-label={`Account status for ${customer.fullname}`} className="rounded-lg border border-emerald-900 bg-[#07130f] p-2" onChange={(event) => updateCustomer(customer, "accountStatus", event.target.value)} value={customer.accountStatus}>{["active", "blocked"].map((status) => <option key={status} value={status}>{status}</option>)}</select></td><td className="p-3">{new Date(customer.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table>
            {customers.length === 0 && !loading && <p className="p-6 text-sm text-gray-400">No customers found.</p>}
          </section>
        )}

        {tab === "categories" && (
          <section>
            <form className="mb-5 flex flex-col gap-3 rounded-xl border border-emerald-900/50 bg-[#0b1914] p-4 sm:flex-row" onSubmit={saveCategory}>
              <label className="flex-1 text-sm text-gray-300">New category<input className="checkout-input mt-2" maxLength="60" minLength="2" onChange={(event) => setCategoryName(event.target.value)} required value={categoryName} /></label>
              <button className="self-end rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-black" type="submit">Add category</button>
            </form>
            <div className="overflow-x-auto rounded-xl border border-emerald-900/50">
              <table className="w-full min-w-[500px] text-left text-sm"><thead className="bg-[#0b1914] text-gray-400"><tr><th className="p-3">Category</th><th className="p-3">Products</th><th className="p-3">Actions</th></tr></thead><tbody>{categories.map((category) => <tr className="border-t border-emerald-900/40" key={category._id}><td className="p-3">{category.categoryName}</td><td className="p-3">{products.filter((product) => (product.category?._id || product.category) === category._id).length || "—"}</td><td className="p-3"><div className="flex gap-4"><button className="text-emerald-300" onClick={() => renameCategory(category)} type="button">Rename</button><button className="text-red-300" onClick={() => deleteCategory(category._id)} type="button">Delete</button></div></td></tr>)}</tbody></table>
              {categories.length === 0 && !loading && <p className="p-6 text-sm text-gray-400">No categories found.</p>}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default AdminDashboard;
