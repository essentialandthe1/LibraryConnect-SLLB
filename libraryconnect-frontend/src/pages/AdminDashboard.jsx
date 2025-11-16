// src/pages/AdminDashboard.jsx
// ------------------------------------------------------
// 📊 ADMIN DASHBOARD
// Reusable components: Card, Table, SectionWithSearch
// ------------------------------------------------------

import React, { useState } from "react";
import { Users, FileText, FolderPlus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

// ✅ Import reusable Table component
import { Table } from "../components/ui/table.jsx";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Local UI state
  const [userSearch, setUserSearch] = useState("");
  const [logSearch, setLogSearch] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userPageSize, setUserPageSize] = useState(5);

  // 🔹 Fetch users
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => (await api.get("/users")).data,
  });

  // 🔹 Fetch documents
  const { data: documents = [], isLoading: docsLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => (await api.get("/documents")).data,
  });

  // 🔹 Fetch logs
  const { data: auditLogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ["auditLogs"],
    queryFn: async () => (await api.get("/audit-logs")).data,
  });

  // 📊 Example Analytics
  const analytics = [
    { month: "Jan", uploads: 12 },
    { month: "Feb", uploads: 18 },
    { month: "Mar", uploads: 9 },
  ];

  // 🔍 Filters
  const filteredUsers = users.filter((u) =>
    [u.name, u.email, u.role].some((val) =>
      val?.toLowerCase().includes(userSearch.toLowerCase())
    )
  );

  const filteredLogs = auditLogs.filter((l) =>
    [l.user, l.action, l.target].some((val) =>
      val?.toLowerCase().includes(logSearch.toLowerCase())
    )
  );

  // 🧭 Pagination
  const paginate = (data, page, size) =>
    size === "all" ? data : data.slice((page - 1) * size, page * size);

  const totalPages = (data, size) =>
    size === "all" ? 1 : Math.ceil(data.length / size);

  const paginatedUsers = paginate(filteredUsers, userPage, userPageSize);

  // 📦 Export Logs
  const exportLogs = () => {
    const csv = [
      ["User", "Action", "Target", "Date"],
      ...auditLogs.map((l) => [l.user, l.action, l.target, l.date]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "audit_logs.csv";
    link.click();
  };

  if (usersLoading || docsLoading || logsLoading)
    return <div className="text-center py-10 text-gray-700 dark:text-gray-200">Loading dashboard data...</div>;

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Welcome Back, Admin 👋</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title="Total Users" value={users.length} icon={<Users />} color="blue" />
        <Card title="Documents" value={documents.length} icon={<FileText />} color="green" />
        <Card title="Audit Logs" value={auditLogs.length} icon={<FolderPlus />} color="yellow" />
      </div>

      {/* Upload Analytics */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">📊 Uploads Analytics</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={analytics}>
            <XAxis dataKey="month" stroke="#4B5563" />
            <YAxis stroke="#4B5563" />
            <Tooltip />
            <Bar dataKey="uploads" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Manage Users */}
      <SectionWithSearch
        title="👥 Manage Users"
        searchValue={userSearch}
        onSearch={setUserSearch}
        placeholder="Search users..."
        buttonLabel="Add User"
        onButtonClick={() => navigate("/create-user")}
        columns={["Name", "Email", "Role"]}
        data={paginatedUsers.map((u) => [u.name, u.email, u.role])}
        paginationProps={{
          currentPage: userPage,
          totalPages: totalPages(filteredUsers, userPageSize),
          pageSize: userPageSize,
          totalItems: filteredUsers.length,
          onPageChange: setUserPage,
          onPageSizeChange: setUserPageSize,
        }}
      />

      {/* Logs */}
      <SectionWithSearch
        title="📜 Recent Activity"
        searchValue={logSearch}
        onSearch={setLogSearch}
        placeholder="Search logs..."
        buttonLabel="Export CSV"
        onButtonClick={exportLogs}
        columns={["User", "Action", "Target", "Date"]}
        data={filteredLogs.map((l) => [l.user, l.action, l.target, l.date])}
      />
    </div>
  );
};

// 🔧 Reusable Components

const SectionWithSearch = ({
  title,
  searchValue,
  onSearch,
  placeholder,
  buttonLabel,
  onButtonClick,
  columns,
  data,
  paginationProps,
}) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
    <div className="flex justify-between items-center mb-3">
      <h3 className="font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
      {buttonLabel && (
        <button
          onClick={onButtonClick}
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
        >
          {buttonLabel}
        </button>
      )}
    </div>

    <div className="relative w-64 mb-3">
      <Search size={16} className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-300" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-9 pr-3 py-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
    </div>

    <Table columns={columns} data={data} />

    {paginationProps && <PaginationControls {...paginationProps} />}
  </div>
);

const PaginationControls = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => (
  <div className="flex justify-between items-center mt-3 text-sm text-gray-700 dark:text-gray-200">
    <span>
      Page {currentPage} of {totalPages} ({totalItems} total)
    </span>
    <div className="flex gap-3 items-center">
      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
        className="border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </select>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
);

const Card = ({ title, value, icon, color }) => (
  <div className={`p-4 rounded-md shadow bg-${color}-100 dark:bg-${color}-600 text-${color}-800 dark:text-white transition`}>
    <div className="flex justify-between items-center">
      <p className="font-semibold">{title}</p>
      {icon}
    </div>
    <h3 className="text-xl font-bold mt-2">{value}</h3>
  </div>
);

export default AdminDashboard;
