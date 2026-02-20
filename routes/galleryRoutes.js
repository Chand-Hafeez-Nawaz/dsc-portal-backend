const Gallery = require("../models/Gallery");
const cloudinary = require("../config/cloudinary");

/* ================= UPLOAD MULTIPLE IMAGES ================= */
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const savedImages = [];

    for (let file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "dsc-gallery",
        resource_type: "image",
      });

      const newImage = new Gallery({
        image: result.secure_url,
      });

      await newImage.save();
      savedImages.push(newImage);
    }

    res.status(201).json(savedImages);

  } catch (error) {
    console.error("GALLERY UPLOAD ERROR:", error);
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