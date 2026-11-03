import Category from "../schemas/category.schema.js";
import Product from "../schemas/product.schema.js";
import ErrorHandler from "../utils/handleError.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

export const createCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.create(req.body);
  res.status(201).json({
    success: true,
    category,
  });
});

export const getAllCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json({
    success: true,
    totalCategories: categories.length,
    categories,
  });
});

export const getCategoryById = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  res.status(200).json({
    success: true,
    category,
  });
});

export const updateCategory = catchAsyncErrors(async (req, res, next) => {
  const existingCategory = await Category.findById(req.params.id);
  if (!existingCategory) {
    return next(new ErrorHandler("Category not found", 404));
  }

  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    category,
  });
});

export const deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  if (await Product.exists({ category: category._id })) {
    return next(
      new ErrorHandler("Category cannot be deleted while products use it", 409),
    );
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});
