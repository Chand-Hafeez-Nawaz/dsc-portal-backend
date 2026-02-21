const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const Notice = require("../models/Notice");

/* ================= CLOUDINARY STORAGE ================= */

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "dsc-notices",
    resource_type: "raw",
  }),
});

const upload = multer({ storage });

/* ================= CREATE NOTICE ================= */

router.post("/", upload.single("document"), async (req, res) => {
  try {
    const { title } = req.body;

    const newNotice = new Notice({
      title,
      document: req.file.path,
    });

    await newNotice.save();
    res.json(newNotice);
  } catch (error) {
    console.error("Create Notice Error:", error);
    res.status(500).json({ message: "Notice creation failed" });
  }
});

/* ================= GET ALL NOTICES ================= */

router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* ================= UPDATE NOTICE ================= */

router.put("/:id", upload.single("document"), async (req, res) => {
  try {
    const { title } = req.body;

    const updateData = { title };

    if (req.file) {
      updateData.document = req.file.path;
    }

    const updated = await Notice.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error("Update Notice Error:", error);
    res.status(500).json({ message: "Update failed" });
  }
});

/* ================= DELETE NOTICE ================= */

router.delete("/:id", async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;