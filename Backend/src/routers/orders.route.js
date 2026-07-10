import express from "express";
import { createOrder, getOrders } from "../controllers/order.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All order routes require authentication
router.use(protectRoute);

router.post("/", createOrder);
router.get("/", getOrders);

export default router;
