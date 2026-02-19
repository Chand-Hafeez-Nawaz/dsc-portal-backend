const express = require("express");
const router = express.Router();
const Gallery = require("../models/Gallery");
const multer = require("multer");

// Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/gallery/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* =========================
   Upload Multiple Images
========================= */
router.post("/upload", upload.array("images", 50), async (req, res) => {
  try {
    const savedImages = [];

    for (let file of req.files) {
      const newImage = new Gallery({
        image: file.path,
      });

      await newImage.save();
      savedImages.push(newImage);
    }

    res.status(201).json(savedImages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
/* =========================
   Get All Images
========================= */
router.get("/", async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   Delete Image
========================= */
router.delete("/:id", async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;