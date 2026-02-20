const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= LOGIN =================
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Atlas Connected");

    const existing = await User.findOne({ email: "admin@dsc.in" });

    if (!existing) {
      const hashed = await bcrypt.hash("admin123", 10);

      await User.create({
        email: "admin@dsc.in",
        password: hashed,
        role: "admin"   // if your model has role field
      });

      console.log("Default Admin User Created");
    } else {
      console.log("Admin User Already Exists");
    }

  })
  .catch(err => {
    console.error("MongoDB Error:", err);
    process.exit(1);
  });

// ================= CHANGE PASSWORD =================
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    // IMPORTANT FIX HERE
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Password updated successfully ✅" });

  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
module.exports = {
  loginUser,
  changePassword,
};