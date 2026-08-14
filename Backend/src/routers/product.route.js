import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { protectRoute,roleBasedAccess } from "../middlewares/validate.middleware.js";

const router = Router();
router.route("/")
  .get(protectRoute ,getProducts)
  .post(protectRoute,roleBasedAccess("admin"),createProduct);

router.route("/:id")
  .get(protectRoute,getProductById)
  .put(protectRoute,updateProduct)
  .delete(protectRoute,deleteProduct);

export default router;
