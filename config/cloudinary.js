const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
<<<<<<< HEAD
  secure: true
=======
>>>>>>> f8cce1abd75fec5e5c9920a50307a71388eaeb0b
});

module.exports = cloudinary;