
import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  createEventSchema,
  updateEventSchema,
} from "../utils/event.validation.js";

import {
  createEventController,
  listEventsController,
  listPublishedEventsController,
  getEventController,
  updateEventController,
  deleteEventController,
} from "../controllers/event.controller.js";

const eventRouter = Router();


eventRouter.get("/discover", listPublishedEventsController);

// All event-management endpoints require authentication.
eventRouter.use(authenticate);

// Create an event.
eventRouter.post(
  "/",
  validate(createEventSchema),
  createEventController,
);

// List events the authenticated user is allowed to manage.
eventRouter.get("/", listEventsController);

// Get one event the authenticated user is allowed to manage.
eventRouter.get("/:id", getEventController);

// Update an event.
eventRouter.patch(
  "/:id",
  validate(updateEventSchema),
  updateEventController,
);

// Delete an event.
eventRouter.delete("/:id", deleteEventController);

export default eventRouter;
