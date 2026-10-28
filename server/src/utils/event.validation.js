
import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "A valid category ID is required.");

const venueSchema = z
  .object({
    name: z.string().trim().min(2).max(200),
    address: z.string().trim().min(2).max(300),
    city: z.string().trim().min(2).max(100),
    country: z.string().trim().min(2).max(100).default("Kenya"),
  })
  .strict();

const eventFields = {
  title: z.string().trim().min(3).max(150),
  description: z.string().trim().min(10).max(10000),
  category: objectIdSchema,
  venue: venueSchema,
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  coverImageUrl: z
    .string()
    .trim()
    .url()
    .max(2048)
    .nullable()
    .optional(),
  status: z.enum(["draft", "published"]).optional(),
};

export const createEventSchema = z
  .object(eventFields)
  .strict()
  .refine((data) => data.endsAt > data.startsAt, {
    message: "Event end time must be after start time.",
    path: ["endsAt"],
  });

export const updateEventSchema = z
  .object(eventFields)
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update.",
  })
  .refine(
    (data) =>
      !data.startsAt ||
      !data.endsAt ||
      data.endsAt > data.startsAt,
    {
      message: "Event end time must be after start time.",
      path: ["endsAt"],
    },
  );
