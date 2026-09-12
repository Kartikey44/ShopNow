import express from "express";

import {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} from "../controllers/address.controller.js";

import { protectRoute } from "../middlewares/validate.middleware.js";

const router = express.Router();

// All address routes require authentication
router.use(protectRoute);

// Create address
router.route("/").post(createAddress).get(getAddresses);

// Get, update and delete specific address
router
  .route("/:id")
  .get(getAddressById)
  .put(updateAddress)
  .delete(deleteAddress);

export default router;
