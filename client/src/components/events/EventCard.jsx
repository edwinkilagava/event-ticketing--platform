
import { Link } from "react-router";

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M16 3v4M8 3v4M3 10h18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path
        d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle
        cx="12"
        cy="10"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function formatEventDate(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Date to be announced";
  }

  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Africa/Nairobi",
  }).format(date);
}

function EventCard({ event }) {
  const venue = [
    event.venue?.name,
    event.venue?.city,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111a2c] transition duration-300 hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-xl hover:shadow-purple-950/20">
      <Link
        to={`/events/${encodeURIComponent(event.slug)}`}
        className="block focus-visible:outline-offset-[-4px]"
        aria-label={`View details for ${event.title}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-[#1b2740]">
          {event.coverImageUrl ? (
            <img
              src={event.coverImageUrl}
              alt={event.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#30205a] via-[#18233d] to-[#101827]">
              <span className="text-5xl font-bold text-white/15">
                E.
              </span>
            </div>
          )}

          {event.category?.name && (
            <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-[#080f20]/85 px-3 py-1.5 text-xs font-semibold text-purple-200 backdrop-blur">
              {event.category.name}
            </span>
          )}
        </div>

        <div className="p-5">
          <h3 className="line-clamp-2 min-h-12 text-lg font-bold leading-6 text-white transition-colors group-hover:text-purple-300">
            {event.title}
          </h3>

          <div className="mt-4 flex items-start gap-2.5 text-sm text-slate-400">
            <span className="mt-0.5 shrink-0 text-purple-300">
              <CalendarIcon />
            </span>
            <span>{formatEventDate(event.startsAt)}</span>
          </div>

          <div className="mt-3 flex items-start gap-2.5 text-sm text-slate-400">
            <span className="mt-0.5 shrink-0 text-purple-300">
              <LocationIcon />
            </span>
            <span className="line-clamp-2">
              {venue || "Venue to be announced"}
            </span>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4">
            <span className="text-sm font-medium text-slate-300">
              Explore event
            </span>
            <span
              aria-hidden="true"
              className="text-lg text-purple-300 transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default EventCard;
