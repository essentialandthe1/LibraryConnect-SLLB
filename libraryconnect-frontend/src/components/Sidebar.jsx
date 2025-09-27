// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home, Inbox, Upload, Folder, Bell, Settings, LogOut,
  Users, UserPlus, Trash2, ChevronDown, ChevronRight,
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar, collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [userMgmtOpen, setUserMgmtOpen] = useState(false);

  // 👤 Get logged in user
  const user =
    JSON.parse(localStorage.getItem("userInfo")) ||
    JSON.parse(sessionStorage.getItem("userInfo")) || { email: "", role: "" };

  // 🛎 Mock notifications
  useEffect(() => {
    const checkUnread = () => {
      const notifs = JSON.parse(localStorage.getItem("notifications")) || [];
      const unread = notifs.filter((n) => n.unread).length;
      setUnreadCount(unread);
    };
    checkUnread();
    const interval = setInterval(checkUnread, 2000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Admin roles
  const adminRoles = ["Admin/HR", "Chief Librarian", "Deputy Chief Librarian", "Principal Librarian"];

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-blue-700 text-white z-50 transform transition-all duration-300 flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        ${collapsed ? "w-20" : "w-64"} md:translate-x-0`}
      >
        {/* Header with collapse toggle */}
        <div className="flex items-center justify-between p-4 border-b border-blue-500">
          {!collapsed && <h1 className="text-lg font-bold">LibraryConnect</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white hover:text-gray-200 hidden md:block"
          >
            {collapsed ? "➡" : "⬅"}
          </button>
          <button onClick={toggleSidebar} className="md:hidden text-white">✕</button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* User info */}
          {!collapsed && (
            <div className="px-4 py-4 border-b border-blue-500">
              <div className="bg-white/10 p-3 rounded text-sm">
                <p className="font-semibold truncate">{user.email}</p>
                <p className="text-blue-200 text-xs capitalize">{user.role}</p>
              </div>
            </div>
          )}

          {/* Nav links */}
          <nav className="p-4 space-y-2">
            <NavLink
              to={`/${adminRoles.includes(user.role) ? "admin" : "user"}-dashboard`}
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-600 ${isActive ? "bg-blue-600" : ""}`
              }
            >
              <Home size={18} /> {!collapsed && "Dashboard"}
            </NavLink>

            {/* User Management */}
            {adminRoles.includes(user.role) && (
              <div>
                <button
                  onClick={() => setUserMgmtOpen(!userMgmtOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-blue-600"
                >
                  <span className="flex items-center gap-3">
                    <Users size={18} /> {!collapsed && "User Management"}
                  </span>
                  {!collapsed && (userMgmtOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                </button>

                {userMgmtOpen && !collapsed && (
                  <div className="ml-8 mt-1 space-y-1">
                    <NavLink to="/create-user" onClick={toggleSidebar} className="flex items-center gap-2 px-2 py-1 hover:bg-blue-600 rounded">
                      <UserPlus size={16} /> Create User
                    </NavLink>
                    <NavLink to="/manage-users" onClick={toggleSidebar} className="flex items-center gap-2 px-2 py-1 hover:bg-blue-600 rounded">
                      <Users size={16} /> Manage Users
                    </NavLink>
                  </div>
                )}
              </div>
            )}

            <NavLink to="/upload" onClick={toggleSidebar} className="flex items-center gap-3 px-3 py-2 hover:bg-blue-600 rounded">
              <Upload size={18} /> {!collapsed && "Upload Document"}
            </NavLink>
            <NavLink to="/inbox" onClick={toggleSidebar} className="flex items-center gap-3 px-3 py-2 hover:bg-blue-600 rounded">
              <Inbox size={18} /> {!collapsed && "Inbox"}
            </NavLink>
            <NavLink to="/folders" onClick={toggleSidebar} className="flex items-center gap-3 px-3 py-2 hover:bg-blue-600 rounded">
              <Folder size={18} /> {!collapsed && "Folders"}
            </NavLink>
            <NavLink to="/notifications" onClick={toggleSidebar} className="flex items-center gap-3 px-3 py-2 hover:bg-blue-600 rounded">
              <Bell size={18} />
              {!collapsed && (
                <span className="flex items-center gap-2">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </span>
              )}
            </NavLink>
            <NavLink to="/settings" onClick={toggleSidebar} className="flex items-center gap-3 px-3 py-2 hover:bg-blue-600 rounded">
              <Settings size={18} /> {!collapsed && "Settings"}
            </NavLink>
            {adminRoles.includes(user.role) && (
              <NavLink to="/trash" onClick={toggleSidebar} className="flex items-center gap-3 px-3 py-2 hover:bg-blue-600 rounded">
                <Trash2 size={18} /> {!collapsed && "Trash"}
              </NavLink>
            )}
          </nav>
        </div>

        {/* Logout stays at the bottom but scrolls with content */}
        <div className="p-4 border-t border-blue-500">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm hover:text-red-400"
          >
            <LogOut size={18} /> {!collapsed && "Logout"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
