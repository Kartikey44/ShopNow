import express from "express";

import {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
  cancelOrderByAdmin,
  markOrderAsPaid,
} from "../controllers/order.controller.js";

import {
  protectRoute,
  roleBasedAccess,
} from "../middlewares/validate.middleware.js";


const router = express.Router();

router.use(protectRoute);

// ==========================================
// ADMIN ROUTES — BEFORE /:id
// ==========================================

router.route("/admin/all").get(roleBasedAccess("admin"), getAllOrders);

router.route("/admin/:id").get(roleBasedAccess("admin"), getAdminOrderById);

router
  .route("/admin/:id/status")
  .put(roleBasedAccess("admin"), updateOrderStatus);

router
  .route("/admin/:id/cancel")
  .put(roleBasedAccess("admin"), cancelOrderByAdmin);

// ==========================================
// USER ROUTES
// ==========================================

router.route("/").post(createOrder).get(getOrders);

router.route("/:id").get(getOrderById);

router.route("/:id/cancel").put(cancelOrder);

router.route("/:id/pay").put(markOrderAsPaid);

export default router;
