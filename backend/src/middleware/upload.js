//Handles file uploads (Cloudinary / multer).
const multer = require("multer");
const path = require("path");

// storage location + file naming
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // auto-creates folder if missing
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// filter allowed files
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
