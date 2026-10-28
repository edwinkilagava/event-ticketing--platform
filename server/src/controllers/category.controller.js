
import { getActiveCategories } from "../services/category.service.js";

export async function listCategories(req, res) {
  const categories = await getActiveCategories();

  return res.status(200).json({
    success: true,
    data: {
      categories,
    },
  });
}
