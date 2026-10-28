
import useAuth from "../../hooks/useAuth.js";

function AdminHeader({ onMenuClick }) {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  const displayName = user?.name || "Administrator";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
        >
          ☰
        </button>

        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">
            Eventix / Administration
          </p>
          <h1 className="mt-1 truncate text-lg font-semibold text-slate-900 sm:text-xl">
            Admin workspace
          </h1>
        </div>
      </div>

      <div className="ml-3 flex shrink-0 items-center gap-3 sm:gap-5">
        <div className="hidden text-right sm:block">
          <p className="max-w-44 truncate text-sm font-semibold text-slate-800">
            {displayName}
          </p>
          <p className="mt-0.5 text-xs capitalize text-slate-500">
            {user?.role || "admin"}
          </p>
        </div>

        <div
          aria-label={`Signed in as ${displayName}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700"
        >
          {initial}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <span className="hidden sm:inline">Sign out</span>
          <span className="sm:hidden">Exit</span>
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
