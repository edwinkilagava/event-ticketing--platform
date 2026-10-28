
import User from "../models/user.model.js";
import Event from "../models/event.model.js";
import Category from "../models/category.model.js";

export async function getDashboardStats() {
  const now = new Date();

  const [
    totalUsers,
    activeUsers,
    totalOrganizers,
    publishedEvents,
    upcomingEvents,
    totalCategories,
  ] = await Promise.all([
    User.countDocuments(),

    User.countDocuments({
      isActive: true,
    }),

    User.countDocuments({
      role: "organizer",
    }),

    Event.countDocuments({
      status: "published",
      endsAt: { $gte: now },
    }),

    Event.countDocuments({
      status: "published",
      startsAt: { $gt: now },
      endsAt: { $gte: now },
    }),

    Category.countDocuments({
      isActive: true,
    }),
  ]);

  return {
    totalUsers,
    activeUsers,
    totalOrganizers,
    publishedEvents,
    upcomingEvents,
    totalCategories,
    bookings: null,
    revenue: null,
  };
}
