import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile
  const [collapsed, setCollapsed] = useState(false); // 👈 shared collapsed state
  const user = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        role={user?.role}
      />

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white transition-all duration-300 ${
          collapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <Topbar
          toggleSidebar={() => setSidebarOpen(true)}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;