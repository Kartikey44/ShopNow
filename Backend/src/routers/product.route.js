import { Router } from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProduct,
  createProductReview,
  deleteProductReview,
  getProductReviews,
} from "../controllers/product.controller.js";

import {
  protectRoute,
  roleBasedAccess,
} from "../middlewares/validate.middleware.js";

const router = Router();

// ==================== PRODUCTS ====================

// Get all products
router.route("/").get(protectRoute, getProducts);

// Get admin products
router
  .route("/admin/product")
  .get(protectRoute, roleBasedAccess("admin"), getAdminProduct);

// Create product
router
  .route("/admin/product/create")
  .post(protectRoute, roleBasedAccess("admin"), createProduct);

// Get single product
router.route("/:id").get(protectRoute, getProductById);

// Update/Delete product
router
  .route("/admin/product/:id")
  .put(protectRoute, roleBasedAccess("admin"), updateProduct)
  .delete(protectRoute, roleBasedAccess("admin"), deleteProduct);

// ==================== REVIEWS ====================
router.route("/:id/review").post(protectRoute, createProductReview);

router.route("/:id/reviews").get(protectRoute, getProductReviews);

router.route("/reviews/:id").delete(protectRoute, deleteProductReview);

export default router;
