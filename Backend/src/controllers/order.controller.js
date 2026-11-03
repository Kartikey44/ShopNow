import Order from "../schemas/order.schema.js";
import Cart from "../schemas/cart.schema.js";
import Address from "../schemas/address.schema.js";
import Product from "../schemas/product.schema.js";
import mongoose from "mongoose";

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/handleError.js";

const supportsTransactions = () =>
  ["ReplicaSetWithPrimary", "Sharded"].includes(
    mongoose.connection.client?.topology?.description?.type,
  );

const withOptionalTransaction = async (operation) => {
  const session = await mongoose.startSession();
  try {
    if (supportsTransactions()) {
      return await session.withTransaction(() => operation(session));
    }
    return await operation(undefined);
  } finally {
    await session.endSession();
  }
};

const cancelAndRestoreStock = async ({ id, userId }) =>
  withOptionalTransaction(async (session) => {
    const filter = { _id: id };
    if (userId) filter.user = userId;

    const orderQuery = Order.findOne(filter);
    if (session) orderQuery.session(session);
    const order = await orderQuery;
    if (!order) throw new ErrorHandler("Order not found", 404);
    if (order.orderStatus === "CANCELLED") {
      throw new ErrorHandler("Order is already cancelled", 400);
    }
    if (
      userId &&
      !["PENDING", "CONFIRMED"].includes(order.orderStatus)
    ) {
      throw new ErrorHandler("Order cannot be cancelled at this stage", 400);
    }
    if (
      !userId &&
      ["DELIVERED", "RETURNED"].includes(order.orderStatus)
    ) {
      throw new ErrorHandler(
        "Delivered or returned order cannot be cancelled",
        400,
      );
    }

    const previousStatus = order.orderStatus;
    const previousPaymentStatus = order.paymentInfo.paymentStatus;
    const updates = { orderStatus: "CANCELLED" };
    if (userId && previousPaymentStatus === "PAID") {
      updates["paymentInfo.paymentStatus"] = "REFUNDED";
    }

    const cancelledOrder = await Order.findOneAndUpdate(
      { ...filter, orderStatus: previousStatus },
      { $set: updates },
      { returnDocument: "after", session },
    );
    if (!cancelledOrder) {
      throw new ErrorHandler("Order status changed; refresh and try again", 409);
    }

    const restoredProducts = [];
    try {
      for (const item of order.products) {
        const product = await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stockQuantity: item.quantity } },
          { session },
        );
        if (product) restoredProducts.push(item);
      }
    } catch (error) {
      if (!session) {
        for (const item of restoredProducts) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stockQuantity: -item.quantity },
          });
        }
        await Order.findOneAndUpdate(
          { _id: order._id, orderStatus: "CANCELLED" },
          {
            $set: {
              orderStatus: previousStatus,
              "paymentInfo.paymentStatus": previousPaymentStatus,
            },
          },
        );
      }
      throw error;
    }

    return cancelledOrder;
  });

// =====================================================
// 1. CREATE ORDER
// =====================================================

