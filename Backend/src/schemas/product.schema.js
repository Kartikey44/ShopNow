import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Basic Details
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Pricing
    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Inventory
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    availability: {
      type: Boolean,
      default: true,
    },

    // Media
    images: [
      {
        type: String,
        required: true,
      },
    ],

    // Ratings
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numberOfReviews: {
      type: Number,
      default: 0,
    },

    // SEO
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;