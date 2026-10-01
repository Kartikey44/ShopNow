import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categories.controller.js";

import {
  protectRoute,
  roleBasedAccess,
  validate,
} from "../middlewares/validate.middleware.js";

import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/category.validator.js";

const router = Router();

// Public catalog routes
router.route("/").get(getAllCategories);

// Admin-only category management
router
  .route("/")
  .post(
    protectRoute,
    roleBasedAccess("admin"),
    validate(createCategorySchema),
    createCategory,
  );

router
  .route("/:id")
  .get(getCategoryById)
  .patch(
    protectRoute,
    roleBasedAccess("admin"),
    validate(updateCategorySchema),
    updateCategory,
  )
  .delete(protectRoute, roleBasedAccess("admin"), deleteCategory);

export default router;
