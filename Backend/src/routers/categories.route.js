import { Router } from 'express';
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    deleteCategory,
    updateCategory
} from "../controllers/catogories.controller.js"
const router = Router();

router.route("/")
    .get(getAllCategories)
    .post(createCategory);

router.route("/:id")
    .get(getCategoryById)
    .put(updateCategory)
    .delete(deleteCategory);


export default router;