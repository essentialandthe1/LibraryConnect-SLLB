
import React from "react";
import { Inbox, Send, Bell, Upload, FileText, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const cards = [
  {
    title: "Inbox",
    icon: <Inbox size={22} />,
    value: 12,
    color: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  {
    title: "Outbox",
    icon: <Send size={22} />,
    value: 9,
    color: "bg-green-50 text-green-700 border border-green-200",
  },
  {
    title: "Notifications",
    icon: <Bell size={22} />,
    value: 3,
    color: "bg-red-50 text-red-700 border border-red-200",
  },
];

const uploads = [
  { file: "Q1 Report 2025.pdf", date: "May 15, 2025", by: "Bo Librarian" },
  { file: "Inventory.csv", date: "May 14, 2025", by: "Finance Team" },
];

const activities = [
  {
    text: "You received **monthly report.pdf** from Regional Librarian – East",
    time: "Today 12:00 PM",
  },
  {
    text: "New document **Annual Budget** from Head of Adult Lending",
    time: "Yesterday 2:40 PM",
  },
  {
    text: "You sent **Training Schedule.docx** to District Librarian",
    time: "Monday 10:20 AM",
  },
];

const UserDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back 👋</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Regional Librarian – East
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`p-5 rounded-xl shadow-sm hover:shadow-md transition ${card.color} flex items-center justify-between`}
          >
            <div>
              <p className="text-sm font-medium">{card.title}</p>
              <h4 className="text-2xl font-bold">{card.value}</h4>
            </div>
            <div className="p-2 bg-white rounded-lg shadow">{card.icon}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            ⚡ Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/upload")}
              className="flex items-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Upload size={18} /> Upload Document
            </button>
            <button
              onClick={() => navigate("/view-document")}
              className="flex items-center gap-2 w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <FileText size={18} /> View Recent Files
            </button>
            <button
              onClick={() => navigate("/notifications")}
              className="flex items-center gap-2 w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <Bell size={18} /> See Notifications
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            <Clock size={18} /> Recent Activity
          </h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
            {activities.map((act, i) => (
              <li key={i} className="border-b pb-2 last:border-none">
                <span dangerouslySetInnerHTML={{ __html: act.text }} />
                <br />
                <span className="text-xs text-gray-500">{act.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Uploads */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          📂 Recent Uploads
        </h3>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          {uploads.map((upload, i) => (
            <li key={i} className="py-2 flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                📄 <b>{upload.file}</b> – {upload.by}
              </span>
              <span className="text-xs text-gray-500">{upload.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserDashboard;
