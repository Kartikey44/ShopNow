import mongoose from "mongoose";
import Cart from "../schemas/cart.schema.js";
import Product from "../schemas/product.schema.js";
import ErrorHandler from "../utils/handleError.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

const refreshTotals = (cart) => {
  cart.subtotal = Number(
    cart.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2),
  );
  cart.discount = 0;
  cart.tax = Number((cart.subtotal * 0.18).toFixed(2));
  cart.finalTotal = Number((cart.subtotal + cart.tax - cart.discount).toFixed(2));
};

const populateCart = (cart) => cart.populate("items.product");

export const addToCart = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.body;
  const quantity = Number(req.body.quantity ?? 1);
  if (!mongoose.isValidObjectId(productId)) {
    return next(new ErrorHandler("A valid product ID is required", 400));
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return next(new ErrorHandler("Quantity must be a positive integer", 400));
  }

  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));
  if (!product.availability || product.stockQuantity < quantity) {
    return next(new ErrorHandler("Product is out of stock", 400));
  }

  const price =
    product.discountPrice > 0 ? product.discountPrice : product.originalPrice;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === String(productId),
  );
  if (existingItem) {
    if (existingItem.quantity + quantity > product.stockQuantity) {
      return next(
        new ErrorHandler("Requested quantity exceeds available stock", 400),
      );
    }
    existingItem.quantity += quantity;
    existingItem.price = price;
  } else {
    cart.items.push({ product: productId, quantity, price });
  }

  refreshTotals(cart);
  await cart.save();
  await populateCart(cart);
  res.status(200).json({ success: true, message: "Product added to cart", cart });
});

export const updateCartQuantity = catchAsyncErrors(async (req, res, next) => {
  const quantity = Number(req.body.quantity);
  if (!mongoose.isValidObjectId(req.params.productId)) {
    return next(new ErrorHandler("A valid product ID is required", 400));
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return next(new ErrorHandler("Quantity must be a positive integer", 400));
  }

  const cart = await Cart.findOne({ user: req.user._id });
  const item = cart?.items.find(
    (cartItem) => cartItem.product.toString() === req.params.productId,
  );
  if (!item) return next(new ErrorHandler("Cart item not found", 404));

  const product = await Product.findById(req.params.productId);
  if (!product || !product.availability || quantity > product.stockQuantity) {
    return next(
      new ErrorHandler("Requested quantity exceeds available stock", 400),
    );
  }

  item.quantity = quantity;
  item.price =
    product.discountPrice > 0 ? product.discountPrice : product.originalPrice;
  refreshTotals(cart);
  await cart.save();
  await populateCart(cart);
  res.status(200).json({ success: true, cart });
});

export const removeFromCart = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.body;
  if (!mongoose.isValidObjectId(productId)) {
    return next(new ErrorHandler("A valid product ID is required", 400));
  }
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new ErrorHandler("Cart not found", 404));

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== String(productId),
  );
  refreshTotals(cart);
  await cart.save();
  await populateCart(cart);
  res.status(200).json({ success: true, message: "Product removed from cart", cart });
});

export const clearCart = catchAsyncErrors(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    refreshTotals(cart);
    await cart.save();
  }
  res.status(200).json({ success: true, cart: cart || { items: [] } });
});

export const getCart = catchAsyncErrors(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
  );
  res.status(200).json({ success: true, cart: cart || { items: [] } });
});
