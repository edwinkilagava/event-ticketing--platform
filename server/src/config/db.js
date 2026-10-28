
import mongoose from "mongoose";

export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing from the environment.");
  }

  mongoose.set("bufferCommands", false);

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      appName: "Eventix",
    });

    console.log("MongoDB Atlas connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
