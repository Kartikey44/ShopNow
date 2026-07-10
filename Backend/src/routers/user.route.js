import { Router } from "express";
import {
  register,
    login,
  logout,
  profile,
} from "../controllers/user.controller.js";

import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validator.js";

import { protectRoute, validate } from "../middlewares/validate.middleware.js";


const router = Router()
router.post("/register", validate(registerSchema) ,register);
router.post("/login", validate(loginSchema) ,login);
router.post("/logout", logout);
router.get("/profile",protectRoute,profile)
export default router;