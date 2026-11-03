import cloudinary from "../configs/cloudinary.config.js";
import ErrorHandler from "../utils/handleError.js";

const hasCloudinaryCredentials = () =>
  [
    process.env.CLOUDINARY_CLOUD_NAME,
    process.env.CLOUDINARY_API_KEY,
    process.env.CLOUDINARY_API_SECRET,
  ].every((value) => typeof value === "string" && value.trim().length > 0);

export const uploadImages = async (files) => {
  if (files.length && !hasCloudinaryCredentials()) {
    throw new ErrorHandler("Cloudinary is not configured", 503);
  }

  return Promise.all(
    files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "shopnow/products", resource_type: "image" },
            (error, result) => {
              if (error) return reject(error);
              resolve({ public_id: result.public_id, url: result.secure_url });
            },
          );
          stream.end(file.buffer);
        }),
    ),
  );
};

export const deleteImages = async (images = []) => {
  const uploadedImages = images.filter(
    (image) =>
      image.public_id && !image.public_id.startsWith("seed-assets/"),
  );
  if (!uploadedImages.length) return [];
  if (!hasCloudinaryCredentials()) {
    throw new ErrorHandler("Cloudinary is not configured", 503);
  }

  return Promise.all(
    uploadedImages.map((image) => cloudinary.uploader.destroy(image.public_id)),
  );
};
