import { apiRequest } from "./api.js";

/**
 * Fetch active event categories from the Eventix API.
 */
export async function getActiveCategories({ signal } = {}) {
  const response = await apiRequest("/categories", { signal });
  const categories = response?.data?.categories;

  if (!Array.isArray(categories)) {
    throw new Error(
      "The server returned an unexpected categories response.",
    );
  }

  return categories;
}