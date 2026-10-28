
import { useState } from "react";
import { Outlet } from "react-router";
import AdminSidebar from "./AdminSidebar.jsx";
import AdminHeader from "./AdminHeader.jsx";

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-72">
        <AdminHeader
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
