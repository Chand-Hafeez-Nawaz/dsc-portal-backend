require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const adminRoutes = require("./routes/adminRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const noticeRoutes = require("./routes/noticeRoutes");

const app = express();

/* ================= CORS ================= */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dsc-portal-frontend-kappa.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

/* ================= STATIC FOLDER ================= */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= MONGODB CONNECTION ================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Atlas Connected");

    const User = require("./models/User");
    const bcrypt = require("bcryptjs");

    const existing = await User.findOne({ email: "admin@dsc.in" });

    if (!existing) {
      const hashed = await bcrypt.hash("admin123", 10);
      await User.create({
        email: "admin@dsc.in",
        password: hashed,
        role: "admin",
      });
      console.log("Default Admin Created");
    } else {
      console.log("Admin Already Exists");
    }
  })
  .catch((err) => {
    console.error("MongoDB Error:", err);
    process.exit(1);
  });

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/notices", noticeRoutes);
/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});