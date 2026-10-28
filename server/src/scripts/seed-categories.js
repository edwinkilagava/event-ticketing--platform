
import mongoose from "mongoose";
import "dotenv/config";
import Category from "../models/category.model.js";

const categories = [
  {
    name: "Sports",
    slug: "sports",
    description:
      "Football, basketball, rugby, athletics, motorsports, and sporting tournaments.",
    displayOrder: 1,
    isActive: true,
  },
  {
    name: "Music",
    slug: "music",
    description:
      "Concerts, music festivals, live bands, DJ performances, and music events.",
    displayOrder: 2,
    isActive: true,
  },
  {
    name: "Lifestyle & Entertainment",
    slug: "lifestyle-entertainment",
    description:
      "Comedy shows, cultural festivals, exhibitions, conferences, and social events.",
    displayOrder: 3,
    isActive: true,
  },
];

async function seedCategories() {
  try {
    // Use the same MongoDB connection variable as your existing server.
    await mongoose.connect(process.env.MONGODB_URI);

    for (const category of categories) {
      await Category.findOneAndUpdate(
        { slug: category.slug },
        { $set: category },
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        },
      );

      console.log(`Category seeded: ${category.name}`);
    }

    console.log("Category seeding completed successfully.");
  } catch (error) {
    console.error("Category seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

await seedCategories();
