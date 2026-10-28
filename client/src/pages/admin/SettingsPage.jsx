
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";

const settingsSections = [
  {
    number: "01",
    title: "Platform configuration",
    description:
      "Manage platform identity, branding, and other global configuration options.",
    status: "Backend required",
  },
  {
    number: "02",
    title: "Security and access",
    description:
      "Review administrator access policies, authentication requirements, and account security.",
    status: "Backend required",
  },
  {
    number: "03",
    title: "Notifications",
    description:
      "Configure email notifications for account activity, event updates, and ticketing workflows.",
    status: "Backend required",
  },
  {
    number: "04",
    title: "Payments and currency",
    description:
      "Configure supported currencies and payment-provider settings through secure server-side integration.",
    status: "Backend required",
  },
];

function SettingsPage() {
  return (
    <div className="min-h-full space-y-8 pb-10">
      <AdminPageHeader
        eyebrow="System administration"
        title="Settings"
        description="Manage the configuration, security, and operational preferences of your Eventix platform."
      />

      {/* Environment status */}
      <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path
                d="M12 11v5m0-8h.01"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Configuration workspace
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              This page is currently a settings interface. Persistent
              configuration changes are not available until the corresponding
              protected backend endpoints are implemented.
            </p>
          </div>
        </div>
      </section>

      {/* Settings options */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Platform settings
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Configuration areas planned for the administration workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {settingsSections.map((section) => (
            <article
              key={section.number}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700">
                  {section.number}
                </div>

                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  {section.status}
                </span>
              </div>

              <h3 className="mt-5 text-base font-bold text-slate-900">
                {section.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {section.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Security reminder */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                d="M12 3 20 7v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V7l8-4Z"
                strokeLinejoin="round"
              />
              <path
                d="m9 12 2 2 4-4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Security comes first
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Sensitive settings, payment credentials, and administrator
              permissions must be validated and enforced on the server.
              Secret keys must never be exposed in frontend code.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SettingsPage;
