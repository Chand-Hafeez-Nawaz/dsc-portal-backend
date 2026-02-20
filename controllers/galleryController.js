const Gallery = require("../models/Gallery");

/* =========================
   Upload Multiple Images
========================= */
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const savedImages = [];

    for (let file of req.files) {
      const newImage = new Gallery({
        image: `/uploads/gallery/${file.filename}`, // clean public path
      });

      await newImage.save();
      savedImages.push(newImage);
    }

    res.status(201).json(savedImages);
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};

/* =========================
   Get All Images
========================= */
exports.getImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch images" });
  }
};

/* =========================
   Delete Image
========================= */
exports.deleteImage = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};