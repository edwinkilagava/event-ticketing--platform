
import mongoose from "mongoose";

import Category from "../models/category.model.js";
import Event from "../models/event.model.js";

function createEventError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function createSlug(title) {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}

async function createUniqueSlug(title, excludeId = null) {
  const baseSlug = createSlug(title);

  if (!baseSlug) {
    throw createEventError(
      "The event title cannot be used to create a URL slug.",
      400,
    );
  }

  let slug = baseSlug;
  let suffix = 2;

  while (
    await Event.exists({
      slug,
      ...(excludeId && {
        _id: { $ne: excludeId },
      }),
    })
  ) {
    slug = `${baseSlug.slice(0, 160 - String(suffix).length - 1)}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

function canManageEvent(event, user) {
  return (
    user.role === "admin" ||
    event.organizer.toString() === user.id
  );
}

async function findManageableEvent(eventId, user) {
  if (!mongoose.isValidObjectId(eventId)) {
    throw createEventError("Invalid event ID.", 400);
  }

  const event = await Event.findById(eventId);

  if (!event) {
    throw createEventError("Event not found.", 404);
  }

  if (!canManageEvent(event, user)) {
    throw createEventError(
      "You do not have permission to manage this event.",
      403,
    );
  }

  return event;
}

async function ensureActiveCategory(categoryId) {
  if (!mongoose.isValidObjectId(categoryId)) {
    throw createEventError("Invalid category ID.", 400);
  }

  const category = await Category.findOne({
    _id: categoryId,
    isActive: true,
  });

  if (!category) {
    throw createEventError(
      "The selected category does not exist or is inactive.",
      400,
    );
  }
}


export async function createEvent(data, user) {
  await ensureActiveCategory(data.category);

  const slug = await createUniqueSlug(data.title);
  const status = data.status ?? "draft";

  // Only administrators can publish during event creation.
  if (status === "published" && user.role !== "admin") {
    throw createEventError(
      "Only administrators can publish events.",
      403,
    );
  }

  return Event.create({
    ...data,
    slug,
    organizer: user.id,
    currency: "KES",
    status,
    publishedAt: status === "published" ? new Date() : null,
  });
}

export async function listEvents(user) {
  const filter =
    user.role === "admin"
      ? {}
      : { organizer: user.id };

  return Event.find(filter)
    .populate("category", "name slug")
    .populate("organizer", "name email")
    .sort({ createdAt: -1 })
    .lean();
}

export async function getEventById(eventId, user) {
  const event = await findManageableEvent(eventId, user);

  return event.populate([
    { path: "category", select: "name slug" },
    { path: "organizer", select: "name email" },
  ]);
}



export async function listPublishedEvents() {
  return Event.find({
    status: "published",
    endsAt: { $gte: new Date() },
  })
    .select(
      "title slug description category venue startsAt endsAt currency coverImageUrl publishedAt",
    )
    .populate("category", "name slug")
    .sort({ startsAt: 1 })
    .limit(8)
    .lean();
}



export async function updateEvent(eventId, data, user) {
  const event = await findManageableEvent(eventId, user);

  // Only administrators can change publication status.
  if (data.status !== undefined && user.role !== "admin") {
    throw createEventError(
      "Only administrators can change event publication status.",
      403,
    );
  }

  if (data.category !== undefined) {
    await ensureActiveCategory(data.category);
  }

  const nextStartsAt = data.startsAt ?? event.startsAt;
  const nextEndsAt = data.endsAt ?? event.endsAt;

  if (nextEndsAt <= nextStartsAt) {
    throw createEventError(
      "Event end time must be after start time.",
      400,
    );
  }

  if (data.title !== undefined && data.title !== event.title) {
    event.slug = await createUniqueSlug(data.title, event._id);
  }

  for (const [key, value] of Object.entries(data)) {
    if (key !== "status") {
      event.set(key, value);
    }
  }

  if (data.status !== undefined) {
    event.status = data.status;

    if (data.status === "published") {
      event.publishedAt = event.publishedAt ?? new Date();
    } else {
      event.publishedAt = null;
    }
  }

  await event.save();

  return event;
}

export async function deleteEvent(eventId, user) {
  const event = await findManageableEvent(eventId, user);

  await event.deleteOne();

  return { id: event._id.toString() };
}
