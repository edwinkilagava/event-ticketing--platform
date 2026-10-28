
import { getDashboardStats } from "../services/admin.service.js";

export async function getDashboardStatsController(req, res, next) {
  try {
    const stats = await getDashboardStats();

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics retrieved successfully.",
      data: stats,
    });
  } catch (error) {
    return next(error);
  }
}
