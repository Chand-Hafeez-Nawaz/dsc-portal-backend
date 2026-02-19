const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect("mongodb+srv://hafeezthehacker_db_user:Hafeezthegamer07@dsa.wekec4k.mongodb.net/dscPortal?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

async function createAdmin() {
  const existingAdmin = await User.findOne({ email: "admin@dsc.in" });

  if (existingAdmin) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("Admin123", 10);

  await User.create({
    email: "admin@dsc.in",
    password: hashedPassword,
    role: "admin",
    isApproved: true,
  });

  console.log("Admin created successfully");
  process.exit();
}

createAdmin();