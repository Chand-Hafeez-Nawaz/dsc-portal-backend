const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET all schools
router.get("/schools", async (req, res) => {
  try {
    const schools = await User.find({ role: "school" });
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schools" });
  }
});

// APPROVE school
router.put("/approve/:id", async (req, res) => {
  try {
    const school = await User.findById(req.params.id);

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    school.approved = true;
    await school.save();

    res.json({ message: "School Approved Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Approval failed" });
  }
});

// REJECT school (delete)
router.delete("/reject/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "School Rejected & Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;