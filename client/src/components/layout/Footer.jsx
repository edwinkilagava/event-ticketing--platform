
import { Link } from "react-router";

const footerLinks = {
  Explore: [
    { label: "Discover Events", to: "/events" },
    { label: "Categories", to: "/categories" },
    { label: "Popular Events", to: "/events" },
  ],
  Account: [
    { label: "Sign In", to: "/login" },
    { label: "Create Account", to: "/register" },
    { label: "My Tickets", to: "/tickets" },
  ],
  Organizers: [
    { label: "Host an Event", to: "/organizer" },
    { label: "Organizer Dashboard", to: "/organizer/dashboard" },
  ],
};

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#080f20]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-white"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-lg font-extrabold">
                E
              </span>
              Eventix
            </Link>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              Discover unforgettable experiences. Find events you love,
              book your tickets, and make every moment count.
            </p>

            <p className="mt-5 text-xs font-medium uppercase tracking-[0.2em] text-violet-400">
              Your next experience starts here.
            </p>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h2 className="text-sm font-semibold text-white">
                {heading}
              </h2>

              <ul className="mt-5 space-y-4">
                {links.map((link) => (
                  <li key={`${link.label}-${link.to}`}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-400 transition-colors duration-200 hover:text-violet-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Eventix. All rights reserved.
          </p>

          <p>Made for experiences worth remembering.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
