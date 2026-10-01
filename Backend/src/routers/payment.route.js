import express from "express";

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/payment.controller.js";

import { protectRoute } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.post("/razorpay/create-order", createRazorpayOrder);

router.post("/razorpay/verify", verifyRazorpayPayment);

export default router;
