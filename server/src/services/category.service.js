
import Category from "../models/category.model.js";

export async function getActiveCategories() {
  return Category.find({ isActive: true })
    .select("name slug description imageUrl displayOrder")
    .sort({ displayOrder: 1, name: 1 })
    .lean();
}
