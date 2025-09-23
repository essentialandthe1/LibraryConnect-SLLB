// src/components/Topbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Bell, LogOut, Settings } from "lucide-react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Topbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  // 📨 Mock notifications (replace with backend API later)
  const notifications = [
    { id: 1, message: "New document from HQ" },
    { id: 2, message: "Finance report uploaded" },
    { id: 3, message: "Bo Region submitted memo" },
  ];

  // 👤 Get logged in user (local/sessionStorage only)
  // 🔧 When backend is ready → fetch this from Django API
  const user =
    JSON.parse(localStorage.getItem("userInfo")) ||
    JSON.parse(sessionStorage.getItem("userInfo")) || {
      email: "guest@sllb.sl",
      role: "Guest",
    };

  // 🚪 Handle logout
  // Currently clears browser storage only
  // 🔧 When backend is ready → also call logout API endpoint
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("userInfo");
    navigate("/");
  };

  // 👇 Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 px-4 py-3 shadow-sm flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="SLLB Logo" className="w-6 h-6 md:w-8 md:h-8" />
        <span className="font-bold text-blue-600 dark:text-blue-300 text-base md:text-lg">
          SLLB
        </span>
      </div>

      {/* Right side */}
      <div className="relative flex items-center gap-6 pr-2">
        {/* 🔔 Notifications (mock) */}
        <div className="relative hidden md:block" ref={notificationsRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-gray-600 dark:text-gray-300 hover:text-blue-600"
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              {notifications.length}
            </span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-700 rounded-md shadow-lg z-50 p-2 text-sm transition-all duration-200 ease-out transform origin-top">
              {notifications.map((note) => (
                <div
                  key={note.id}
                  className="py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                >
                  {note.message}
                </div>
              ))}
              <div className="mt-2 text-center text-xs text-gray-400">View All</div>
            </div>
          )}
        </div>

        {/* 👤 Profile dropdown */}
        <div className="relative hidden md:block" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:ring-2 hover:ring-blue-500"
          >
            {user.email ? user.email.charAt(0).toUpperCase() : "U"}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 rounded-md shadow-lg z-50 p-2 text-sm transition-all duration-200 ease-out transform origin-top">
              <div className="px-2 py-2 border-b dark:border-gray-600">
                <p className="font-medium">{user.email}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>

              <button
                onClick={() => navigate("/settings")}
                className="w-full flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
              >
                <Settings size={16} /> Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-2 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-gray-600 rounded"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>

        {/* ☰ Mobile sidebar toggle */}
        <button
          onClick={toggleSidebar}
          className="inline-block md:hidden text-gray-700 dark:text-gray-300"
        >
          ☰
        </button>
      </div>
    </div>
  );
};

export default Topbar;
