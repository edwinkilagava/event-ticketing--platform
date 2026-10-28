
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";

const plannedFeatures = [
  {
    number: "01",
    title: "Booking directory",
    description:
      "Search bookings by reference, customer, event, or booking status.",
  },
  {
    number: "02",
    title: "Ticket verification",
    description:
      "Inspect ticket details and support secure verification at event entry.",
  },
  {
    number: "03",
    title: "Booking management",
    description:
      "Review booking details and manage eligible cancellations using validated backend rules.",
  },
];

function BookingsPage() {
  return (
    <div className="min-h-full space-y-8 pb-10">
      <AdminPageHeader
        eyebrow="Ticketing operations"
        title="Bookings"
        description="Monitor customer reservations, ticket allocations, and booking activity across Eventix."
      />

      {/* Booking summary */}
      <section
        aria-label="Booking statistics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {[
          {
            label: "Total bookings",
            icon: "calendar",
            color: "bg-blue-50 text-blue-700",
          },
          {
            label: "Confirmed bookings",
            icon: "check",
            color: "bg-emerald-50 text-emerald-700",
          },
          {
            label: "Cancelled bookings",
            icon: "cancel",
            color: "bg-rose-50 text-rose-700",
          },
        ].map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  —
                </p>
              </div>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
              >
                {stat.icon === "calendar" && (
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
                )}

                {stat.icon === "check" && (
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
                )}

                {stat.icon === "cancel" && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path
                      d="m15 9-6 6m0-6 6 6"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Booking API not connected
            </p>
          </article>
        ))}
      </section>

      {/* Main booking directory */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Booking directory
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review and manage ticket reservations.
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Backend integration pending
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
              <rect x="3" y="5" width="18" height="15" rx="2" />
              <path
                d="M7 9h10M7 13h6M7 17h3"
                strokeLinecap="round"
              />
              <path d="M8 3v4M16 3v4" strokeLinecap="round" />
            </svg>
          </div>

          <h3 className="mt-5 text-lg font-bold text-slate-900">
            Booking management is coming next
          </h3>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
            Eventix does not yet have the booking data models and protected
            booking endpoints needed to retrieve real reservations. We'll
            connect this page once those backend components are implemented.
          </p>

          <div className="mx-auto mt-7 max-w-md rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Backend work required
            </p>

            <ul className="mt-3 space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-blue-600">01.</span>
                <span>Booking and ticket data models with unique references.</span>
              </li>

              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-blue-600">02.</span>
                <span>Protected, paginated booking endpoints and filters.</span>
              </li>

              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-blue-600">03.</span>
                <span>
                  Booking status rules, ticket verification, and authorization.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Planned capabilities */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Booking operations
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Capabilities planned for the connected dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {plannedFeatures.map((feature) => (
            <article
              key={feature.number}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <p className="text-sm font-bold tracking-wider text-blue-600">
                {feature.number}
              </p>

              <h3 className="mt-4 font-bold text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default BookingsPage;
