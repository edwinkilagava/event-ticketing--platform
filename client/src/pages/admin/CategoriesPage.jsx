import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError } from "../../services/api.js";
import { getActiveCategories } from "../../services/category.service.js";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadCategories = useCallback(
    async ({ quiet = false, signal } = {}) => {
      if (quiet) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const result = await getActiveCategories({ signal });
        setCategories(result);
      } catch (err) {
        if (err?.name === "AbortError") return;

        setError(
          err instanceof ApiError
            ? err.message
            : err?.message || "Unable to load categories."
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

    loadCategories({ signal: controller.signal });

    return () => controller.abort();
  }, [loadCategories]);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return categories;

    return categories.filter((category) =>
      [
        category.name,
        category.slug,
        category.description,
      ].some((value) =>
        String(value || "").toLowerCase().includes(query)
      )
    );
  }, [categories, search]);

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Event management
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Categories
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Browse the categories that organize events across
            the Eventix platform.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadCategories({ quiet: true })}
          disabled={loading || refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 7v5h-5M4 17v-5h5M5.6 9A7 7 0 0 1 18 6l2 2M4 16l2 2a7 7 0 0 0 12.4-3"
            />
          </svg>
          Refresh categories
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Active categories
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {loading
              ? "—"
              : categories.length.toLocaleString("en-KE")}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Categories returned by the API
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Search results
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-blue-700">
            {loading
              ? "—"
              : filteredCategories.length.toLocaleString("en-KE")}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Categories matching your search
          </p>
        </article>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Category directory
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {loading
                ? "Loading categories..."
                : `${filteredCategories.length} categories displayed`}
            </p>
          </div>

          <label className="block sm:w-80">
            <span className="sr-only">Search categories</span>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
        </div>

        {loading ? (
          <div
            className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3 sm:p-6"
            aria-label="Loading categories"
            aria-busy="true"
          >
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-44 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : error ? (
          <div className="px-6 py-14 text-center">
            <h3 className="font-semibold text-slate-900">
              Could not load categories
            </h3>

            <p role="alert" className="mt-2 text-sm text-rose-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => loadCategories()}
              className="mt-5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Try again
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13ZM8 4v4m8-4v4M4 10h16"
                />
              </svg>
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              {categories.length
                ? "No matching categories"
                : "No active categories"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {categories.length
                ? "Try a different search term."
                : "Active categories returned by the API will appear here."}
            </p>

            {categories.length > 0 && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-4 text-sm font-semibold text-blue-700 hover:text-blue-800"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3 sm:p-6">
            {filteredCategories.map((category) => (
              <article
                key={category._id || category.id || category.slug}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-md"
              >
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt=""
                    loading="lazy"
                    className="h-36 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-28 items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-bold text-blue-700 shadow-sm ring-1 ring-slate-200">
                      {(category.name || "C")
                        .trim()
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-slate-900">
                      {category.name || "Unnamed category"}
                    </h3>

                    <span className="inline-flex shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      Active
                    </span>
                  </div>

                  <p className="mt-2 min-h-10 text-sm leading-5 text-slate-600">
                    {category.description ||
                      "No description provided."}
                  </p>

                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <p className="text-xs text-slate-500">
                      Category slug
                    </p>

                    <p className="mt-1 break-all font-mono text-xs text-slate-700">
                      {category.slug || "Not available"}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <footer className="border-t border-slate-100 px-6 py-4">
          <p className="text-xs leading-5 text-slate-500">
            Read-only view: the current backend provides category
            listing but does not yet expose category creation,
            editing, or deactivation endpoints.
          </p>
        </footer>
      </div>
    </section>
  );
}

export default CategoriesPage;