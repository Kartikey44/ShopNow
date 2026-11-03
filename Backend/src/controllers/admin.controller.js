import Order from "../schemas/order.schema.js";
import Product from "../schemas/product.schema.js";
import User from "../schemas/user.schema.js";
import Category from "../schemas/category.schema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

export const getDashboardStats = catchAsyncErrors(async (req, res) => {
  const [productCount, orderCount, customerCount, categoryCount, sales, recentOrders, monthlySales] =
    await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: "user" }),
      Category.countDocuments(),
      Order.aggregate([
        { $match: { "paymentInfo.paymentStatus": "PAID", orderStatus: { $ne: "CANCELLED" } } },
        { $group: { _id: null, total: { $sum: "$grandTotal" } } },
      ]),
      Order.find()
        .populate("user", "fullname email")
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      Order.aggregate([
        { $match: { createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1) }, "paymentInfo.paymentStatus": "PAID", orderStatus: { $ne: "CANCELLED" } } },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            total: { $sum: "$grandTotal" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

  res.status(200).json({
    success: true,
    stats: {
      productCount,
      orderCount,
      customerCount,
      categoryCount,
      sales: sales[0]?.total || 0,
      recentOrders,
      monthlySales,
    },
  });
});
