import mongoose from "mongoose";
import Product from "../schemas/product.schema.js";
import Category from "../schemas/category.schema.js";
import ErrorHandler from "../utils/handleError.js";
import Review from "../schemas/review.schema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { deleteImages, uploadImages } from "../services/image.service.js";
import { validateProductFields } from "../validators/product.validator.js";

const allowedProductFields = [
  "productName",
  "description",
  "brand",
  "originalPrice",
  "discountPrice",
  "stockQuantity",
  "availability",
  "slug",
];

// Get All Products
// Get All Products
export const getProducts = catchAsyncErrors(async (req, res, next) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 12));
  const filter = {};
  const keyword = String(req.query.keyword || "").trim();
  if (keyword) {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.productName = { $regex: escaped, $options: "i" };
  }
  if (req.query.brand) filter.brand = String(req.query.brand);
  if (req.query.category) {
    if (!mongoose.isValidObjectId(req.query.category)) {
      return next(new ErrorHandler("Category filter is invalid", 400));
    }
    filter.category = req.query.category;
  }

  const minimumPrice = Number(req.query.minPrice);
  const maximumPrice = Number(req.query.maxPrice);
  if (req.query.minPrice !== undefined || req.query.maxPrice !== undefined) {
    if (
      (req.query.minPrice !== undefined &&
        (!Number.isFinite(minimumPrice) || minimumPrice < 0)) ||
      (req.query.maxPrice !== undefined &&
        (!Number.isFinite(maximumPrice) || maximumPrice < 0)) ||
      (req.query.minPrice !== undefined &&
        req.query.maxPrice !== undefined &&
        minimumPrice > maximumPrice)
    ) {
      return next(new ErrorHandler("Price range is invalid", 400));
    }
    const priceExpressions = [];
    if (req.query.minPrice !== undefined) {
      priceExpressions.push({
        $gte: [
          { $cond: [{ $gt: ["$discountPrice", 0] }, "$discountPrice", "$originalPrice"] },
          minimumPrice,
        ],
      });
    }
    if (req.query.maxPrice !== undefined) {
      priceExpressions.push({
        $lte: [
          { $cond: [{ $gt: ["$discountPrice", 0] }, "$discountPrice", "$originalPrice"] },
          maximumPrice,
        ],
      });
    }
    filter.$expr = { $and: priceExpressions };
  }

  const sortFields = new Set(["createdAt", "productName", "originalPrice", "averageRating"]);
  const sortField = String(req.query.sort || "-createdAt");
  const normalizedSort = sortField.startsWith("-") ? sortField.slice(1) : sortField;
  const sort = sortFields.has(normalizedSort) ? sortField : "-createdAt";
  const [totalCount, products] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter)
      .populate("category")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
  ]);
  const totalPages = Math.ceil(totalCount / limit);
  if (totalCount > 0 && page > totalPages) {
    return next(new ErrorHandler("Product page not found", 404));
  }
  res.status(200).json({
    success: true,
    products,
    resultPerPage: limit,
    totalCount,
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
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
  const validationError = validateProductFields(req.body);
  if (validationError) return next(new ErrorHandler(validationError, 400));

  const payload = Object.fromEntries(
    allowedProductFields
      .filter((field) => req.body[field] !== undefined)
      .map((field) => [field, req.body[field]]),
  );
  payload.user = req.user._id;
  payload.originalPrice = Number(payload.originalPrice);
  payload.discountPrice = Number(payload.discountPrice || 0);
  payload.stockQuantity = Number(payload.stockQuantity || 0);
  payload.availability =
    req.body.availability !== "false" && req.body.availability !== false;
  const categoryValue = String(req.body.category || "").trim();

  let category = await Category.findById(categoryValue).catch(() => null);
  if (!category) {
    const categoryName = categoryValue.toLowerCase();
    category = await Category.findOneAndUpdate(
      { categoryName },
      { $setOnInsert: { categoryName } },
      { returnDocument: "after", upsert: true, runValidators: true },
    );
  }

  const images = req.files?.length ? await uploadImages(req.files) : req.body.images;
  if (!Array.isArray(images) || images.length === 0 || images.some((image) => !image?.url || !image?.public_id)) {
    return next(new ErrorHandler("At least one valid product image is required", 400));
  }

  let product;
  try {
    product = await Product.create({ ...payload, category: category._id, images });
  } catch (error) {
    if (req.files?.length) await deleteImages(images).catch(() => {});
    throw error;
  }

  res.status(201).json({
    success: true,
    product,
  });
});
// Update Product
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  if (!Object.keys(req.body).length && !req.files?.length) {
    return next(new ErrorHandler("Provide product fields or replacement images", 400));
  }
  const validationError = validateProductFields(req.body, { partial: true });
  if (validationError) return next(new ErrorHandler(validationError, 400));
  const updates = Object.fromEntries(
    allowedProductFields
      .filter((field) => req.body[field] !== undefined)
      .map((field) => [field, req.body[field]]),
  );
  if (updates.originalPrice !== undefined) updates.originalPrice = Number(updates.originalPrice);
  if (updates.discountPrice !== undefined) updates.discountPrice = Number(updates.discountPrice);
  if (updates.stockQuantity !== undefined) updates.stockQuantity = Number(updates.stockQuantity);
  if (req.body.availability !== undefined) {
    updates.availability =
      req.body.availability !== "false" && req.body.availability !== false;
  }
  if (req.body.category) {
    const categoryValue = String(req.body.category).trim();
    let category = await Category.findById(categoryValue).catch(() => null);
    if (!category) {
      category = await Category.findOne({ categoryName: categoryValue.toLowerCase() });
    }
    if (!category) return next(new ErrorHandler("Category not found", 404));
    updates.category = category._id;
  }

  const newImages = req.files?.length ? await uploadImages(req.files) : null;
  const oldImages = product.images;
  if (newImages) updates.images = newImages;
  else if (req.body.images !== undefined) {
    if (!Array.isArray(req.body.images) || req.body.images.some((image) => !image?.url || !image?.public_id)) {
      return next(new ErrorHandler("Product images must include valid URLs and public IDs", 400));
    }
    updates.images = req.body.images;
  }

  try {
    Object.assign(product, updates);
    await product.save();
  } catch (error) {
    if (newImages) await deleteImages(newImages).catch(() => {});
    throw error;
  }

  if (newImages) await deleteImages(oldImages);

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

  await deleteImages(product.images);
  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

export const getAdminProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.find().populate("category").sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    product,
  });
});

export const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

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