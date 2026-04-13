const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

function uploadToCloudinary(buffer, receiptNumber) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",       // PDF ke liye mandatory
        folder: "fee-receipts",
        public_id: receiptNumber,
        format: "pdf",
        overwrite: true,
        
        // 🚩 YE TEEN LINES SABSE IMPORTANT HAIN 🚩
        access_mode: "public",      // Public access allow karega
        type: "upload",             // Authenticated type ko overwrite karega
        access_control: [
            { access_type: "anonymous" } // Bina login ke viewing allow karega
        ]
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary Upload Error:", error);
          return reject(error);
        }
        // Secure URL return karega
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

module.exports = uploadToCloudinary;