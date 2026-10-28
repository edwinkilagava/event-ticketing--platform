
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth.js";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const email = formData.email.trim();

    if (!email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const user = await login({
        email,
        password: formData.password,
      });

      if (!user || typeof user.role !== "string") {
        throw new Error(
          "Login succeeded, but the user information is incomplete. Please check your authentication service."
        );
      }

      const requestedPath = location.state?.from;

      const safePath =
        typeof requestedPath === "string" &&
        requestedPath.startsWith("/") &&
        !requestedPath.startsWith("//")
          ? requestedPath
          : requestedPath?.pathname?.startsWith("/") &&
              !requestedPath.pathname.startsWith("//")
            ? requestedPath.pathname
            : null;

      if (safePath) {
        navigate(safePath, { replace: true });
        return;
      }

      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "organizer") {
        navigate("/organizer/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(
        err.message || "Unable to sign in. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        {/* Brand panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-indigo-950 p-12 text-white lg:flex">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative">
            <Link
              to="/"
              className="text-2xl font-bold tracking-tight"
            >
              eventix<span className="text-indigo-400">.</span>
            </Link>

            <p className="mt-2 text-sm text-indigo-200">
              Your events. Your moments.
            </p>
          </div>

          <div className="relative max-w-md">
            <span className="mb-5 inline-flex rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">
              Welcome back
            </span>

            <h1 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
              Great events start with you.
            </h1>

            <p className="mt-6 text-base leading-7 text-indigo-100/80">
              Sign in to manage your events, connect with your
              audience, and bring unforgettable experiences to
              life.
            </p>
          </div>

          <p className="relative text-sm text-indigo-200/70">
            Discover. Connect. Experience.
          </p>
        </section>

        {/* Login form */}
        <section className="px-6 py-10 sm:px-12 sm:py-14">
          <div className="mx-auto w-full max-w-md">
            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-indigo-950 lg:hidden"
            >
              eventix<span className="text-indigo-600">.</span>
            </Link>

            <div className="mt-8 lg:mt-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
                Your account
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                Sign in
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Enter your details to access your Eventix account.
              </p>
            </div>

            {error && (
              <div
                id="login-error"
                role="alert"
                className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
              noValidate
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  maxLength={254}
                  aria-invalid={Boolean(error)}
                  aria-describedby={
                    error ? "login-error" : undefined
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>
                </div>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  aria-invalid={Boolean(error)}
                  aria-describedby={
                    error ? "login-error" : undefined
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Signing you in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              New to Eventix?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 transition hover:text-indigo-700"
              >
                Create an account
              </Link>
            </p>

            <p className="mt-10 text-center text-xs leading-5 text-slate-400">
              By continuing, you agree to use your Eventix account
              responsibly.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
