import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import EventCard from "../../components/events/EventCard.jsx";
import { getPublishedEvents } from "../../services/event.service.js";
import { getActiveCategories } from "../../services/category.service.js";

function EventsPage() {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get("category") || "";

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadEventsPage() {
      setIsLoading(true);
      setError("");

      try {
        const [eventResults, categoryResults] = await Promise.all([
          getPublishedEvents({
            signal: controller.signal,
            categorySlug: categorySlug || undefined,
          }),
          getActiveCategories({ signal: controller.signal }),
        ]);

        if (!controller.signal.aborted) {
          setEvents(eventResults);
          setCategories(categoryResults);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Unable to load events.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadEventsPage();

    return () => controller.abort();
  }, [categorySlug, retryCount]);

  const selectedCategory = categories.find(
    (category) => category.slug === categorySlug,
  );

  const pageTitle = categorySlug
    ? selectedCategory?.name || "Category Events"
    : "Discover Events";

  return (
    <div className="min-h-screen bg-[#080f20] text-white">

      <main>
        <section className="border-b border-white/10 bg-[#101a30] px-5 py-14 sm:px-8 sm:py-20 lg:px-16">
          <div className="mx-auto max-w-[1440px]">
            <Link
              to="/"
              className="text-sm font-semibold text-purple-300 transition hover:text-purple-200"
            >
              &larr; Back to home
            </Link>

            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
              {pageTitle}
            </h1>

            <p className="mt-4 max-w-2xl text-slate-300">
              Discover upcoming events, explore your interests, and find
              your next unforgettable experience.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-16">
          <div className="mb-8 flex flex-wrap gap-3">
            <Link
              to="/events"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                !categorySlug
                  ? "bg-purple-600 text-white"
                  : "bg-white/5 text-slate-300 ring-1 ring-white/10 hover:bg-white/10"
              }`}
            >
              All events
            </Link>

            {categories.map((category) => (
              <Link
                key={category._id || category.id || category.slug}
                to={`/events?category=${encodeURIComponent(category.slug)}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  categorySlug === category.slug
                    ? "bg-purple-600 text-white"
                    : "bg-white/5 text-slate-300 ring-1 ring-white/10 hover:bg-white/10"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>

          {isLoading && (
            <div className="py-20 text-center" role="status">
              <p className="text-slate-300">Loading events...</p>
            </div>
          )}

          {!isLoading && error && (
            <div
              className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6"
              role="alert"
            >
              <h2 className="text-lg font-semibold text-red-200">
                We couldn't load the events
              </h2>

              <p className="mt-2 text-sm text-red-100/80">{error}</p>

              <button
                type="button"
                onClick={() => setRetryCount((count) => count + 1)}
                className="mt-5 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Try again
              </button>
            </div>
          )}

          {!isLoading && !error && events.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
              <h2 className="text-xl font-semibold">
                No upcoming events found
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-slate-400">
                {categorySlug
                  ? `There are currently no published upcoming events in ${
                      selectedCategory?.name || "this category"
                    }.`
                  : "There are currently no published upcoming events. Please check again later."}
              </p>

              {categorySlug && (
                <Link
                  to="/events"
                  className="mt-6 inline-flex font-semibold text-purple-300 transition hover:text-purple-200"
                >
                  Browse all events
                </Link>
              )}
            </div>
          )}

          {!isLoading && !error && events.length > 0 && (
            <>
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold sm:text-2xl">
                  {categorySlug
                    ? `${selectedCategory?.name || "Category"} events`
                    : "Upcoming events"}
                </h2>

                <p className="shrink-0 text-sm text-slate-400">
                  {events.length}{" "}
                  {events.length === 1 ? "event" : "events"}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {events.map((event) => (
                  <EventCard
                    key={event._id || event.id || event.slug}
                    event={event}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      
    </div>
  );
}

export default EventsPage;