import { Router } from "express";
import { getDashboardStats } from "../controllers/admin.controller.js";
import { protectRoute, roleBasedAccess } from "../middlewares/validate.middleware.js";

const router = Router();

router.get("/dashboard", protectRoute, roleBasedAccess("admin"), getDashboardStats);

export default router;
