// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home, Inbox, Upload, Folder, Bell, Settings, LogOut,
  Users, UserPlus, Trash2, ChevronDown, ChevronRight,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import clsx from "clsx";

const Sidebar = ({ isOpen, toggleSidebar, collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const [userMgmtOpen, setUserMgmtOpen] = useState(false);

  const user =
    JSON.parse(localStorage.getItem("userInfo")) ||
    JSON.parse(sessionStorage.getItem("userInfo")) || { email: "guest@sllb.sl", role: "Guest" };

  const adminRoles = ["Admin/HR", "Chief Librarian", "Deputy Chief Librarian", "Principal Librarian"];

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

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("userInfo");
    navigate("/");
  };

  const navItems = [
    { to: "/upload", icon: Upload, text: "Upload Document" },
    { to: "/inbox", icon: Inbox, text: "Inbox" },
    { to: "/folders", icon: Folder, text: "Folders" },
    { to: "/notifications", icon: Bell, text: "Notifications", badge: unreadCount },
    { to: "/settings", icon: Settings, text: "Settings" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={clsx(
          "fixed top-0 left-0 h-screen z-40 transform transition-all duration-300 flex flex-col",
          collapsed ? "w-20" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:z-30 shadow-md",
          "bg-sidebar text-sidebar-foreground dark:bg-gray-900 dark:text-gray-100"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border dark:border-gray-700">
          {!collapsed && <h1 className="text-lg font-bold text-foreground dark:text-gray-100">LibraryConnect</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-foreground dark:text-gray-100 hover:text-blue-500 transition-colors hidden md:block"
          >
            {collapsed ? "➡" : "⬅"}
          </button>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-foreground dark:text-gray-100 hover:text-blue-500 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {!collapsed && (
            <div className="px-4 py-4 border-b border-border dark:border-gray-700">
              <div className="bg-card dark:bg-gray-800 p-3 rounded text-sm shadow-sm transition-shadow hover:shadow-md">
                <p className="font-semibold truncate text-foreground dark:text-gray-100">{user.email}</p>
                <p className="text-muted-foreground dark:text-gray-400 text-xs capitalize">{user.role}</p>
              </div>
            </div>
          )}

          <nav className="p-4 space-y-2">
            <NavLink
              to={`/${adminRoles.includes(user.role) ? "admin" : "user"}-dashboard`}
              onClick={() => window.innerWidth < 768 && toggleSidebar()}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200",
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow dark:bg-blue-700 dark:text-blue-200"
                    : "hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-800 dark:hover:text-blue-200"
                )
              }
            >
              <Home size={18} /> {!collapsed && "Dashboard"}
            </NavLink>

            {/* Admin User Management */}
            {adminRoles.includes(user.role) && (
              <div>
                <button
                  onClick={() => setUserMgmtOpen(!userMgmtOpen)}
                  className={clsx(
                    "w-full flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200",
                    "hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-800 dark:hover:text-blue-200"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Users size={18} /> {!collapsed && "User Management"}
                  </span>
                  {!collapsed && (userMgmtOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                </button>

                {userMgmtOpen && !collapsed && (
                  <div className="ml-8 mt-1 space-y-1">
                    <NavLink
                      to="/create-user"
                      onClick={() => window.innerWidth < 768 && toggleSidebar()}
                      className="flex items-center gap-2 px-2 py-1 rounded transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-800 dark:hover:text-blue-200"
                    >
                      <UserPlus size={16} /> Create User
                    </NavLink>
                    <NavLink
                      to="/manage-users"
                      onClick={() => window.innerWidth < 768 && toggleSidebar()}
                      className="flex items-center gap-2 px-2 py-1 rounded transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-800 dark:hover:text-blue-200"
                    >
                      <Users size={16} /> Manage Users
                    </NavLink>
                  </div>
                )}
              </div>
            )}

            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => window.innerWidth < 768 && toggleSidebar()}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200",
                    isActive
                      ? "bg-blue-50 text-blue-600 shadow dark:bg-blue-700 dark:text-blue-200"
                      : "hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-800 dark:hover:text-blue-200"
                  )
                }
              >
                <item.icon size={18} />
                {!collapsed && (
                  <span className="flex items-center gap-2">
                    {item.text}
                    {item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{item.badge}</span>
                    )}
                  </span>
                )}
              </NavLink>
            ))}

            {adminRoles.includes(user.role) && (
              <NavLink
                to="/trash"
                onClick={() => window.innerWidth < 768 && toggleSidebar()}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200",
                    isActive
                      ? "bg-blue-50 text-blue-600 shadow dark:bg-blue-700 dark:text-blue-200"
                      : "hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-800 dark:hover:text-blue-200"
                  )
                }
              >
                <Trash2 size={18} /> {!collapsed && "Trash"}
              </NavLink>
            )}
          </nav>
        </div>

        <div className="p-4 border-t border-border dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-destructive hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <LogOut size={18} /> {!collapsed && "Logout"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
