import Order from "../schemas/order.schema.js";
import Cart from "../schemas/cart.schema.js";
import Address from "../schemas/address.schema.js";
import Product from "../schemas/product.schema.js";

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/handleError.js";

// =====================================================
// 1. CREATE ORDER
// =====================================================

export const createOrder = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  const { shippingAddress, paymentMethod } = req.body;

  // -----------------------------------------
  // Validate shipping address
  // -----------------------------------------

  if (!shippingAddress) {
    return next(new ErrorHandler("Shipping address is required", 400));
  }

  // Find address belonging to current user
  const address = await Address.findOne({
    _id: shippingAddress,
    user: userId,
  });

  if (!address) {
    return next(new ErrorHandler("Shipping address not found", 404));
  }

  // -----------------------------------------
  // Validate payment method
  // -----------------------------------------

  if (!paymentMethod) {
    return next(new ErrorHandler("Payment method is required", 400));
  }

  const allowedPaymentMethods = ["COD", "RAZORPAY", "STRIPE"];

  if (!allowedPaymentMethods.includes(paymentMethod)) {
    return next(new ErrorHandler("Invalid payment method", 400));
  }

  // -----------------------------------------
  // Find user's cart
  // -----------------------------------------

  const cart = await Cart.findOne({
    user: userId,
  }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    return next(new ErrorHandler("Cart is empty", 400));
  }

  // -----------------------------------------
  // Validate products and stock
  // -----------------------------------------

  const products = [];

  for (const item of cart.items) {
    const product = item.product;

    if (!product) {
      return next(
        new ErrorHandler("A product in your cart no longer exists", 400),
      );
    }

    if (!product.availability) {
      return next(
        new ErrorHandler(
          `${product.productName} is currently unavailable`,
          400,
        ),
      );
    }

    if (product.stockQuantity < item.quantity) {
      return next(
        new ErrorHandler(
          `Only ${product.stockQuantity} units of ${product.productName} are available`,
          400,
        ),
      );
    }

    products.push({
      product: product._id,
      quantity: item.quantity,

      // Price stored in cart
      price: item.price,
    });
  }

  // -----------------------------------------
  // Calculate pricing
  // -----------------------------------------

  const subtotal = products.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const tax = Number((subtotal * 0.18).toFixed(2));

  const shippingFee = subtotal >= 500 ? 0 : 50;

  const discount = 0;

  const grandTotal = Number(
    (subtotal + tax + shippingFee - discount).toFixed(2),
  );

  // -----------------------------------------
  // Create shipping address snapshot
  // -----------------------------------------

  const shippingAddressSnapshot = {
    fullname: address.fullname,
    mobile: address.mobile,
    houseNo: address.houseNo,
    street: address.street,
    city: address.city,
    state: address.state,
    country: address.country,
    pincode: address.pincode,
    addressType: address.addressType,
  };

  // -----------------------------------------
  // Create order
  // -----------------------------------------

  const order = await Order.create({
    user: userId,

    products,

    shippingAddress: shippingAddressSnapshot,

    paymentInfo: {
      paymentMethod,
      paymentStatus: "PENDING",
    },

    orderStatus: paymentMethod === "COD" ? "CONFIRMED" : "PENDING",

    subtotal,
    tax,
    shippingFee,
    discount,
    grandTotal,
  });

  // -----------------------------------------
  // For COD:
  // Decrease stock immediately
  // -----------------------------------------

  if (paymentMethod === "COD") {
    for (const item of products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stockQuantity: -item.quantity,
        },
      });
    }
  }

  // -----------------------------------------
  // Clear cart
  // -----------------------------------------

  cart.items = [];
  cart.subtotal = 0;
  cart.discount = 0;
  cart.tax = 0;
  cart.finalTotal = 0;

  await cart.save();

  // -----------------------------------------
  // Populate products
  // -----------------------------------------

  await order.populate({
    path: "products.product",
    select: "productName images originalPrice discountPrice",
  });

  // -----------------------------------------
  // Response
  // -----------------------------------------

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order,
  });
});

// =====================================================
// 2. GET LOGGED-IN USER ORDERS
// =====================================================

