import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../configs/db.config.js";
import Category from "../schemas/category.schema.js";
import Product from "../schemas/product.schema.js";
import User from "../schemas/user.schema.js";

const categoryNames = ["t-shirts", "shirts", "hoodies", "trousers", "accessories"];
const productTypes = [
  "Cotton Crew T-Shirt",
  "Relaxed Fit Shirt",
  "Everyday Hoodie",
  "Tapered Chino",
  "Canvas Tote",
  "Classic Polo",
  "Linen Blend Shirt",
  "Zip Front Sweatshirt",
  "Utility Overshirt",
];
const adjectives = ["Essential", "Modern", "Premium", "Classic", "Weekend"];
const brands = ["Northline", "Everyday Co.", "Common Ground", "Urban Loom", "Field & Form"];
const imageUrls = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900",
  "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=900",
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900",
  "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?w=900",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900",
];

const seed = async () => {
  await connectDB();
  const admin = await User.findOne({ role: "admin" }).select("_id");
  if (!admin) {
    throw new Error(
      "Create an admin account through the app before seeding the product catalog.",
    );
  }

  const categories = await Promise.all(
    categoryNames.map((categoryName) =>
      Category.findOneAndUpdate(
        { categoryName },
        { $setOnInsert: { categoryName } },
        { returnDocument: "after", upsert: true, runValidators: true },
      ),
    ),
  );

  const operations = Array.from({ length: 45 }, (_, index) => {
    const categoryIndex = index % categoryNames.length;
    const productName = `${adjectives[index % adjectives.length]} ${productTypes[index % productTypes.length]} ${String(index + 1).padStart(2, "0")}`;
    const originalPrice = 499 + ((index * 137) % 3200);
    const discountPrice = index % 3 === 0 ? Math.round(originalPrice * 0.85) : 0;
    const slug = productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const product = {
      productName,
      description: `${productName} from ShopNow. Designed for everyday comfort and made with carefully selected materials.`,
      brand: brands[index % brands.length],
      category: categories[categoryIndex]._id,
      user: admin._id,
      originalPrice,
      discountPrice,
      stockQuantity: 5 + ((index * 7) % 36),
      availability: true,
      images: [
        {
          public_id: `seed-assets/product-${String(index + 1).padStart(2, "0")}`,
          url: imageUrls[index % imageUrls.length],
        },
      ],
      slug,
    };

    return Product.updateOne(
      { slug },
      { $setOnInsert: product },
      { upsert: true, runValidators: true },
    );
  });
  await Promise.all(operations);
  console.log("Seeded 45 catalog products and 5 categories.");
};

try {
  await seed();
} catch (error) {
  console.error(`Seed failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
