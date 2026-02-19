const express = require("express");
const router = express.Router();

const {
  loginUser,
  registerUser,
  changePassword
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

router.post("/login", loginUser);
router.put("/change-password", protect, changePassword);

module.exports = router;   // ✅ VERY IMPORTANT