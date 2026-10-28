
import { useEffect, useState } from "react";
import { Link } from "react-router";
import EventCard from "../events/EventCard";
import { getRecentEvents } from "../../services/event.service";

function RecentEventsSection() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadEvents() {
      try {
        setIsLoading(true);
        setError("");

        const response = await getRecentEvents({
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setEvents(response);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load events. Please try again.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadEvents();

    return () => controller.abort();
  }, []);

  return (
    <section
      aria-labelledby="recent-events-heading"
      className="border-t border-white/[0.06] bg-[#080f20] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-300">
              Your next experience awaits
            </p>

            <h2
              id="recent-events-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Upcoming events
              <span className="text-purple-400">.</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Discover the experiences, performances, and unforgettable
              moments happening next.
            </p>
          </div>

          <Link
            to="/events"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-purple-300 transition-colors hover:text-purple-200"
          >
            Explore all events
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {isLoading && (
          <div
            role="status"
            aria-live="polite"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111a2c]"
              >
                <div className="aspect-[16/10] bg-white/[0.06]" />
                <div className="space-y-4 p-5">
                  <div className="h-5 w-3/4 rounded bg-white/[0.08]" />
                  <div className="h-4 w-full rounded bg-white/[0.06]" />
                  <div className="h-4 w-2/3 rounded bg-white/[0.06]" />
                </div>
              </div>
            ))}
            <span className="sr-only">Loading upcoming events...</span>
          </div>
        )}

        {!isLoading && error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-6 py-10 text-center"
          >
            <p className="font-semibold text-white">
              We couldn't load the events.
            </p>
            <p className="mt-2 text-sm text-slate-400">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-[#8038f5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6f2be0]"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && events.length === 0 && (
          <div className="rounded-2xl border border-white/[0.08] bg-[#111a2c] px-6 py-14 text-center">
            <h3 className="text-lg font-semibold text-white">
              Great events are on the way.
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              There are no upcoming published events to display just yet.
              Check back soon for something worth experiencing.
            </p>
          </div>
        )}

        {!isLoading && !error && events.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {events.slice(0, 4).map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default RecentEventsSection;
