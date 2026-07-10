import Order from "../schemas/order.schema.js";
import Cart from "../schemas/cart.schema.js";

// Create Order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const totalAmount = cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );

    const order = await Order.create({
      user: userId,
      items: cart.items,
      totalAmount,
      status: "pending",
    });

    // Clear cart after placing the order
    cart.items = [];
    await cart.save();

    await order.populate("items.product");

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Logged-in User Orders
export const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
