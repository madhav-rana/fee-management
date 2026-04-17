const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

/**
 * Uploads a buffer (PDF) to Cloudinary
 * @param {Buffer} buffer - The PDF file buffer
 * @param {string} receiptNumber - Unique ID for the file
 */
function uploadToCloudinary(buffer, receiptNumber) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw", // PDF ke liye raw ya auto use hota hai
        folder: "fee-receipts",
        public_id: receiptNumber,
        format: "pdf",
        overwrite: true,
        access_mode: "public",
        type: "upload",
        access_control: [{ access_type: "anonymous" }]
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary Upload Error:", error);
          return reject(error);
        }
        // Agar success ho toh secure_url return karega
        resolve(result.secure_url);
      }
    );

    // Buffer ko stream mein convert karke Cloudinary par pipe karna
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

module.exports = uploadToCloudinary;