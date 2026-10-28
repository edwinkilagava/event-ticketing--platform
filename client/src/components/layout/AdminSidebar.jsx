import { NavLink, useNavigate } from "react-router";

const navigation = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", path: "/admin/dashboard", icon: "▦" },
    ],
  },
  {
    label: "Management",
    items: [
      { name: "Users", path: "/admin/users", icon: "♙" },
      { name: "Organizers", path: "/admin/organizers", icon: "♧" },
      { name: "Events", path: "/admin/events", icon: "▣" },
      { name: "Categories", path: "/admin/categories", icon: "◈" },
    ],
  },
  {
    label: "Platform",
    items: [
      { name: "Bookings", path: "/admin/bookings", icon: "▤" },
      { name: "Payments", path: "/admin/payments", icon: "◇" },
      { name: "Reports", path: "/admin/reports", icon: "▥" },
      { name: "Settings", path: "/admin/settings", icon: "⚙" },
    ],
  },
];

function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  function handleBrandClick() {
    navigate("/admin/dashboard");
    onClose?.();
  }

  return (
    <>
      {/* Mobile navigation overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        aria-label="Administrator navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white text-slate-800 shadow-sm transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex h-20 shrink-0 items-center border-b border-slate-100 px-5">
          <button
            type="button"
            onClick={handleBrandClick}
            className="flex items-center gap-3 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white shadow-sm">
              E
            </span>

            <span>
              <span className="block text-xl font-bold tracking-tight text-slate-950">
                Eventix
              </span>
              <span className="mt-0.5 block text-[11px] font-semibold tracking-[0.12em] text-slate-500">
                ADMIN CONSOLE
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="ml-auto rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              ×
            </span>
          </button>
        </div>

        {/* Navigation links */}
        <nav
          aria-label="Admin menu"
          className="flex-1 space-y-8 overflow-y-auto px-3 py-7"
        >
          {navigation.map((section) => (
            <section key={section.label}>
              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                {section.label}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/admin/dashboard"}
                    onClick={onClose}
                    className={({ isActive }) =>
                      [
                        "group relative flex min-h-12 items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold",
                        "transition-colors duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                        isActive
                          ? "bg-blue-50 text-blue-950 ring-1 ring-inset ring-blue-100"
                          : "bg-transparent text-slate-700 hover:bg-slate-50 hover:text-slate-950",
                      ].join(" ")
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Icon */}
                        <span
                          aria-hidden="true"
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg transition-colors ${
                            isActive
                              ? "bg-blue-100 text-blue-700"
                              : "text-slate-500 group-hover:bg-slate-100 group-hover:text-slate-800"
                          }`}
                        >
                          {item.icon}
                        </span>

                        {/* Link label */}
                        <span className="flex-1">{item.name}</span>

                        {/* Active indicator */}
                        {isActive && (
                          <span
                            aria-hidden="true"
                            className="h-2 w-2 shrink-0 rounded-full bg-blue-600"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </section>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="shrink-0 border-t border-slate-100 p-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-emerald-500"
              />
              <p className="text-sm font-semibold text-slate-900">
                Platform administration
              </p>
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-600">
              Manage the Eventix platform from one workspace.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;