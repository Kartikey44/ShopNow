import Category from "../schemas/category.schema.js"
import ErrorHandler from "../utils/handleError.js"
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"

// create Category
export const createCategory = catchAsyncErrors(async (req, res, next) => {
    const category = await Category.create(req.body);
    console.log(category);
    res.status(201).json({
        success: true,
        category,
    });
});
//getAllCategory
export const getAllCategories = catchAsyncErrors(async (req, res, next) => {
    const categories = await Category.find();
    console.log(categories);

  res.status(200).json({
    success: true,
    totalCategories: categories.length,
    categories,
  });
});
// Get Category By Id
export const getCategoryById = catchAsyncErrors(async (req, res, next) => {
    const category = await Category.findByID(req.param.Id);
    console.log(categories);
     if (!category) {
       return next(new ErrorHandler("Category not found", 404));
     }

    res.status(200).json({
        success: true,
        category,
    });
});
// Update Category
export const updateCategory = catchAsyncErrors(async (req, res, next) => {
    let category = await Category.findById(req.param.id);
      if (!category) {
        return next(new ErrorHandler("Category not found", 404));
    }
    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    category,
  });
});
//Delete Category
export const deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});
