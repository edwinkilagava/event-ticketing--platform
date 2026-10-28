
import "dotenv/config";

import bcrypt from "bcrypt";
import mongoose from "mongoose";

import User from "../models/user.model.js";

const BCRYPT_ROUNDS = 12;

function validateAdminCredentials({ name, email, password }) {
  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
    throw new Error("Admin name must contain between 2 and 100 characters.");
  }

  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    throw new Error("A valid admin email address is required.");
  }

  if (typeof password !== "string") {
    throw new Error("Admin password is required.");
  }

  const passwordLength = Buffer.byteLength(password, "utf8");

  if (passwordLength < 8 || passwordLength > 72) {
    throw new Error("Password must be between 8 and 72 UTF-8 bytes.");
  }
}

async function seedAdmin() {
  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  validateAdminCredentials({ name, email, password });

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from your environment.");
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    appName: "Eventix Admin Seeder",
  });

  console.log("Connected to MongoDB Atlas.");

  const existingUser = await User.findOne({ email })
    .select("_id email role isActive");

  if (existingUser) {
    if (existingUser.role !== "admin") {
      throw new Error(
        "This email already belongs to a non-admin account. No changes were made.",
      );
    }

    console.log(
      `An admin account already exists for ${email}. No changes were made.`,
    );
    return;
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  try {
    const admin = await User.create({
      name: name.trim(),
      email,
      passwordHash,
      role: "admin",
      isActive: true,
    });

    console.log("Admin account created successfully.");
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    console.log("Password: stored as a bcrypt hash.");
  } catch (error) {
    if (error.code === 11000) {
      throw new Error(
        "An account with this email already exists. No account was overwritten.",
      );
    }

    throw error;
  }
}

try {
  await seedAdmin();
} catch (error) {
  console.error("Admin seeding failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect().catch(() => {});
}
