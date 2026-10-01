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

// Public clothing catalog
router.route("/").get(getProducts);

// Get admin products
router
  .route("/admin/product")
  .get(protectRoute, roleBasedAccess("admin"), getAdminProduct);

// Create product
router
  .route("/admin/product/create")
  .post(protectRoute, roleBasedAccess("admin"), createProduct);

// Public product and review reads
router.route("/:id/reviews").get(getProductReviews);

router.route("/:id").get(getProductById);

// Update/Delete product
router
  .route("/admin/product/:id")
  .put(protectRoute, roleBasedAccess("admin"), updateProduct)
  .delete(protectRoute, roleBasedAccess("admin"), deleteProduct);

// ==================== REVIEWS ====================
router.route("/:id/review").post(protectRoute, createProductReview);

router.route("/reviews/:id").delete(protectRoute, deleteProductReview);

export default router;
