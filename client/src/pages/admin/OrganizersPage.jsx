
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";

const plannedCapabilities = [
  {
    number: "01",
    title: "Organizer directory",
    description:
      "View registered organizers, their email addresses, account status, and registration dates.",
  },
  {
    number: "02",
    title: "Account oversight",
    description:
      "Review organizer account activity and introduce protected account suspension and reactivation.",
  },
  {
    number: "03",
    title: "Event ownership",
    description:
      "See which events belong to each organizer and review their publishing activity.",
  },
];

function OrganizersPage() {
  return (
    <div className="min-h-full space-y-8 pb-10">
      <AdminPageHeader
        eyebrow="Platform management"
        title="Organizers"
        description="Manage event creators, review their accounts, and maintain visibility over activity across Eventix."
      />

      {/* Summary cards */}
      <section
        aria-label="Organizer statistics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total organizers
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                —
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  strokeLinecap="round"
                />
                <circle cx="10" cy="7" r="4" />
                <path
                  d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Awaiting organizer API
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Active accounts
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                —
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  d="m5 12 4 4L19 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Awaiting organizer API
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Organizer events
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                —
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path
                  d="M16 2v4M8 2v4M3 10h18"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Awaiting organizer API
          </p>
        </article>
      </section>

      {/* Backend integration notice */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Organizer directory
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your platform's organizer accounts will appear here.
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              API integration pending
            </span>
          </div>
        </div>

        <div className="px-6 py-12 text-center sm:px-7 sm:py-16">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-8 w-8"
              aria-hidden="true"
            >
              <circle cx="9" cy="8" r="3.5" />
              <path
                d="M2.5 20v-1.5A5.5 5.5 0 0 1 8 13h2a5.5 5.5 0 0 1 5.5 5.5V20"
                strokeLinecap="round"
              />
              <path
                d="M17 8h5M19.5 5.5v5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h3 className="mt-5 text-lg font-bold text-slate-900">
            Organizer management is coming next
          </h3>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
            The current backend does not expose a dedicated admin organizer
            management API. We'll connect this directory after implementing
            the required protected endpoints.
          </p>

          <div className="mx-auto mt-7 max-w-md rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Backend work required
            </p>

            <ul className="mt-3 space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-blue-600">01.</span>
                <span>Paginated organizer listing and search.</span>
              </li>

              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-blue-600">02.</span>
                <span>Organizer account status and event statistics.</span>
              </li>

              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-blue-600">03.</span>
                <span>Admin authorization and validated management actions.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Planned capabilities */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Organizer management capabilities
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            The functionality we'll implement as the backend evolves.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {plannedCapabilities.map((capability) => (
            <article
              key={capability.number}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <p className="text-sm font-bold tracking-wider text-blue-600">
                {capability.number}
              </p>

              <h3 className="mt-4 font-bold text-slate-900">
                {capability.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {capability.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default OrganizersPage;
