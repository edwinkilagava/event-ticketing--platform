import { useCallback, useEffect, useMemo, useState } from "react";

import { ApiError } from "../../services/api.js";

import {
  createEvent,
  deleteEvent,
  getManageableEvents,
  publishEvent,
} from "../../services/event.service.js";

import { getActiveCategories } from "../../services/category.service.js";

const initialForm = {
  title: "",
  description: "",
  category: "",
  venueName: "",
  venueAddress: "",
  city: "",
  country: "Kenya",
  startsAt: "",
  endsAt: "",
  coverImageUrl: "",
  status: "draft",
};

function getEventId(event) {
  return event?._id || event?.id;
}

function formatDate(value) {
  if (!value) return "Date not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getStatusStyles(status) {
  const styles = {
    published: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    draft: "bg-amber-50 text-amber-700 ring-amber-600/20",
    cancelled: "bg-rose-50 text-rose-700 ring-rose-600/20",
    completed: "bg-slate-100 text-slate-700 ring-slate-500/20",
  };

  return styles[status] || "bg-slate-100 text-slate-700 ring-slate-500/20";
}

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");

  const [deletingId, setDeletingId] = useState("");
  const [publishingId, setPublishingId] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState(initialForm);

  const loadEvents = useCallback(
    async ({ quiet = false, signal } = {}) => {
      if (quiet) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const result = await getManageableEvents({ signal });
        setEvents(result);
      } catch (err) {
        if (err?.name === "AbortError") return;

        setError(
          err instanceof ApiError
            ? err.message
            : err?.message || "Unable to load events. Please try again."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    const controller = new AbortController();

    loadEvents({ signal: controller.signal });

    return () => controller.abort();
  }, [loadEvents]);

  useEffect(() => {
    if (!isCreateOpen) return;

    const controller = new AbortController();

    async function loadCategories() {
      setCategoriesLoading(true);
      setFormError("");

      try {
        const result = await getActiveCategories({
          signal: controller.signal,
        });

        setCategories(result);
      } catch (err) {
        if (err?.name === "AbortError") return;

        setFormError(
          err?.message || "Unable to load categories. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setCategoriesLoading(false);
        }
      }
    }

    loadCategories();

    return () => controller.abort();
  }, [isCreateOpen]);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const category =
        typeof event.category === "object" ? event.category?.name : "";

      const organizer =
        typeof event.organizer === "object" ? event.organizer?.name : "";

      const values = [
        event.title,
        event.slug,
        category,
        organizer,
        event.venue?.name,
        event.venue?.city,
      ];

      const matchesSearch =
        !query ||
        values.some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      return (
        matchesSearch &&
        (statusFilter === "all" || event.status === statusFilter)
      );
    });
  }, [events, search, statusFilter]);

  function updateForm(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setFormError("");
  }

  function closeCreateForm() {
    if (isCreating) return;

    setIsCreateOpen(false);
    setFormData(initialForm);
    setFormError("");
  }

  async function handleCreateEvent(event) {
    event.preventDefault();

    if (isCreating) return;

    const startsAt = new Date(formData.startsAt);
    const endsAt = new Date(formData.endsAt);

    if (
      Number.isNaN(startsAt.getTime()) ||
      Number.isNaN(endsAt.getTime())
    ) {
      setFormError("Enter valid event start and end dates.");
      return;
    }

    if (endsAt <= startsAt) {
      setFormError("The event end date and time must be after the start.");
      return;
    }

    const coverImageUrl = formData.coverImageUrl.trim();

    if (coverImageUrl && !/^https?:\/\/\S+$/i.test(coverImageUrl)) {
      setFormError("Enter a valid HTTP or HTTPS cover image URL.");
      return;
    }

    if (!["draft", "published"].includes(formData.status)) {
      setFormError("Select a valid publishing status.");
      return;
    }

    setIsCreating(true);
    setFormError("");
    setActionError("");
    setNotice("");

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      venue: {
        name: formData.venueName.trim(),
        address: formData.venueAddress.trim(),
        city: formData.city.trim(),
        country: formData.country.trim() || "Kenya",
      },
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      coverImageUrl: coverImageUrl || null,
      status: formData.status,
    };

    try {
      await createEvent(payload);

      const createdStatus = formData.status;

      setIsCreateOpen(false);
      setFormData(initialForm);

      setNotice(
        createdStatus === "published"
          ? "Event created and published successfully."
          : "Event created successfully as a draft."
      );

      await loadEvents({ quiet: true });
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : err?.message || "Unable to create the event. Please try again."
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function handlePublish(event) {
    const eventId = getEventId(event);

    if (!eventId) {
      setActionError("This event has no valid ID and cannot be published.");
      return;
    }

    if (event.status !== "draft") {
      setActionError("Only draft events can be published from this action.");
      return;
    }

    if (publishingId || deletingId) return;

    setPublishingId(eventId);
    setActionError("");
    setNotice("");

    try {
      const response = await publishEvent(eventId);
      const publishedEvent = response?.data;

      if (publishedEvent?.status !== "published") {
        throw new Error(
          "The server did not confirm that the event was published."
        );
      }

      setEvents((current) =>
        current.map((item) =>
          getEventId(item) === eventId
            ? { ...item, ...publishedEvent }
            : item
        )
      );

      setNotice(`"${event.title}" has been published successfully.`);
    } catch (err) {
      setActionError(
        err instanceof ApiError
          ? err.message
          : err?.message || "Unable to publish this event."
      );
    } finally {
      setPublishingId("");
    }
  }

  async function handleDelete(event) {
    const eventId = getEventId(event);

    if (!eventId) {
      setActionError("This event has no valid ID and cannot be deleted.");
      return;
    }

    if (publishingId || deletingId) return;

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${event.title}"?`
    );

    if (!confirmed) return;

    setDeletingId(eventId);
    setActionError("");
    setNotice("");

    try {
      await deleteEvent(eventId);

      setEvents((current) =>
        current.filter((item) => getEventId(item) !== eventId)
      );

      setNotice("Event deleted successfully.");
    } catch (err) {
      setActionError(
        err instanceof ApiError
          ? err.message
          : err?.message || "Unable to delete this event."
      );
    } finally {
      setDeletingId("");
    }
  }

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Event management
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Events
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Create events, manage listings, and publish events to the Eventix
            directory.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => loadEvents({ quiet: true })}
            disabled={loading || refreshing || Boolean(publishingId)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
          >
            <span aria-hidden="true">↻</span>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <button
            type="button"
            onClick={() => {
              setNotice("");
              setActionError("");
              setFormError("");
              setIsCreateOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              +
            </span>
            Create event
          </button>
        </div>
      </header>

      {notice && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {notice}
        </div>
      )}

      {actionError && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          {actionError}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total loaded</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {loading ? "—" : events.length.toLocaleString("en-KE")}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Events returned by the API
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Published</p>
          <p className="mt-3 text-3xl font-bold text-emerald-700">
            {loading
              ? "—"
              : events
                  .filter((item) => item.status === "published")
                  .length.toLocaleString("en-KE")}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Currently published events
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Drafts</p>
          <p className="mt-3 text-3xl font-bold text-amber-700">
            {loading
              ? "—"
              : events
                  .filter((item) => item.status === "draft")
                  .length.toLocaleString("en-KE")}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Events not yet published
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Event directory
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {loading
                ? "Loading events..."
                : `${filteredEvents.length} of ${events.length} events`}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_160px]">
            <label className="sr-only" htmlFor="event-search">
              Search events
            </label>

            <input
              id="event-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search events or venues..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <label className="sr-only" htmlFor="event-status-filter">
              Filter by status
            </label>

            <select
              id="event-status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div
            className="space-y-3 p-6"
            aria-busy="true"
            aria-label="Loading events"
          >
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-14 animate-pulse rounded-lg bg-slate-100"
              />
            ))}
          </div>
        ) : error ? (
          <div className="px-6 py-14 text-center">
            <h3 className="font-semibold text-slate-900">
              Could not load events
            </h3>

            <p role="alert" className="mt-2 text-sm text-rose-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => loadEvents()}
              className="mt-5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Try again
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h3 className="font-semibold text-slate-900">
              {events.length ? "No matching events" : "No events found"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {events.length
                ? "Try changing your search or status filter."
                : "Create your first event to get started."}
            </p>

            {events.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
                className="mt-4 text-sm font-semibold text-blue-700 hover:text-blue-800"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Event
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Venue
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Start date
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-right font-semibold"
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredEvents.map((event) => {
                  const id = getEventId(event);

                  const category =
                    typeof event.category === "object"
                      ? event.category?.name
                      : "";

                  const isPublishing = publishingId === id;
                  const isDeleting = deletingId === id;
                  const actionInProgress = Boolean(publishingId || deletingId);

                  return (
                    <tr
                      key={id || event.slug || event.title}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {event.coverImageUrl ? (
                            <img
                              src={event.coverImageUrl}
                              alt=""
                              loading="lazy"
                              className="h-11 w-11 rounded-lg object-cover ring-1 ring-slate-200"
                            />
                          ) : (
                            <div
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 font-bold text-blue-700"
                              aria-hidden="true"
                            >
                              {(event.title || "E")
                                .trim()
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="max-w-xs truncate font-semibold text-slate-900">
                              {event.title || "Untitled event"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {category || "Uncategorized"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-700">
                          {event.venue?.name || "Venue not set"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {[
                            event.venue?.city,
                            event.venue?.country,
                          ]
                            .filter(Boolean)
                            .join(", ") || "Location not set"}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                        {formatDate(event.startsAt)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${getStatusStyles(event.status)}`}
                        >
                          {event.status || "Unknown"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {event.status === "draft" && (
                            <button
                              type="button"
                              onClick={() => handlePublish(event)}
                              disabled={!id || actionInProgress}
                              aria-label={`Publish ${event.title || "event"}`}
                              className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isPublishing ? "Publishing..." : "Publish"}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(event)}
                            disabled={!id || actionInProgress}
                            aria-label={`Delete ${event.title || "event"}`}
                            className="rounded-lg px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <footer className="border-t border-slate-100 px-6 py-4">
          <p className="text-xs leading-5 text-slate-500">
            Draft events are not publicly discoverable. Publish an event to
            make it available through the public Eventix events directory.
          </p>
        </footer>
      </div>

      {/* Create event modal */}
      {isCreateOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-950/50 px-4 py-6 backdrop-blur-sm sm:items-center sm:py-10"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeCreateForm();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-event-title"
            className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 sm:px-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                  Event setup
                </p>

                <h2
                  id="create-event-title"
                  className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
                >
                  Create an event
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Add the event details and choose whether to publish it now or
                  save it as a draft.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateForm}
                disabled={isCreating}
                aria-label="Close create event form"
                className="rounded-xl p-2 text-xl text-slate-500 hover:bg-slate-100 disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateEvent}>
              <div className="grid gap-5 px-6 py-6 sm:grid-cols-2 sm:px-8">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="event-title"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Event title *
                  </label>
                  <input
                    id="event-title"
                    name="title"
                    value={formData.title}
                    onChange={updateForm}
                    required
                    minLength={3}
                    maxLength={150}
                    placeholder="e.g. Nairobi Summer Music Festival"
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="event-description"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Description *
                  </label>
                  <textarea
                    id="event-description"
                    name="description"
                    value={formData.description}
                    onChange={updateForm}
                    required
                    minLength={10}
                    maxLength={10000}
                    rows={4}
                    placeholder="Describe the event and what attendees can expect..."
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="event-category"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Category *
                  </label>

                  <select
                    id="event-category"
                    name="category"
                    value={formData.category}
                    onChange={updateForm}
                    required
                    disabled={categoriesLoading || categories.length === 0}
                    className={inputClass}
                  >
                    <option value="">
                      {categoriesLoading
                        ? "Loading categories..."
                        : categories.length
                          ? "Select a category"
                          : "No active categories available"}
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category._id || category.id}
                        value={category._id || category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {!categoriesLoading && categories.length === 0 && (
                    <p className="mt-2 text-xs text-amber-700">
                      Create or activate a category before adding an event.
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="venue-name"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Venue name *
                  </label>
                  <input
                    id="venue-name"
                    name="venueName"
                    value={formData.venueName}
                    onChange={updateForm}
                    required
                    minLength={2}
                    maxLength={200}
                    placeholder="e.g. Kasarani Stadium"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="venue-city"
                    className="text-sm font-semibold text-slate-700"
                  >
                    City *
                  </label>
                  <input
                    id="venue-city"
                    name="city"
                    value={formData.city}
                    onChange={updateForm}
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="e.g. Nairobi"
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="venue-address"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Venue address *
                  </label>
                  <input
                    id="venue-address"
                    name="venueAddress"
                    value={formData.venueAddress}
                    onChange={updateForm}
                    required
                    minLength={2}
                    maxLength={300}
                    placeholder="Street, building, or venue address"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="venue-country"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Country *
                  </label>
                  <input
                    id="venue-country"
                    name="country"
                    value={formData.country}
                    onChange={updateForm}
                    required
                    minLength={2}
                    maxLength={100}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="cover-image"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Cover image URL
                  </label>
                  <input
                    id="cover-image"
                    name="coverImageUrl"
                    type="url"
                    value={formData.coverImageUrl}
                    onChange={updateForm}
                    placeholder="https://..."
                    className={inputClass}
                  />
                  <p className="mt-1.5 text-xs text-slate-500">
                    Optional. Use a publicly accessible image URL.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="event-start"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Start date and time *
                  </label>
                  <input
                    id="event-start"
                    name="startsAt"
                    type="datetime-local"
                    value={formData.startsAt}
                    onChange={updateForm}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="event-end"
                    className="text-sm font-semibold text-slate-700"
                  >
                    End date and time *
                  </label>
                  <input
                    id="event-end"
                    name="endsAt"
                    type="datetime-local"
                    value={formData.endsAt}
                    onChange={updateForm}
                    required
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="event-status"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Publishing status *
                  </label>

                  <select
                    id="event-status"
                    name="status"
                    value={formData.status}
                    onChange={updateForm}
                    required
                    className={inputClass}
                  >
                    <option value="draft">Save as draft</option>
                    <option value="published">Publish immediately</option>
                  </select>

                  <p
                    className={`mt-3 rounded-xl border px-4 py-3 text-xs leading-5 ${
                      formData.status === "published"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-amber-200 bg-amber-50 text-amber-800"
                    }`}
                  >
                    {formData.status === "published"
                      ? "This event will be published immediately and made available through the public events endpoint."
                      : "This event will be saved as a draft. It will not appear in the public events directory until published."}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Eventix assigns the organizer, generates the event URL
                    slug, and uses KES as the currency. Ticket pricing and
                    capacity are not part of the current event schema.
                  </p>
                </div>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="mx-6 mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 sm:mx-8"
                >
                  {formError}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
                <button
                  type="button"
                  onClick={closeCreateForm}
                  disabled={isCreating}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isCreating ||
                    categoriesLoading ||
                    categories.length === 0
                  }
                  className={`rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
                    formData.status === "published"
                      ? "bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-200"
                      : "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-200"
                  }`}
                >
                  {isCreating
                    ? "Creating event..."
                    : formData.status === "published"
                      ? "Create and publish event"
                      : "Create draft event"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}

export default EventsPage;