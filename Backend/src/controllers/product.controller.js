import Product from "../schemas/product.schema.js";
import Category from "../schemas/category.schema.js";
import ErrorHandler from "../utils/handleError.js";
import Review from "../schemas/review.schema.js";
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
    return next(new ErrorHandler("No products found", 404));
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

export const getAdminProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.find();
  res.status(200).json({
    success: true,
    product,
  });
});

export const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  console.log("Product ID:", id);
  console.log("User ID:", req.user._id);

  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Check if user has already reviewed this product
  const existingReview = await Review.findOne({
    user: req.user._id,
    product: id,
  });

  if (existingReview) {
    return next(
      new ErrorHandler("You have already reviewed this product", 400),
    );
  }

  // Create review
  const review = await Review.create({
    user: req.user._id,
    product: id,
    rating: Number(rating),
    comment,
  });

  // Get all reviews for this product
  const reviews = await Review.find({ product: id });

  // Calculate rating
  product.numberOfReviews = reviews.length;

  product.averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  await product.save();

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    review,
    averageRating: product.averageRating,
    numberOfReviews: product.numberOfReviews,
  });
});
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Check whether product exists
  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Get all reviews for this product
  const reviews = await Review.find({ product: id })
    .populate("user", "fullname profilePicture")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    reviews,
    numberOfReviews: reviews.length,
    averageRating: product.averageRating,
  });
});
export const deleteProductReview = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Find review
  const review = await Review.findById(id);

  if (!review) {
    return next(new ErrorHandler("Review not found", 404));
  }

  // Only review owner can delete
  if (review.user.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler("You are not authorized to delete this review", 403),
    );
  }

  // Store product ID before deleting
  const productId = review.product;

  // Delete review
  await Review.findByIdAndDelete(id);

  // Get remaining reviews
  const reviews = await Review.find({
    product: productId,
  });

  // Update product rating
  const product = await Product.findById(productId);

  if (product) {
    product.numberOfReviews = reviews.length;

    product.averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    await product.save();
  }

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});