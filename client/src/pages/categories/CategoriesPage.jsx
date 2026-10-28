
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getActiveCategories } from "../../services/category.service.js";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getActiveCategories({
          signal: controller.signal,
        });

        setCategories(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            err.message || "Unable to load event categories."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadCategories();

    return () => controller.abort();
  }, [retryCount]);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-amber-400">
            Find your next experience
          </p>

          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Explore events by category
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Discover events that match your interests, from live
            sports and music to conferences and unforgettable
            experiences.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Browse categories
            </h2>

            <p className="mt-2 text-slate-600">
              Choose a category to discover relevant events.
            </p>
          </div>

          {!isLoading && !error && categories.length > 0 && (
            <p className="text-sm font-medium text-slate-500">
              {categories.length}{" "}
              {categories.length === 1 ? "category" : "categories"}
            </p>
          )}
        </div>

        {isLoading && (
          <div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            aria-label="Loading categories"
          >
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div
            className="rounded-2xl border border-red-200 bg-white p-8 text-center"
            role="alert"
          >
            <h3 className="text-lg font-bold text-slate-900">
              We couldn’t load the categories
            </h3>

            <p className="mt-2 text-slate-600">{error}</p>

            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-5 rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && categories.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
            <h3 className="text-xl font-bold text-slate-900">
              No categories available yet
            </h3>

            <p className="mt-2 text-slate-600">
              Please check back later for available event categories.
            </p>
          </div>
        )}

        {!isLoading && !error && categories.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/events?category=${encodeURIComponent(category.slug)}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                <div className="relative h-48 overflow-hidden bg-slate-200">
                  {category.imageUrl ? (
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                        className="h-14 w-14 text-amber-400"
                      >
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                        />
                        <path d="M7 9h.01M7 15h.01M11 9h6M11 13h6" />
                      </svg>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-slate-900 transition group-hover:text-amber-600">
                    {category.name}
                  </h3>

                  <p className="mt-2 line-clamp-3 min-h-12 text-sm leading-6 text-slate-600">
                    {category.description ||
                      "Explore upcoming events in this category."}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 font-semibold text-slate-900">
                    Explore events
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default CategoriesPage;
