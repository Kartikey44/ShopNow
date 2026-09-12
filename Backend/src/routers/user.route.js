import { Router } from "express";

import {
  register,
  login,
  logout,
  profile,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateProfile,
  getUserList,
  getSingleUser,
  updateUserRole,
  deleteUser,
} from "../controllers/user.controller.js";

import {
  forgotPasswordSchema,
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  updatePasswordSchema,
} from "../validators/auth.validator.js";

import {
  protectRoute,
  roleBasedAccess,
  validate,
} from "../middlewares/validate.middleware.js";

const router = Router();

// Authentication
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", protectRoute, logout);

// User
router.get("/profile", protectRoute, profile);
router.put("/profile/update", protectRoute, updateProfile);

// Password
router.post("/password/forgot", validate(forgotPasswordSchema), forgotPassword);

router.put(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  resetPassword,
);

router.put(
  "/password/update",
  protectRoute,
  validate(updatePasswordSchema),
  updatePassword,
);

// Admin
router.get("/admin/users", protectRoute, roleBasedAccess("admin"), getUserList);
router.get(
  "/admin/user/:id",
  protectRoute,
  roleBasedAccess("admin"),
  getSingleUser,
);

router.delete(
  "/admin/user/:id",
  protectRoute,
  roleBasedAccess("admin"),
  deleteUser,
);

router.put(
  "/admin/user/:id/role",
  protectRoute,
  roleBasedAccess("admin"),
  updateUserRole,
);
export default router;
