import { apiRequest } from "./api.js";

/**
 * Retrieve events the authenticated user is permitted to manage.
 * Admins and organizers use the protected backend endpoint.
 */
export async function getManageableEvents({ signal } = {}) {
  const response = await apiRequest("/events", { signal });

  if (!Array.isArray(response?.data)) {
    throw new Error("The server returned an unexpected events response.");
  }

  return response.data;
}

/**
 * Retrieve published upcoming events for public-facing pages.
 * This endpoint does not require authentication.
 */
export async function getPublishedEvents({
  signal,
  categorySlug,
} = {}) {
  const params = new URLSearchParams();

  if (categorySlug) {
    params.set("category", categorySlug);
  }

  const query = params.toString();
  const endpoint = query
    ? `/events/discover?${query}`
    : "/events/discover";

  const response = await apiRequest(endpoint, { signal });

  if (!Array.isArray(response?.data)) {
    throw new Error("The server returned an unexpected events response.");
  }

  return response.data;
}
/**
 * Retrieve the latest upcoming events for the homepage.
 * The backend already sorts and limits the discovery results.
 */
export async function getRecentEvents({ signal } = {}) {
  const events = await getPublishedEvents({ signal });

  return events.slice(0, 5);
}

export async function createEvent(eventData) {
  if (
    !eventData ||
    typeof eventData !== "object" ||
    Array.isArray(eventData)
  ) {
    throw new TypeError("Event details are required.");
  }

  return apiRequest("/events", {
    method: "POST",
    body: JSON.stringify(eventData),
  });
}

export async function deleteEvent(eventId) {
  if (!eventId || typeof eventId !== "string") {
    throw new TypeError("A valid event ID is required.");
  }

  return apiRequest(`/events/${encodeURIComponent(eventId)}`, {
    method: "DELETE",
  });
}


export async function publishEvent(eventId) {
  if (!eventId || typeof eventId !== "string") {
    throw new TypeError("A valid event ID is required.");
  }

  return apiRequest(
    `/events/${encodeURIComponent(eventId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status: "published",
      }),
    },
  );
}
