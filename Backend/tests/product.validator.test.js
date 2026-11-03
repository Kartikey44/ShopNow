import assert from "node:assert/strict";
import test from "node:test";
import { validateProductFields } from "../src/validators/product.validator.js";

const validProduct = {
  productName: "Everyday Cotton Tee",
  description: "Soft cotton shirt.",
  brand: "ShopNow",
  category: "t-shirts",
  originalPrice: "799",
  discountPrice: "699",
  stockQuantity: "12",
  slug: "everyday-cotton-tee",
};

test("accepts a valid product with multipart numeric fields", () => {
  assert.equal(validateProductFields(validProduct), null);
});

test("rejects a missing required field and malformed slug", () => {
  const { productName, ...missingName } = validProduct;
  assert.match(validateProductFields(missingName), /required/);
  assert.match(
    validateProductFields({ ...validProduct, slug: "tee--sale" }),
    /Slug/,
  );
});

test("rejects negative prices, fractional stock, and discounts above list price", () => {
  assert.match(
    validateProductFields({ ...validProduct, originalPrice: "-1" }),
    /Original price/,
  );
  assert.match(
    validateProductFields({ ...validProduct, stockQuantity: "2.5" }),
    /Stock quantity/,
  );
  assert.match(
    validateProductFields({ ...validProduct, discountPrice: "900" }),
    /Discount price/,
  );
});

test("allows a partial stock-only update", () => {
  assert.equal(validateProductFields({ stockQuantity: "0" }, { partial: true }), null);
  assert.match(
    validateProductFields({ stockQuantity: "-1" }, { partial: true }),
    /Stock quantity/,
  );
});
