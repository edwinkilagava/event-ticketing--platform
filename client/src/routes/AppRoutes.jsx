import { Navigate, Route, Routes } from "react-router";

import HomePage from "../pages/home/HomePage.jsx";
import Login from "../pages/auth/login.jsx";
import Register from "../pages/auth/register.jsx";
import PublicCategoriesPage from "../pages/categories/CategoriesPage.jsx";
import PublicEventsPage from "../pages/events/EventsPage.jsx";

import AdminLayout from "../components/layout/AdminLayout.jsx";

import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import UsersPage from "../pages/admin/UsersPage.jsx";
import OrganizersPage from "../pages/admin/OrganizersPage.jsx";
import EventsPage from "../pages/admin/EventsPage.jsx";
import CategoriesPage from "../pages/admin/CategoriesPage.jsx";
import BookingsPage from "../pages/admin/BookingsPage.jsx";
import PaymentsPage from "../pages/admin/PaymentsPage.jsx";
import ReportsPage from "../pages/admin/ReportsPage.jsx";
import SettingsPage from "../pages/admin/SettingsPage.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
import RoleRoute from "./RoleRoute.jsx";

function AppRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/categories"
        element={<PublicCategoriesPage />}
      />

      <Route
        path="/events"
        element={<PublicEventsPage />}
      />

      {/* Authenticated administrator pages */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route
              index
              element={<Navigate to="dashboard" replace />}
            />

            <Route
              path="dashboard"
              element={<AdminDashboard />}
            />

            <Route path="users" element={<UsersPage />} />
            <Route path="organizers" element={<OrganizersPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Organizer routes will be added when ready. */}
        <Route element={<RoleRoute allowedRoles={["organizer"]} />}>
          {/* Organizer dashboard routes will go here. */}
        </Route>
      </Route>

      {/* Unknown URLs redirect to the homepage. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;