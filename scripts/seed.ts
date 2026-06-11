import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI!;

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected");

    const userCollection = mongoose.connection.collection("users");

    const existingAdmin = await userCollection.findOne({
      email: "admin@test.com",
    });

    if (existingAdmin) {
      console.log("⚠️ Admin user already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Test@123", 12);

    await userCollection.insertOne({
      fullName: "Admin",
      email: "admin@test.com",
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("✅ Admin user created successfully");
    console.log("📧 Email: admin@test.com");
    console.log("🔑 Password: Admin@123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seedAdmin();