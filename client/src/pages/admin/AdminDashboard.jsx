
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";

import { ApiError } from "../../services/api.js";
import { getDashboardStats } from "../../services/admin.service.js";

const metricDefinitions = [
  {
    key: "totalUsers",
    title: "Total users",
    description: "Registered accounts across the platform",
    symbol: "U",
    color: "bg-blue-50 text-blue-700",
  },
  {
    key: "publishedEvents",
    title: "Published events",
    description: "Published events that have not ended",
    symbol: "E",
    color: "bg-violet-50 text-violet-700",
  },
  {
    key: "totalOrganizers",
    title: "Organizers",
    description: "Accounts with organizer privileges",
    symbol: "O",
    color: "bg-amber-50 text-amber-700",
  },
  {
    key: "totalCategories",
    title: "Active categories",
    description: "Categories available on the platform",
    symbol: "C",
    color: "bg-emerald-50 text-emerald-700",
  },
];

const quickActions = [
  {
    title: "Manage users",
    description: "Review platform accounts.",
    to: "/admin/users",
    number: "01",
  },
  {
    title: "Review organizers",
    description: "View organizer accounts.",
    to: "/admin/organizers",
    number: "02",
  },
  {
    title: "Manage events",
    description: "Review and oversee events.",
    to: "/admin/events",
    number: "03",
  },
  {
    title: "Manage categories",
    description: "Organize events by category.",
    to: "/admin/categories",
    number: "04",
  },
];

function formatNumber(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-KE").format(value);
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await getDashboardStats();
      setStats(result);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "We could not load the dashboard statistics.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <div className="mx-auto max-w-[1600px] space-y-8">
      <section className="relative isolate overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 shadow-xl shadow-slate-900/10 sm:px-9 sm:py-10">
        <div
          aria-hidden="true"
          className="absolute -right-12 -top-24 -z-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="absolute -bottom-32 right-1/4 -z-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"
        />

        <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Administration workspace
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your platform.
              <span className="block text-blue-400">
                One clear overview.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Monitor Eventix accounts, oversee published events,
              and manage the platform from one central workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/events"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              View events
              <span aria-hidden="true" className="ml-2">↗</span>
            </Link>

            <button
              type="button"
              onClick={loadStats}
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Refreshing..." : "Refresh statistics"}
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Platform performance"
            title="Your numbers at a glance"
            description="Statistics retrieved from the Eventix backend."
          />

          {!isLoading && !error && (
            <p className="text-xs text-slate-500">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Data loaded successfully
            </p>
          )}
        </div>

        {error && (
          <div
            className="mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center"
            role="alert"
          >
            <div>
              <p className="font-semibold text-red-800">
                Statistics could not be loaded
              </p>
              <p className="mt-1 text-sm leading-6 text-red-700">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={loadStats}
              className="shrink-0 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800"
            >
              Try again
            </button>
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricDefinitions.map((metric) => (
            <article
              key={metric.key}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {metric.title}
                  </p>

                  <p
                    className="mt-4 text-3xl font-bold tracking-tight text-slate-900"
                    aria-live="polite"
                  >
                    {isLoading ? (
                      <span
                        className="inline-block h-9 w-20 animate-pulse rounded-lg bg-slate-100"
                        aria-label="Loading statistic"
                      />
                    ) : error ? (
                      "—"
                    ) : (
                      formatNumber(stats?.[metric.key])
                    )}
                  </p>
                </div>

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${metric.color}`}
                  aria-hidden="true"
                >
                  {metric.symbol}
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-xs leading-5 text-slate-500">
                  {metric.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Published events counts events whose end time has not passed.
          Booking totals and revenue are not displayed because those
          statistics are not implemented in the backend yet.
        </p>
      </section>

      <section>
        <SectionHeading
          eyebrow="Administration"
          title="Manage your platform"
          description="Quick access to the main management areas."
        />

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-950/5 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold tracking-wide text-slate-600 transition group-hover:bg-blue-50 group-hover:text-blue-700">
                  {action.number}
                </span>

                <span
                  aria-hidden="true"
                  className="text-lg text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
                >
                  ↗
                </span>
              </div>

              <h3 className="mt-5 font-semibold text-slate-900">
                {action.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
        <SectionHeading
          eyebrow="Monitoring"
          title="Platform activity"
          description="Activity history will be connected when an audit or activity API is implemented."
        />

        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
            <span aria-hidden="true" className="text-xl">◷</span>
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-800">
            Activity feed not connected yet
          </h3>

          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            We will display real registrations, event changes, and other
            platform activity after the corresponding backend endpoint exists.
          </p>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
