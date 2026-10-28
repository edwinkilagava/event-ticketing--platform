
import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext.jsx";

function TicketIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M4 8a2 2 0 0 0 0 4v4h16v-4a2 2 0 0 1 0-4V4H4v4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 4v2m0 3v2m0 3v2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M4.5 21a7.5 7.5 0 0 1 15 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M10 17l5-5-5-5m5 5H3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`h-4 w-4 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const navigationLinks = [
  { label: "Explore Events", to: "/" },
  { label: "Categories", to: "/categories" },
  { label: "My Tickets", to: "/tickets" },
   { label: "Contact Us", to: "/contact Us" },
];

function getInitials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  );
}

function formatRole(role = "") {
  if (!role) return "Account";

  return role.charAt(0).toUpperCase() + role.slice(1);
}

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const { user, isLoading, isAuthenticated, logout } =
    useContext(AuthContext);

  const navigate = useNavigate();
  const accountRef = useRef(null);

  const isAdmin = user?.role === "admin";
  const isOrganizer = user?.role === "organizer";
  const accountName = user?.name || user?.email || "My Account";

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsAccountOpen(false);
  };

  // Close the account dropdown when clicking outside or pressing Escape.
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setIsAccountOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsAccountOpen(false);
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    closeMenu();

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const linkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "text-white"
        : "text-slate-400 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#111a2c]/95 text-white backdrop-blur-xl">
      <nav
        className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-16"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2"
          aria-label="Eventix home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8038f5] text-white shadow-lg shadow-purple-950/30">
            <TicketIcon />
          </span>

          <span className="text-xl font-bold tracking-tight">
            eventix<span className="text-[#9b6bff]">.</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navigationLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClasses}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-4 md:flex">
          {!isLoading &&
            (isAuthenticated ? (
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  onClick={() =>
                    setIsAccountOpen((open) => !open)
                  }
                  aria-expanded={isAccountOpen}
                  aria-haspopup="menu"
                  aria-controls="eventix-account-dropdown"
                  className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-purple-300/20 bg-purple-500/20 text-sm font-bold text-purple-200">
                    {getInitials(user?.name || user?.email)}
                  </span>

                  <span className="max-w-36 text-left">
                    <span className="block text-sm font-semibold text-white">
                      My Account
                    </span>
                    <span className="block truncate text-xs text-slate-400">
                      {formatRole(user?.role)}
                    </span>
                  </span>

                  <ChevronIcon open={isAccountOpen} />
                </button>

                {/* Account dropdown */}
                {isAccountOpen && (
                  <div
                    id="eventix-account-dropdown"
                    role="menu"
                    className="absolute right-0 top-full mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-2xl shadow-black/20"
                  >
                    {/* Signed-in user */}
                    <div className="border-b border-slate-100 px-5 py-4">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {accountName}
                      </p>

                      {user?.email && (
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {user.email}
                        </p>
                      )}

                      <p className="mt-2 text-xs font-medium text-emerald-600">
                        Signed in
                      </p>
                    </div>

                    {/* Profile */}
                    <Link
                      to="/profile"
                      role="menuitem"
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-5 py-3.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#8038f5]"
                    >
                      <AccountIcon />
                      My Profile
                    </Link>

                    {/* Admin dashboard */}
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        role="menuitem"
                        onClick={closeMenu}
                        className="flex items-center gap-3 border-t border-slate-100 px-5 py-3.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#8038f5]"
                      >
                        <DashboardIcon />
                        Admin Dashboard
                      </Link>
                    )}

                    {/* Organizer dashboard */}
                    {isOrganizer && (
                      <Link
                        to="/organizer"
                        role="menuitem"
                        onClick={closeMenu}
                        className="flex items-center gap-3 border-t border-slate-100 px-5 py-3.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#8038f5]"
                      >
                        <DashboardIcon />
                        Organizer Dashboard
                      </Link>
                    )}

                    {/* Sign out */}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 border-t border-slate-100 px-5 py-3.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogoutIcon />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                Log in
              </Link>
            ))}

          {!isLoading && !isAuthenticated && (
            <Link
              to="/register"
              className="rounded-xl bg-[#8038f5] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-950/20 transition-all duration-200 hover:bg-[#6f2be0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]"
            >
              Get Started
            </Link>
          )}

          {isAuthenticated && !isAdmin && (
            <Link
              to="/organizer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#8038f5] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-950/20 transition-all duration-200 hover:bg-[#6f2be0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]"
            >
              Host an Event
              <ArrowRightIcon />
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 text-slate-200 transition-colors hover:bg-white/5 md:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={
            isMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMenuOpen ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-white/[0.08] bg-[#111a2c] px-5 py-5 md:hidden"
        >
          <div className="mx-auto flex max-w-[1440px] flex-col gap-2">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/[0.08] text-white"
                      : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="mt-2 flex flex-col gap-2 border-t border-white/[0.08] pt-4">
              {!isLoading &&
                (isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-sm font-bold text-purple-200">
                        {getInitials(user?.name || user?.email)}
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {accountName}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Signed in · {formatRole(user?.role)}
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={closeMenu}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-white/[0.05] hover:text-white"
                    >
                      <AccountIcon />
                      My Profile
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={closeMenu}
                        className="flex items-center gap-3 rounded-lg bg-purple-500/15 px-3 py-3 text-sm font-semibold text-purple-200 hover:bg-purple-500/25"
                      >
                        <DashboardIcon />
                        Admin Dashboard
                      </Link>
                    )}

                    {isOrganizer && (
                      <Link
                        to="/organizer"
                        onClick={closeMenu}
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-white/[0.05] hover:text-white"
                      >
                        <DashboardIcon />
                        Organizer Dashboard
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-400 hover:bg-red-500/10"
                    >
                      <LogoutIcon />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="rounded-lg px-3 py-3 text-sm font-medium text-slate-300 hover:bg-white/[0.05] hover:text-white"
                    >
                      Log in
                    </Link>

                    <Link
                      to="/register"
                      onClick={closeMenu}
                      className="rounded-xl bg-[#8038f5] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#6f2be0]"
                    >
                      Get Started
                    </Link>
                  </>
                ))}

              {isAuthenticated && !isAdmin && (
                <Link
                  to="/organizer"
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8038f5] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6f2be0]"
                >
                  Host an Event
                  <ArrowRightIcon />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
