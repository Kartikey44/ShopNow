import assert from "node:assert/strict";
import test from "node:test";
import { deleteImages, uploadImages } from "../src/services/image.service.js";

const cloudinaryKeys = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

test("Cloudinary operations fail clearly without credentials", async () => {
  const previous = cloudinaryKeys.map((key) => process.env[key]);
  cloudinaryKeys.forEach((key) => {
    delete process.env[key];
  });

  try {
    await assert.rejects(
      uploadImages([{ buffer: Buffer.from("test") }]),
      (error) => error.statusCode === 503 && error.message === "Cloudinary is not configured",
    );
    assert.deepEqual(
      await deleteImages([{ public_id: "seed-assets/example" }]),
      [],
    );
    await assert.rejects(
      deleteImages([{ public_id: "shopnow/products/example" }]),
      (error) => error.statusCode === 503 && error.message === "Cloudinary is not configured",
    );
  } finally {
    cloudinaryKeys.forEach((key, index) => {
      if (previous[index] === undefined) delete process.env[key];
      else process.env[key] = previous[index];
    });
  }
});
