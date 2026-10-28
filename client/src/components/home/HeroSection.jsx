
import { useState } from "react";

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m16 16 4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
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
      className="h-5 w-5"
    >
      <path
        d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function HeroSection() {
  const [search, setSearch] = useState({
    keyword: "",
    location: "",
    date: "",
  });

  function handleSubmit(event) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (search.keyword.trim()) {
      params.set("q", search.keyword.trim());
    }

    if (search.location.trim()) {
      params.set("location", search.location.trim());
    }

    if (search.date) {
      params.set("date", search.date);
    }

    const query = params.toString();
    const destination = query ? `/events?${query}` : "/events";

    window.location.assign(destination);
  }

  return (
    <section className="relative isolate overflow-hidden bg-[#080f20]">
      {/* Atmospheric background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(128,56,245,0.19),transparent_58%)]" />
        <div className="absolute -left-40 top-24 h-80 w-80 rounded-full bg-purple-700/10 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-28 lg:px-16 lg:pb-28 lg:pt-32">
        {/* Hero copy */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-purple-200 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-[#a78bfa]" />
            Discover experiences worth remembering
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Life happens{" "}
            <span className="block">
              <span className="bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#7199ff] bg-clip-text text-transparent">
                live.
              </span>{" "}
              Be there.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
            From unforgettable live music to the biggest sporting moments,
            discover the events you'll be talking about long after they're over.
          </p>
        </div>

        {/* Event search */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-12 grid max-w-5xl gap-3 rounded-2xl border border-white/10 bg-white p-3 shadow-2xl shadow-black/30 sm:mt-14 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_0.9fr_auto] lg:items-center lg:gap-0 lg:rounded-2xl lg:p-2"
          role="search"
          aria-label="Find events"
        >
          <label className="flex min-w-0 items-center gap-3 rounded-xl px-3 py-3 focus-within:bg-slate-50 lg:border-r lg:border-slate-200">
            <span className="shrink-0 text-[#8038f5]">
              <SearchIcon />
            </span>

            <span className="min-w-0 flex-1">
              <span className="mb-1 block text-xs font-semibold text-slate-800">
                What
              </span>
              <input
                type="search"
                name="keyword"
                value={search.keyword}
                onChange={(event) =>
                  setSearch((current) => ({
                    ...current,
                    keyword: event.target.value,
                  }))
                }
                placeholder="Music, football, festivals..."
                className="w-full min-w-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </span>
          </label>

          <label className="flex min-w-0 items-center gap-3 rounded-xl px-3 py-3 focus-within:bg-slate-50 lg:border-r lg:border-slate-200">
            <span className="shrink-0 text-[#8038f5]">
              <LocationIcon />
            </span>

            <span className="min-w-0 flex-1">
              <span className="mb-1 block text-xs font-semibold text-slate-800">
                Where
              </span>
              <input
                type="text"
                name="location"
                value={search.location}
                onChange={(event) =>
                  setSearch((current) => ({
                    ...current,
                    location: event.target.value,
                  }))
                }
                placeholder="City or venue"
                className="w-full min-w-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </span>
          </label>

          <label className="flex min-w-0 items-center gap-3 rounded-xl px-3 py-3 focus-within:bg-slate-50 lg:border-r lg:border-slate-200">
            <span className="shrink-0 text-[#8038f5]">
              <CalendarIcon />
            </span>

            <span className="min-w-0 flex-1">
              <span className="mb-1 block text-xs font-semibold text-slate-800">
                When
              </span>
              <input
                type="date"
                name="date"
                value={search.date}
                onChange={(event) =>
                  setSearch((current) => ({
                    ...current,
                    date: event.target.value,
                  }))
                }
                className="w-full min-w-0 bg-transparent text-sm text-slate-700 outline-none"
              />
            </span>
          </label>

          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#8038f5] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6f2be0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8038f5] sm:col-span-2 lg:col-span-1"
          >
            <SearchIcon />
            Search events
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Music · Sports · Festivals · Conferences · More
        </p>
      </div>
    </section>
  );
}

export default HeroSection;
