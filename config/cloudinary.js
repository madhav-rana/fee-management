const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
<<<<<<< HEAD
=======
  secure: true//added when generate and view is not working
>>>>>>> origin/Siddharth
});

module.exports = cloudinary;
