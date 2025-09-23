// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home, Inbox, Upload, Folder, Bell, Settings, LogOut,
  Users, UserPlus, Trash2, ChevronDown, ChevronRight
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [userMgmtOpen, setUserMgmtOpen] = useState(false);

  // 👤 Get logged in user (mock/local only)
  const user =
    JSON.parse(localStorage.getItem("userInfo")) ||
    JSON.parse(sessionStorage.getItem("userInfo")) || { email: "", role: "" };

  // 🛎 Mock notifications (refresh count every 2s)
  // 🔧 Replace with backend WebSocket/API later
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
        className={`fixed top-0 right-0 min-h-screen w-64 bg-blue-700 text-white z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"} md:static md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-500">
          <h1 className="text-lg font-bold">LibraryConnect</h1>
          <button onClick={toggleSidebar} className="md:hidden text-white">✕</button>
        </div>

        {/* User info */}
        <div className="px-4 pt-4">
          <div className="bg-white/10 p-3 rounded text-sm">
            <p className="font-semibold">{user.email}</p>
            <p className="text-blue-200 text-xs capitalize">{user.role}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {/* Dashboard */}
          <NavLink
            to={`/${adminRoles.includes(user.role) ? "admin" : "user"}-dashboard`}
            onClick={toggleSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-600 ${isActive ? "bg-blue-600" : ""}`
            }
          >
            <Home size={18} /> Dashboard
          </NavLink>

          {/* Collapsible: User Management (Admins only) */}
          {adminRoles.includes(user.role) && (
            <div>
              <button
                onClick={() => setUserMgmtOpen(!userMgmtOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-blue-600"
              >
                <span className="flex items-center gap-3">
                  <Users size={18} /> User Management
                </span>
                {userMgmtOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>

              {userMgmtOpen && (
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

          {/* Upload, Inbox, Folders, Notifications */}
          <NavLink to="/upload" onClick={toggleSidebar} className="flex items-center gap-3 px-3 py-2 hover:bg-blue-600 rounded">
            <Upload size={18} /> Upload Document
          </NavLink>
          <NavLink to="/inbox" onClick={toggleSidebar} className="flex items-center gap-3 px-3 py-2 hover:bg-blue-600 rounded">
            <Inbox size={18} /> Inbox
          </NavLink>
          <NavLink to="/folders" onClick={toggleSidebar} className="flex items-center gap-3 px-3 py-2 hover:bg-blue-600 rounded">
            <Folder size={18} /> Folders
          </NavLink>
          <NavLink to="/notifications" onClick={toggleSidebar} className="flex items-center gap-3 px-3 py-2 hover:bg-blue-600 rounded">
            <Bell size={18} />
            <span className="flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </span>
          </NavLink>

          {/* Settings + Trash (Admins only) */}
          <NavLink to="/settings" onClick={toggleSidebar} className="flex items-center gap-3 px-3 py-2 hover:bg-blue-600 rounded">
            <Settings size={18} /> Settings
          </NavLink>
          {adminRoles.includes(user.role) && (
            <NavLink to="/trash" onClick={toggleSidebar} className="flex items-center gap-3 px-3 py-2 hover:bg-blue-600 rounded">
              <Trash2 size={18} /> Trash
            </NavLink>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 hover:bg-red-600 mt-8 text-sm text-white rounded"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
