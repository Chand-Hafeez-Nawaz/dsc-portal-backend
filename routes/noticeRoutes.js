const express = require("express");
const router = express.Router();
const Notice = require("../models/Notice");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

/* Cloudinary config */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* Storage */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "dsc-notices",
    resource_type: "raw", // important for docs
    use_filename: true,
    unique_filename: true,
  }),
});

const upload = multer({ storage });

/* Create Notice */
router.post("/", upload.single("document"), async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !req.file) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newNotice = new Notice({
      title,
      document: req.file.path,
    });

    await newNotice.save();
    res.status(201).json(newNotice);
  } catch (error) {
    res.status(500).json({ message: "Notice creation failed" });
  }
});

/* Get Notices */
router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* Delete Notice */
router.delete("/:id", async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: "Notice Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;