export const getOrders = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  const orders = await Order.find({
    user: userId,
  })
    .populate({
      path: "products.product",
      select: "productName images originalPrice discountPrice",
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

// =====================================================
// 3. GET SINGLE USER ORDER
// =====================================================

export const getOrderById = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;

  const order = await Order.findOne({
    _id: id,
    user: userId,
  }).populate({
    path: "products.product",
    select: "productName images originalPrice discountPrice",
  });

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// =====================================================
// 4. CANCEL ORDER BY USER
// =====================================================

export const cancelOrder = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;

  const order = await Order.findOne({
    _id: id,
    user: userId,
  });

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  // Only allow cancellation before shipping
  if (!["PENDING", "CONFIRMED"].includes(order.orderStatus)) {
    return next(
      new ErrorHandler("Order cannot be cancelled at this stage", 400),
    );
  }

  // Restore stock
  for (const item of order.products) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        stockQuantity: item.quantity,
      },
    });
  }

  order.orderStatus = "CANCELLED";

  // If payment was already made,
  // refund should be handled separately.
  if (order.paymentInfo.paymentStatus === "PAID") {
    order.paymentInfo.paymentStatus = "REFUNDED";
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    order,
  });
});

// =====================================================
// 5. ADMIN - GET ALL ORDERS
// =====================================================

export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find()
    .populate({
      path: "user",
      select: "fullname email phoneNumber",
    })
    .populate({
      path: "products.product",
      select: "productName images originalPrice discountPrice",
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

// =====================================================
// 6. ADMIN - GET SINGLE ORDER
// =====================================================

export const getAdminOrderById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id)
    .populate({
      path: "user",
      select: "fullname email phoneNumber",
    })
    .populate({
      path: "products.product",
      select: "productName images originalPrice discountPrice",
    });

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// =====================================================
// 7. ADMIN - UPDATE ORDER STATUS
// =====================================================

export const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  const allowedStatuses = [
    "PENDING",
    "CONFIRMED",
    "PACKED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
  ];

  if (!allowedStatuses.includes(orderStatus)) {
    return next(new ErrorHandler("Invalid order status", 400));
  }

  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  // Don't update an already cancelled order
  if (order.orderStatus === "CANCELLED" && orderStatus !== "CANCELLED") {
    return next(new ErrorHandler("Cancelled order cannot be updated", 400));
  }

  // Handle cancellation by admin
  if (orderStatus === "CANCELLED" && order.orderStatus !== "CANCELLED") {
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stockQuantity: item.quantity,
        },
      });
    }
  }

  order.orderStatus = orderStatus;

  // Set delivery date
  if (orderStatus === "DELIVERED") {
    order.deliveredAt = new Date();
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    order,
  });
});

// =====================================================
// 8. ADMIN - CANCEL ORDER
// =====================================================

export const cancelOrderByAdmin = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.orderStatus === "CANCELLED") {
    return next(new ErrorHandler("Order is already cancelled", 400));
  }

  if (["DELIVERED", "RETURNED"].includes(order.orderStatus)) {
    return next(
      new ErrorHandler("Delivered or returned order cannot be cancelled", 400),
    );
  }

  // Restore stock
  for (const item of order.products) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        stockQuantity: item.quantity,
      },
    });
  }

  order.orderStatus = "CANCELLED";

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully by admin",
    order,
  });
});

// =====================================================
// 9. MARK ORDER AS PAID
// =====================================================
// Use this after Razorpay/Stripe payment verification.
// Do NOT call this directly from the frontend in production.

export const markOrderAsPaid = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { transactionId } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.paymentInfo.paymentStatus === "PAID") {
    return next(new ErrorHandler("Order is already paid", 400));
  }

  order.paymentInfo.paymentStatus = "PAID";

  order.paymentInfo.transactionId = transactionId || null;

  order.paidAt = new Date();

  order.orderStatus = "CONFIRMED";

  await order.save();

  res.status(200).json({
    success: true,
    message: "Payment recorded successfully",
    order,
  });
});
// =====================================================
// GET USER ORDER STATUS
// =====================================================

export const getOrderStatus = catchAsyncErrors(
  async (req, res, next) => {
    const userId = req.user._id;
    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,
      user: userId,
    }).select(
      "_id orderStatus paymentInfo.paymentStatus createdAt deliveredAt"
    );

    if (!order) {
      return next(
        new ErrorHandler("Order not found", 404)
      );
    }

    res.status(200).json({
      success: true,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentInfo.paymentStatus,
      createdAt: order.createdAt,
      deliveredAt: order.deliveredAt,
    });
  }
);