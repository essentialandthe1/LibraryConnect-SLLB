// src/layouts/UserLayout.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        role={user?.role}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        {/* Topbar with toggle button */}
        <Topbar toggleSidebar={() => setSidebarOpen(true)} />

        {/* Dashboard / page content */}
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
