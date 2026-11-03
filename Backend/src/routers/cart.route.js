import express from "express";
import {
  addToCart,
  removeFromCart,
  getCart,
  updateCartQuantity,
  clearCart,
} from "../controllers/cart.controller.js";
import { protectRoute } from "../middlewares/validate.middleware.js";

const router = express.Router();

// All cart routes require authentication
router.use(protectRoute);

router.post("/add", addToCart);
router.delete("/clear", clearCart);
router.patch("/:productId", updateCartQuantity);
router.delete("/remove", removeFromCart);
router.get("/", getCart);

export default router;
