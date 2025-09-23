import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isSameOrAfter);

const Notifications = () => {
  const currentUser =
    JSON.parse(localStorage.getItem("userInfo")) || { role: "", email: "" };

  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("notifications")) || [];

    // 👉 show only notifications for this user
    const userNotifs = stored.filter(
      (n) =>
        !n.recipient ||
        n.recipient.toLowerCase() === currentUser.role.toLowerCase() ||
        n.recipient.toLowerCase() === currentUser.email.toLowerCase()
    );

    setNotifications(userNotifs);
  }, [currentUser]);

  // ✅ Mark as read
  const markAsRead = (index) => {
    const updated = [...notifications];
    updated[index].unread = false;
    setNotifications(updated);

    // sync back to global storage
    const stored = JSON.parse(localStorage.getItem("notifications")) || [];
    const globalIndex = stored.findIndex(
      (n) => n.id === notifications[index].id
    );
    if (globalIndex !== -1) {
      stored[globalIndex].unread = false;
      localStorage.setItem("notifications", JSON.stringify(stored));
    }
  };

  // ✅ Approve/Reject trash requests
  const handleAction = (notif, approve) => {
    let trashedDocs =
      JSON.parse(localStorage.getItem("trashedDocuments")) || [];

    if (approve) {
      // allow permanent delete
      trashedDocs = trashedDocs.map((doc) =>
        doc.id === notif.docId ? { ...doc, pendingApproval: false } : doc
      );
      alert(`✅ You approved deletion of "${notif.title}"`);
    } else {
      // restore the document instead
      const doc = trashedDocs.find((d) => d.id === notif.docId);
      if (doc) {
        const uploadedDocs =
          JSON.parse(localStorage.getItem("uploadedDocuments")) || [];
        uploadedDocs.push(doc);
        localStorage.setItem(
          "uploadedDocuments",
          JSON.stringify(uploadedDocs)
        );
        trashedDocs = trashedDocs.filter((d) => d.id !== notif.docId);
      }
      alert(`❌ You rejected deletion. Document restored.`);
    }

    localStorage.setItem("trashedDocuments", JSON.stringify(trashedDocs));

    // remove this notification
    const updatedNotifs = notifications.filter((n) => n.id !== notif.id);
    setNotifications(updatedNotifs);

    const global = JSON.parse(localStorage.getItem("notifications")) || [];
    localStorage.setItem(
      "notifications",
      JSON.stringify(global.filter((n) => n.id !== notif.id))
    );
  };

  // 🔎 Filtering
  const filtered = notifications.filter((n) => {
    const matchesText =
      (n.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (n.sender || "").toLowerCase().includes(search.toLowerCase());

    const timestamp = dayjs(n.timestamp);
    const matchesDate =
      filter === "all" ||
      (filter === "today" && timestamp.isToday()) ||
      (filter === "week" &&
        timestamp.isSameOrAfter(dayjs().subtract(7, "day")));

    return matchesText && matchesDate;
  });

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow max-w-4xl mx-auto">
      {/* Header + filters */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          🔔 Notifications
        </h2>

        <div className="flex gap-2 items-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 rounded border text-sm dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
          </select>

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search title/sender"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border rounded text-sm w-64 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Notifications list */}
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No notifications found.
        </p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((n, i) => (
            <li
              key={n.id}
              className={`flex justify-between items-start border-b pb-3 p-2 rounded ${
                n.unread ? "bg-blue-50 dark:bg-blue-900/30" : ""
              }`}
            >
              <div>
                <p className="font-medium text-gray-800 dark:text-white">
                  {n.title || "Untitled Notification"}
                </p>
                {n.sender && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {n.sender}
                  </p>
                )}

                {/* If action is approve-delete → show buttons */}
                {n.action === "approve-delete" && (
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => handleAction(n, true)}
                      className="px-2 py-1 text-xs bg-green-600 text-white rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(n, false)}
                      className="px-2 py-1 text-xs bg-red-600 text-white rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
              <span
                className="text-xs text-gray-400 dark:text-gray-500 cursor-pointer"
                onClick={() => markAsRead(i)}
              >
                {n.timestamp ? dayjs(n.timestamp).fromNow() : "Unknown time"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
