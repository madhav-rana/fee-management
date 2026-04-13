const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

function uploadToCloudinary(buffer, receiptNumber) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw", 
        folder: "fee-receipts",
        public_id: receiptNumber,
        format: "pdf",  // ✅ explicit file type
        // Without it Cloudinary usually detects it automatically from the buffer, so it's not a bug — just more explicit and safer. 
        overwrite: true
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

module.exports = uploadToCloudinary;