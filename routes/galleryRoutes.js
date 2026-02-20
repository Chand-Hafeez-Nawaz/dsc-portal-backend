const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  uploadImages,
  getImages,
  deleteImage,
} = require("../controllers/galleryController");

/* ================= MULTER STORAGE ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/gallery/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ================= ROUTES ================= */

router.post("/upload", upload.array("images", 50), uploadImages);
router.get("/", getImages);
router.delete("/:id", deleteImage);

module.exports = router;