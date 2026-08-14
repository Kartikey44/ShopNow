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
} from "../controllers/user.controller.js";
 
import {
  forgotPasswordSchema,
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  updatePasswordSchema
} from "../validators/auth.validator.js";

import { protectRoute, validate } from "../middlewares/validate.middleware.js";


const router = Router()
router.post("/register", validate(registerSchema) ,register);
router.post("/login", validate(loginSchema) ,login);
router.post("/logout", protectRoute,logout);
router.get("/profile", protectRoute, profile);
router.post("/password/forgot", validate(forgotPasswordSchema), forgotPassword);
router.put("/reset-password/:token", validate(resetPasswordSchema), resetPassword);
router.put("/password/update", protectRoute, validate(updatePasswordSchema), updatePassword);
router.put("/profile/update", protectRoute, updateProfile);
export default router;