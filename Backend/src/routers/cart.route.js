import express from "express";
import {
  addToCart,
  removeFromCart,
  getCart,
} from "../controllers/cart.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All cart routes require authentication
router.use(protectRoute);

router.post("/add", addToCart);
router.delete("/remove", removeFromCart);
router.get("/", getCart);

export default router;
