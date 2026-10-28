
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";

const reportTypes = [
  {
    number: "01",
    title: "Event performance",
    description:
      "Review published events, event activity, and performance over a selected period.",
  },
  {
    number: "02",
    title: "Booking analytics",
    description:
      "Analyze booking volumes, confirmed reservations, and cancellations when booking data becomes available.",
  },
  {
    number: "03",
    title: "Financial reports",
    description:
      "Review verified payment totals, refunds, and transaction summaries after payment integration.",
  },
];

function ReportsPage() {
  return (
    <div className="min-h-full space-y-8 pb-10">
      <AdminPageHeader
        eyebrow="Insights and analytics"
        title="Reports"
        description="Understand event activity and platform performance through reliable, data-driven reports."
      />

      {/* Reporting overview */}
      <section
        aria-label="Report summary"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {[
          {
            title: "Event performance",
            description: "Event activity and publishing",
            icon: "events",
            color: "bg-blue-50 text-blue-700",
          },
          {
            title: "Booking analytics",
            description: "Reservations and ticket activity",
            icon: "bookings",
            color: "bg-violet-50 text-violet-700",
          },
          {
            title: "Financial reports",
            description: "Transactions and refunds",
            icon: "finance",
            color: "bg-emerald-50 text-emerald-700",
          },
        ].map((report) => (
          <article
            key={report.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${report.color}`}
            >
              {report.icon === "events" && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="17" rx="2" />
                  <path d="M8 2v4M16 2v4M3 10h18" strokeLinecap="round" />
                </svg>
              )}

              {report.icon === "bookings" && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="M4 7a2 2 0 0 0 0 4v5h16v-5a2 2 0 0 1 0-4V4H4v3Z"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 7v2m0 2v2"
                    strokeLinecap="round"
                    strokeDasharray="1 2"
                  />
                </svg>
              )}

              {report.icon === "finance" && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 10h18M7 15h4" strokeLinecap="round" />
                </svg>
              )}
            </div>

            <h2 className="mt-4 font-bold text-slate-900">
              {report.title}
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {report.description}
            </p>

            <p className="mt-4 text-xs font-medium text-amber-700">
              Data integration pending
            </p>
          </article>
        ))}
      </section>

      {/* Integration notice */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
          <h2 className="text-lg font-bold text-slate-900">
            Reporting workspace
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your central workspace for platform reports and analytics.
          </p>
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
              <path
                d="M4 19V5m0 14h17"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="m7 15 4-4 3 2 6-7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h3 className="mt-5 text-lg font-bold text-slate-900">
            Analytics will appear here
          </h3>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
            The backend currently provides basic dashboard statistics, but
            bookings, payments, and comprehensive reporting endpoints are not
            implemented yet. Reports will use real backend data as those
            capabilities become available.
          </p>

          <div className="mx-auto mt-7 max-w-md rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Planned reporting capabilities
            </p>

            <ul className="mt-3 space-y-4">
              {reportTypes.map((report) => (
                <li key={report.number} className="flex items-start gap-3">
                  <span className="mt-0.5 text-sm font-bold text-blue-600">
                    {report.number}
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {report.title}
                    </p>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      {report.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ReportsPage;
