/**
 * Notifications Page
 * ------------------------------------------------------
 * Displays user notifications (admin + regular user).
 * ✅ Works fully on the frontend using localStorage for now.
 * 🧠 Future backend integration points are commented with:
 *     // 🔧 Backend: ...
 * ------------------------------------------------------
 * Features:
 * - Search, filter (All / Unread / Today)
 * - Mark one or all as read
 * - Delete one or all (admin only)
 * - Auto-expiry (7 days old)
 */

import React, { useEffect, useState, useMemo } from "react";
import { Search, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";

dayjs.extend(relativeTime);
dayjs.extend(isToday);

const EXPIRY_DAYS = 7;

const Notifications = () => {
  // ✅ Memoize user info to avoid unnecessary re-renders
  const currentUser = useMemo(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || { role: "", email: "" };
  }, []);

  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showConfirm, setShowConfirm] = useState(false);

  // ======================================================
  // 🔧 Backend integration (later)
  // Replace localStorage with an API call like:
  //   GET /api/notifications?user=<id or email>
  // ======================================================

  const getUserKey = () => {
    const key = currentUser.email || currentUser.role || "guest";
    return `notifications_${key.toLowerCase()}`;
  };

  // ✅ Load notifications (simulate backend fetch)
  useEffect(() => {
    const loadNotifications = () => {
      const userKey = getUserKey();
      let stored = JSON.parse(localStorage.getItem(userKey)) || [];

      // Auto-remove expired notifications
      const now = dayjs();
      stored = stored.filter(
        (n) => !n.timestamp || now.diff(dayjs(n.timestamp), "day") < EXPIRY_DAYS
      );

      // Save back cleaned notifications
      localStorage.setItem(userKey, JSON.stringify(stored));
      setNotifications(stored);
    };

    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // currentUser is memoized and stable

  const saveNotifications = (updated) => {
    const userKey = getUserKey();
    localStorage.setItem(userKey, JSON.stringify(updated));
    setNotifications(updated);
  };

  // ======================================================
  // 🔧 Backend endpoints (future)
  // PATCH /api/notifications/:id  -> mark read
  // DELETE /api/notifications/:id -> delete single
  // DELETE /api/notifications     -> delete all
  // ======================================================

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const markOneAsRead = (id) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifications(updated);
  };

  const deleteAllNotifications = () => {
    const userKey = getUserKey();
    localStorage.removeItem(userKey);
    setNotifications([]);
    setShowConfirm(false);
  };

  // ======================================================
  // 🔧 Backend: Filtering will later be handled server-side
  // e.g. GET /api/notifications?filter=unread&search=query
  // ======================================================

  const filteredNotifications = notifications
    .filter((n) =>
      (n.message || "").toLowerCase().includes(search.toLowerCase())
    )
    .filter((n) => {
      if (filter === "unread") return !n.read;
      if (filter === "today") return dayjs(n.timestamp).isToday();
      return true;
    })
    .sort((a, b) => dayjs(b.timestamp).diff(dayjs(a.timestamp)));

  // ======================================================
  // 🔧 Backend (Admin only)
  // POST /api/notifications { recipient, message, type }
  // ======================================================

  return (
    <div className="p-6">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>

        <div className="flex gap-2">
          {notifications.some((n) => !n.read) && (
            <button
              onClick={markAllAsRead}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Mark all as read
            </button>
          )}
          {currentUser.role?.toLowerCase() === "admin" && (
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Delete all
            </button>
          )}
        </div>
      </div>

      {/* ===== SEARCH + FILTER ===== */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="all">All</option>
          <option value="unread">Unread</option>
          <option value="today">Today</option>
        </select>
      </div>

      {/* ===== NOTIFICATIONS LIST ===== */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-lg shadow-sm border flex justify-between items-start ${
                n.read ? "bg-white" : "bg-blue-50"
              }`}
            >
              <div>
                <p className="text-gray-800">{n.message}</p>
                <div className="text-xs text-gray-500 mt-1">
                  {n.recipient ? `To: ${n.recipient}` : "To: All"}
                </div>
                <span className="text-sm text-gray-500">
                  {dayjs(n.timestamp).fromNow()}
                </span>
              </div>

              <div className="flex gap-2 ml-4">
                {!n.read && (
                  <button
                    onClick={() => markOneAsRead(n.id)}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Mark as read
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(n.id)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 flex items-center"
                >
                  <Trash2 size={14} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No notifications found.</p>
        )}
      </div>

      {/* ===== CONFIRM DELETE MODAL ===== */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h2 className="text-lg font-semibold mb-4">
              Delete all notifications?
            </h2>
            <p className="text-gray-600 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={deleteAllNotifications}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
