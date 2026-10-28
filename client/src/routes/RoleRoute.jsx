
import { Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth.js";

function RoleRoute({ allowedRoles }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm text-gray-600">
          Loading your account...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RoleRoute;
