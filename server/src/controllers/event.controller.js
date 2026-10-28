
import {
  createEvent,
  listEvents,
  listPublishedEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../services/event.service.js";

export async function createEventController(req, res, next) {
  try {
    const event = await createEvent(req.validatedBody, req.user);

    return res.status(201).json({
      success: true,
      message: "Event created successfully.",
      data: event,
    });
  } catch (error) {
    return next(error);
  }
}

export async function listEventsController(req, res, next) {
  try {
    const events = await listEvents(req.user);

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getEventController(req, res, next) {
  try {
    const event = await getEventById(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateEventController(req, res, next) {
  try {
    const event = await updateEvent(
      req.params.id,
      req.validatedBody,
      req.user,
    );

    return res.status(200).json({
      success: true,
      message: "Event updated successfully.",
      data: event,
    });
  } catch (error) {
    return next(error);
  }
}



export async function listPublishedEventsController(req, res, next) {
  try {
    const events = await listPublishedEvents();

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteEventController(req, res, next) {
  try {
    const result = await deleteEvent(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully.",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}
