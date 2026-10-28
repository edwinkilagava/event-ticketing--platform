import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getActiveCategories } from "../../services/category.service.js";

function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      try {
        setIsLoading(true);
        setError("");

        const result = await getActiveCategories({
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setCategories(result);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load event categories.",
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
    <section
      aria-labelledby="categories-heading"
      className="border-t border-white/[0.06] bg-[#0b1324] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-300">
              Find your experience
            </p>

            <h2
              id="categories-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Browse by category
              <span className="text-purple-400">.</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Explore events across different interests and experiences.
            </p>
          </div>

          <Link
            to="/categories"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-purple-300 transition-colors hover:text-purple-200"
          >
            All categories
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {isLoading && (
          <div
            role="status"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111a2c]"
              >
                <div className="aspect-[5/3] bg-white/[0.06]" />
                <div className="p-4">
                  <div className="h-5 w-2/3 rounded bg-white/[0.08]" />
                </div>
              </div>
            ))}
            <span className="sr-only">Loading event categories...</span>
          </div>
        )}

        {!isLoading && error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-6 py-8 text-center"
          >
            <p className="font-semibold text-white">
              We couldn't load the categories.
            </p>
            <p className="mt-2 text-sm text-slate-400">{error}</p>

            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-5 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-500"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && categories.length === 0 && (
          <div className="rounded-2xl border border-white/[0.08] bg-[#111a2c] px-6 py-10 text-center">
            <p className="font-semibold text-white">
              No categories are available yet.
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Active categories will appear here when they are added to
              Eventix.
            </p>
          </div>
        )}

        {!isLoading && !error && categories.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/categories?category=${encodeURIComponent(category.slug)}`}
                className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111a2c] transition duration-300 hover:-translate-y-1 hover:border-purple-400/40"
              >
                <div className="relative aspect-[5/3] overflow-hidden bg-gradient-to-br from-purple-950 via-[#18233d] to-[#111a2c]">
                  {category.imageUrl && (
                    <img
                      src={category.imageUrl}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#080f20]/80 via-transparent to-transparent" />

                  <div className="absolute inset-x-4 bottom-4">
                    <h3 className="text-lg font-bold text-white sm:text-xl">
                      {category.name}
                    </h3>
                  </div>
                </div>

                {category.description && (
                  <p className="line-clamp-2 px-4 py-3 text-sm leading-5 text-slate-400">
                    {category.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default CategorySection;