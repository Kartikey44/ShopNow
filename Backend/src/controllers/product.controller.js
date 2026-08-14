import Product from "../schemas/product.schema.js";
import Category from "../schemas/category.schema.js";
import ErrorHandler from "../utils/handleError.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

// Get All Products
// Get All Products
export const getProducts = catchAsyncErrors(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(
    Product.find().populate("category"),
    req.query,
  )
    .search()
    .filter()
    .sort()
    .limitFields();

  // Count matching products before pagination
  const totalCount = await Product.countDocuments(
    apiFeatures.query.getFilter(),
  );

  // Apply pagination
  apiFeatures.pagination();

  // Get products
  const products = await apiFeatures.query;

  const { resultPerPage, currentPage, offset } = apiFeatures.paginationData;

  const totalPages = Math.ceil(totalCount / resultPerPage);
  const hasFilter =
  req.query.keyword ||
  req.query.brand ||
  req.query.category ||
  req.query.categoryName;

if (hasFilter && totalCount === 0) {
  return next(
    new ErrorHandler("No products found", 404)
  );
}
  if (currentPage > totalPages && totalCount > 0) {
    return next(new ErrorHandler("This page doesn't exist", 404));
  }
res.status(200).json({
  success: true,
  products,
  resultPerPage,
  totalCount,
  currentPage,
  productCount: products.length,
  });
});
// Get Product By ID
export const getProductById = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Create Product
export const createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  let categoryName = req.body.category?.trim().toLowerCase();

  if (!categoryName) {
    return next(new ErrorHandler("Category is required", 400));
  }

  // Check whether category already exists
  let category = await Category.findOne({
    categoryName: categoryName,
  });

  // Create category if it doesn't exist
  if (!category) {
    category = await Category.create({
      categoryName: categoryName,
    });
  }

  // Replace category name with category ObjectId
  req.body.category = category._id;

  // Create product
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});
// Update Product
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});