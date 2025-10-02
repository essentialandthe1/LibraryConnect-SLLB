import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isSameOrAfter);

const Notifications = () => {
  const location = useLocation();
  const currentUser =
    JSON.parse(localStorage.getItem("userInfo")) || { role: "", email: "" };

  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const loadNotifications = () => {
      const stored = JSON.parse(localStorage.getItem("notifications")) || [];

      const userNotifs = stored.filter(
        (n) =>
          !n.recipient ||
          n.recipient.toLowerCase() === currentUser.role.toLowerCase() ||
          n.recipient.toLowerCase() === currentUser.email.toLowerCase()
      );

      setNotifications(userNotifs);
    };

    loadNotifications();
    window.addEventListener("storage", loadNotifications);

    return () => window.removeEventListener("storage", loadNotifications);
  }, [currentUser, location]);

  // ✅ Mark all as read
  const markAllAsRead = () => {
    const stored = JSON.parse(localStorage.getItem("notifications")) || [];

    const updated = stored.map((n) =>
      !n.recipient ||
      n.recipient.toLowerCase() === currentUser.role.toLowerCase() ||
      n.recipient.toLowerCase() === currentUser.email.toLowerCase()
        ? { ...n, read: true }
        : n
    );

    localStorage.setItem("notifications", JSON.stringify(updated));
    setNotifications(
      updated.filter(
        (n) =>
          !n.recipient ||
          n.recipient.toLowerCase() === currentUser.role.toLowerCase() ||
          n.recipient.toLowerCase() === currentUser.email.toLowerCase()
      )
    );
  };

  // ✅ Mark single notification as read
  const markOneAsRead = (id) => {
    const stored = JSON.parse(localStorage.getItem("notifications")) || [];

    const updated = stored.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );

    localStorage.setItem("notifications", JSON.stringify(updated));
    setNotifications(
      updated.filter(
        (n) =>
          !n.recipient ||
          n.recipient.toLowerCase() === currentUser.role.toLowerCase() ||
          n.recipient.toLowerCase() === currentUser.email.toLowerCase()
      )
    );
  };

  const filteredNotifications = notifications
    .filter((n) =>
      n.message.toLowerCase().includes(search.toLowerCase())
    )
    .filter((n) => {
      if (filter === "unread") return !n.read;
      if (filter === "today") return dayjs(n.timestamp).isToday();
      return true;
    })
    .sort((a, b) => dayjs(b.timestamp).diff(dayjs(a.timestamp)));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllAsRead}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Search + Filter */}
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

      {/* Notifications List */}
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

              {!n.read && (
                <button
                  onClick={() => markOneAsRead(n.id)}
                  className="ml-4 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No notifications found.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
