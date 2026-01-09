//Handles file uploads using Cloudinary
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "scavenger-hunt/listings",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }]
  }
});

// Filter allowed files
function fileFilter(req, file, cb) {
  const allowed = ["image/jpeg", "image/jpg", "image/png"];

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only JPG and PNG images allowed"), false);
  }

  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;
