// src/layouts/UserLayout.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white transition-all duration-300
          ${collapsed ? "md:ml-20" : "md:ml-64"}`}
      >
        <Topbar
          toggleSidebar={toggleSidebar}
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

export default UserLayout;
