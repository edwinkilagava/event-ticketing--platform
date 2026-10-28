
import { apiRequest } from "./api.js";

export async function getDashboardStats() {
  const response = await apiRequest("/admin/dashboard/stats");
  return response.data;
}
