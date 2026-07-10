import Product from "../schemas/product.schema.js";
import ErrorHandler from "../utils/handleError.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

// Get All Products
export const getProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 10;

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .pagination(resultPerPage);

  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    resultPerPage,
    totalProducts: products.length,
    products,
  });
});

// Get Product By ID
export const getProductById = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

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