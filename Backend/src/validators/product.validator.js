export const validateProductFields = (body, { partial = false } = {}) => {
  const required = ["productName", "description", "brand", "category", "slug"];
  if (!partial && required.some((field) => !String(body[field] || "").trim())) {
    return "Product name, description, brand, category, and slug are required";
  }

  const maximumLengths = {
    productName: 120,
    description: 2000,
    brand: 80,
    slug: 160,
  };
  for (const [field, maximum] of Object.entries(maximumLengths)) {
    if (
      body[field] !== undefined &&
      (typeof body[field] !== "string" ||
        body[field].trim().length > maximum ||
        (required.includes(field) && !body[field].trim()))
    ) {
      return `${field} is invalid`;
    }
  }

  if (
    body.slug !== undefined &&
    !/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/.test(body.slug.trim())
  ) {
    return "Slug can contain letters, numbers, and single hyphens only";
  }
  if (
    body.originalPrice !== undefined &&
    (!Number.isFinite(Number(body.originalPrice)) ||
      Number(body.originalPrice) < 0)
  ) {
    return "Original price must be a non-negative number";
  }
  if (!partial && body.originalPrice === undefined) {
    return "Original price is required";
  }
  if (
    body.discountPrice !== undefined &&
    (!Number.isFinite(Number(body.discountPrice)) ||
      Number(body.discountPrice) < 0)
  ) {
    return "Discount price must be a non-negative number";
  }
  if (
    body.stockQuantity !== undefined &&
    (!Number.isInteger(Number(body.stockQuantity)) ||
      Number(body.stockQuantity) < 0)
  ) {
    return "Stock quantity must be a non-negative integer";
  }

  const originalPrice = Number(body.originalPrice);
  const discountPrice = Number(body.discountPrice || 0);
  if (
    body.discountPrice !== undefined &&
    body.originalPrice !== undefined &&
    discountPrice > originalPrice
  ) {
    return "Discount price cannot exceed original price";
  }
  return null;
};
