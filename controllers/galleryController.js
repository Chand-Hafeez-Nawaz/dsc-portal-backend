const Gallery = require("../models/Gallery");

/* ================= UPLOAD IMAGE ================= */
exports.uploadImage = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newImage = new Gallery({
      image: req.file.path,
    });

    await newImage.save();

    res.status(200).json({
      message: "Image uploaded successfully",
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};

/* ================= GET ALL IMAGES ================= */
exports.getImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch images" });
  }
};

/* ================= DELETE IMAGE ================= */
exports.deleteImage = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed" });
  }
};