export const createOrder = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const { shippingAddress, paymentMethod } = req.body;
  if (!shippingAddress) {
    return next(new ErrorHandler("Shipping address is required", 400));
  }
  if (!paymentMethod) {
    return next(new ErrorHandler("Payment method is required", 400));
  }

  const allowedPaymentMethods = ["COD", "RAZORPAY", "STRIPE", "MOCK"];

  if (!allowedPaymentMethods.includes(paymentMethod)) {
    return next(new ErrorHandler("Invalid payment method", 400));
  }

  if (!mongoose.isValidObjectId(shippingAddress)) {
    return next(new ErrorHandler("Shipping address is invalid", 400));
  }

  const session = await mongoose.startSession();
  let order;
  const transactionCapable = ["ReplicaSetWithPrimary", "Sharded"].includes(
    mongoose.connection.client?.topology?.description?.type,
  );
  const reservedProducts = [];
  const createOrderRecord = async (dbSession) => {
    const addressQuery = Address.findOne({ _id: shippingAddress, user: userId });
    if (dbSession) addressQuery.session(dbSession);
    const address = await addressQuery;
    if (!address) throw new ErrorHandler("Shipping address not found", 404);

    const cartQuery = Cart.findOne({ user: userId }).populate("items.product");
    if (dbSession) cartQuery.session(dbSession);
    const cart = await cartQuery;
    if (!cart || cart.items.length === 0) throw new ErrorHandler("Cart is empty", 400);

    const products = [];
    for (const item of cart.items) {
      const product = item.product;
      if (!product || !product.availability) {
        throw new ErrorHandler("A product in your cart is no longer available", 400);
      }

      const reservedProduct = await Product.findOneAndUpdate(
        {
          _id: product._id,
          availability: true,
          stockQuantity: { $gte: item.quantity },
        },
        { $inc: { stockQuantity: -item.quantity } },
        { returnDocument: "after", session: dbSession || undefined },
      );
      if (!reservedProduct) {
        throw new ErrorHandler(
          `Insufficient stock for ${product.productName}`,
          400,
        );
      }
      reservedProducts.push({ product: product._id, quantity: item.quantity });
      const price =
        product.discountPrice > 0 ? product.discountPrice : product.originalPrice;
      products.push({ product: product._id, quantity: item.quantity, price });
    }

    const subtotal = Number(
      products.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2),
    );
    const tax = Number((subtotal * 0.18).toFixed(2));
    const shippingFee = subtotal >= 500 ? 0 : 50;
    const discount = 0;
    const grandTotal = Number((subtotal + tax + shippingFee - discount).toFixed(2));
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
    const orderStatus = ["COD", "MOCK"].includes(paymentMethod)
      ? "CONFIRMED"
      : "PENDING";
    const paymentStatus = paymentMethod === "MOCK" ? "PAID" : "PENDING";
    const orderData = {
      user: userId,
      products,
      shippingAddress: shippingAddressSnapshot,
      paymentInfo: { paymentMethod, paymentStatus },
      orderStatus,
      subtotal,
      tax,
      shippingFee,
      discount,
      grandTotal,
      ...(paymentStatus === "PAID" ? { paidAt: new Date() } : {}),
    };
    const created = dbSession
      ? await Order.create([orderData], { session: dbSession })
      : [await Order.create(orderData)];
    order = created[0];

    cart.items = [];
    cart.subtotal = 0;
    cart.discount = 0;
    cart.tax = 0;
    cart.finalTotal = 0;
    await cart.save(dbSession ? { session: dbSession } : undefined);
    return created[0];
  };

  try {
    if (transactionCapable) {
      await session.withTransaction(async () => {
        order = await createOrderRecord(session);
      });
    } else {
      try {
        order = await createOrderRecord(undefined);
      } catch (error) {
        if (order?._id) await Order.findByIdAndDelete(order._id);
        for (const item of reservedProducts) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stockQuantity: item.quantity },
          });
        }
        throw error;
      }
    }
  } finally {
    await session.endSession();
  }
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
  const order = await cancelAndRestoreStock({
    id: req.params.id,
    userId: req.user._id,
  });

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
  if (orderStatus === "CANCELLED") {
    return cancelOrderByAdmin(req, res, next);
  }

  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.orderStatus === "CANCELLED") {
    return next(new ErrorHandler("Cancelled order cannot be updated", 400));
  }

  const updates = { orderStatus };
  if (orderStatus === "DELIVERED") updates.deliveredAt = new Date();
  const updatedOrder = await Order.findOneAndUpdate(
    { _id: id, orderStatus: order.orderStatus },
    { $set: updates },
    { returnDocument: "after", runValidators: true },
  );
  if (!updatedOrder) {
    return next(new ErrorHandler("Order status changed; refresh and try again", 409));
  }

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    order: updatedOrder,
  });
});

// =====================================================
// 8. ADMIN - CANCEL ORDER
// =====================================================

export const cancelOrderByAdmin = catchAsyncErrors(async (req, res, next) => {
  const order = await cancelAndRestoreStock({ id: req.params.id });

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully by admin",
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