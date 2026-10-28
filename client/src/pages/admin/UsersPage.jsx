import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";

function UsersPage() {
  return (
    <section className="space-y-8">
      <AdminPageHeader
        title="Users"
        description="Review platform accounts and manage access to the Eventix experience."
      />

      {/* Account overview */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6-7.5a4 4 0 0 1 0 7.75M20 21v-2a4 4 0 0 0-3-3.87"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total users
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Awaiting API connection
              </p>
            </div>
          </div>

          <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
            —
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m5 12 4 4L19 6"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Active accounts
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Awaiting API connection
              </p>
            </div>
          </div>

          <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
            —
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l2.5 2.5"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Account activity
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Awaiting API connection
              </p>
            </div>
          </div>

          <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
            —
          </p>
        </article>
      </div>

      {/* User directory */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              User directory
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Platform accounts and account status
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Backend integration required
          </span>
        </div>

        <div className="border-b border-slate-100 p-5 sm:p-6">
          <label
            htmlFor="users-search"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Search users
          </label>

          <div className="relative max-w-md">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16 16 4 4"
              />
            </svg>

            <input
              id="users-search"
              type="search"
              disabled
              placeholder="Search by name or email..."
              className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-500 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="px-6 py-14 text-center sm:py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6-7.5a4 4 0 0 1 0 7.75M20 21v-2a4 4 0 0 0-3-3.87"
              />
            </svg>
          </div>

          <h3 className="mt-5 text-base font-semibold text-slate-900">
            User management is not connected yet
          </h3>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
            Once the backend provides a protected user-management
            endpoint, this directory will display real accounts,
            searchable results, account status, and administrative
            actions.
          </p>

          <div className="mx-auto mt-6 max-w-lg rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-left">
            <p className="text-sm font-semibold text-blue-950">
              Next backend requirements
            </p>

            <ul className="mt-2 space-y-2 text-sm leading-5 text-blue-900">
              <li>• Admin-only user listing with pagination</li>
              <li>• Validated search and account-status filters</li>
              <li>• Protected account-status management</li>
              <li>• Audit logging for administrative changes</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-4">
          <p className="text-xs leading-5 text-slate-500">
            Account data and administrative permissions must be
            enforced by the backend. This page does not create
            mock users or simulate account-management actions.
          </p>
        </div>
      </div>
    </section>
  );
}

export default UsersPage;