
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth.js";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name || !email || !formData.password) {
      setError("Please complete all required fields.");
      return;
    }

    if (name.length < 2 || name.length > 100) {
      setError("Your name must contain between 2 and 100 characters.");
      return;
    }

    if (email.length > 254) {
      setError("Your email address is too long.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (
      new TextEncoder().encode(formData.password).length > 72
    ) {
      setError("Your password exceeds the maximum supported length.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const user = await register({
        name,
        email,
        password: formData.password,
      });

      if (user.role === "organizer") {
        navigate("/organizer/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(
        err.message || "Unable to create your account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        {/* Brand panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-indigo-950 p-12 text-white lg:flex">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"
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
              Join Eventix
            </span>

            <h1 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
              Make room for extraordinary experiences.
            </h1>

            <p className="mt-6 text-base leading-7 text-indigo-100/80">
              Create your account and discover a world of events,
              from live music and entertainment to sports and
              unforgettable gatherings.
            </p>
          </div>

          <p className="relative text-sm text-indigo-200/70">
            Discover. Connect. Experience.
          </p>
        </section>

        {/* Registration form */}
        <section className="px-6 py-10 sm:px-12 sm:py-12">
          <div className="mx-auto w-full max-w-md">
            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-indigo-950 lg:hidden"
            >
              eventix<span className="text-indigo-600">.</span>
            </Link>

            <div className="mt-7 lg:mt-2">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
                Get started
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Enter your details below to join Eventix.
              </p>
            </div>

            {error && (
              <div
                id="register-error"
                role="alert"
                className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-4"
              noValidate
            >
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={100}
                  aria-describedby={error ? "register-error" : undefined}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

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
                  aria-describedby={error ? "register-error" : undefined}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  aria-describedby={error ? "register-error" : undefined}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter your password again"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  aria-describedby={error ? "register-error" : undefined}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Creating your account..."
                  : "Create account"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 transition hover:text-indigo-700"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-7 text-center text-xs leading-5 text-slate-400">
              Your account information will be handled according
              to Eventix's privacy practices.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Register;
