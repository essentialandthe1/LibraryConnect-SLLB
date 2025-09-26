// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Users,
  FileText,
  FolderPlus,
  Plus,
  CheckCircle,
  XCircle,
  Download,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // =============================
  // 📌 State variables
  // =============================
  const [users, setUsers] = useState([]);
  const [folders, setFolders] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [documents, setDocuments] = useState([]);

  // 🔍 Search states
  const [userSearch, setUserSearch] = useState("");
  const [docSearch, setDocSearch] = useState("");
  const [logSearch, setLogSearch] = useState("");

  // 📄 Pagination states
  const [userPage, setUserPage] = useState(1);
  const [userPageSize, setUserPageSize] = useState(5);

  const [docPage, setDocPage] = useState(1);
  const [docPageSize, setDocPageSize] = useState(5);

  const [logPage, setLogPage] = useState(1);
  const [logPageSize, setLogPageSize] = useState(5);

  // =============================
  // 📌 Mock data (replace with API calls later)
  // =============================
  useEffect(() => {
    setUsers([
      { id: 1, name: "Mattia", email: "mattia@sllb.gov.sl", role: "Admin" },
      { id: 2, name: "Fatmata K.", email: "fatmata@hq.sllb.sl", role: "Chief Librarian" },
      { id: 3, name: "Andrew", email: "andrew@bo.sllb.sl", role: "Regional Librarian" },
      { id: 4, name: "Mariama", email: "mariama@kenema.sllb.sl", role: "User" },
      { id: 5, name: "Joseph", email: "joseph@makeni.sllb.sl", role: "User" },
      { id: 6, name: "Isatu", email: "isatu@kono.sllb.sl", role: "User" },
      { id: 7, name: "Patrick", email: "patrick@freetown.sllb.sl", role: "Staff" },
    ]);

    setDocuments([
      { id: 1, file: "Budget Report", type: "Finance", folder: "Finance", date: "2025-01-10" },
      { id: 2, file: "Staff Policy", type: "HR", folder: "HR Documents", date: "2025-02-02" },
      { id: 3, file: "Library Rules", type: "General", folder: "Personal", date: "2025-03-01" },
      { id: 4, file: "Strategic Plan", type: "Admin", folder: "HQ", date: "2025-03-10" },
      { id: 5, file: "Annual Report", type: "Finance", folder: "Finance", date: "2025-03-15" },
      { id: 6, file: "Training Notes", type: "HR", folder: "Staff Docs", date: "2025-03-20" },
    ]);

    setFolders([{ id: 1 }, { id: 2 }, { id: 3 }]);
    setApprovals([{ id: 1, type: "Trash Request", doc: "Finance Report" }]);

    setAuditLogs([
      { id: 1, user: "Mattia", action: "Uploaded", target: "Policy.pdf", date: "Today" },
      { id: 2, user: "Fatmata", action: "Viewed", target: "Finance.xlsx", date: "Yesterday" },
      { id: 3, user: "Andrew", action: "Deleted", target: "Old_Report.docx", date: "Last Week" },
      { id: 4, user: "Mariama", action: "Uploaded", target: "Minutes.pdf", date: "2025-02-01" },
      { id: 5, user: "Joseph", action: "Downloaded", target: "Rules.pdf", date: "2025-01-20" },
      { id: 6, user: "Patrick", action: "Edited", target: "Annual Plan.docx", date: "2025-01-15" },
    ]);
  }, []);

  // =============================
  // 📊 Analytics mock data
  // =============================
  const analytics = [
    { month: "Jan", uploads: 12 },
    { month: "Feb", uploads: 18 },
    { month: "Mar", uploads: 9 },
  ];

  // =============================
  // 📤 Export audit logs as CSV
  // =============================
  const exportLogs = () => {
    const headers = ["User", "Action", "Target", "Date"];
    const rows = auditLogs.map((l) => [l.user, l.action, l.target, l.date]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "audit_logs.csv";
    a.click();
  };

  // =============================
  // 🔍 Filters (search functionality)
  // =============================
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );
  const filteredDocs = documents.filter(
    (d) =>
      d.file.toLowerCase().includes(docSearch.toLowerCase()) ||
      d.type.toLowerCase().includes(docSearch.toLowerCase()) ||
      d.folder.toLowerCase().includes(docSearch.toLowerCase())
  );
  const filteredLogs = auditLogs.filter(
    (l) =>
      l.user.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.target.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.date.toLowerCase().includes(logSearch.toLowerCase())
  );

  // =============================
  // 📄 Pagination logic
  // =============================
  const paginate = (data, page, pageSize) =>
    pageSize === "all" ? data : data.slice((page - 1) * pageSize, page * pageSize);

  const calcRange = (data, page, pageSize) => {
    if (pageSize === "all") return [1, data.length];
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, data.length);
    return [start, end];
  };

  const totalPages = (data, pageSize) =>
    pageSize === "all" ? 1 : Math.ceil(data.length / pageSize);

  const [userStart, userEnd] = calcRange(filteredUsers, userPage, userPageSize);
  const [docStart, docEnd] = calcRange(filteredDocs, docPage, docPageSize);
  const [logStart, logEnd] = calcRange(filteredLogs, logPage, logPageSize);

  const paginatedUsers = paginate(filteredUsers, userPage, userPageSize);
  const paginatedDocs = paginate(filteredDocs, docPage, docPageSize);
  const paginatedLogs = paginate(filteredLogs, logPage, logPageSize);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome Back, Admin 👋</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title="Total Users" value={users.length} icon={<Users />} color="blue" />
        <Card title="Folders" value={folders.length} icon={<FolderPlus />} color="yellow" />
        <Card title="Documents" value={documents.length} icon={<FileText />} color="green" />
      </div>

      {/* Analytics */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-3">📊 Uploads Analytics</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={analytics}>
            <XAxis dataKey="month" />
            <YAxis />
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
          startIdx: userStart,
          endIdx: userEnd,
          onPageChange: setUserPage,
          onPageSizeChange: setUserPageSize,
        }}
      />

      {/* Documents */}
      <SectionWithSearch
        title="📂 All Documents"
        searchValue={docSearch}
        onSearch={setDocSearch}
        placeholder="Search documents..."
        columns={["Title", "Type", "Folder", "Date"]}
        data={paginatedDocs.map((d) => [d.file, d.type, d.folder, d.date])}
        paginationProps={{
          currentPage: docPage,
          totalPages: totalPages(filteredDocs, docPageSize),
          pageSize: docPageSize,
          totalItems: filteredDocs.length,
          startIdx: docStart,
          endIdx: docEnd,
          onPageChange: setDocPage,
          onPageSizeChange: setDocPageSize,
        }}
      />

      {/* Approvals */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-3">📝 Pending Approvals</h3>
        {approvals.length === 0 ? (
          <p className="text-sm text-gray-500">No pending approvals.</p>
        ) : (
          <ul className="space-y-2">
            {approvals.map((a) => (
              <li key={a.id} className="flex justify-between border-b pb-2">
                <span>{a.type}: {a.doc}</span>
                <div className="flex gap-2">
                  <button className="text-green-600 flex items-center gap-1">
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button className="text-red-600 flex items-center gap-1">
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Audit Logs */}
      <SectionWithSearch
        title="📜 Recent Activity (Audit Logs)"
        searchValue={logSearch}
        onSearch={setLogSearch}
        placeholder="Search logs..."
        buttonLabel="Export CSV"
        onButtonClick={exportLogs}
        columns={["User", "Action", "Target", "Date"]}
        data={paginatedLogs.map((l) => [l.user, l.action, l.target, l.date])}
        paginationProps={{
          currentPage: logPage,
          totalPages: totalPages(filteredLogs, logPageSize),
          pageSize: logPageSize,
          totalItems: filteredLogs.length,
          startIdx: logStart,
          endIdx: logEnd,
          onPageChange: setLogPage,
          onPageSizeChange: setLogPageSize,
        }}
      />
    </div>
  );
};

// ✅ Section with Search First, then Button
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
    {/* Header row with search first, then button */}
    <div className="flex justify-between items-center mb-3">
      <h3 className="font-semibold">{title}</h3>
    </div>

    <div className="flex justify-between items-center mb-3">
      {/* Search first */}
      <div className="relative w-64">
        <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => {
            onSearch(e.target.value);
            paginationProps.onPageChange(1);
          }}
          className="pl-9 pr-3 py-2 border rounded w-full dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Button second */}
      {buttonLabel && (
        <button
          onClick={onButtonClick}
          className="bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-1"
        >
          {buttonLabel}
        </button>
      )}
    </div>

    {/* Table */}
    <table className="w-full text-sm">
      <thead className="bg-blue-600 text-white">
        <tr>
          {columns.map((col) => (
            <th key={col} className="p-2 text-start">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="border-b">
            {row.map((cell, i) => (
              <td key={i} className="p-2">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>

    {/* Pagination */}
    <PaginationControls {...paginationProps} />
  </div>
);

// ✅ Reusable Pagination Component
const PaginationControls = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  startIdx,
  endIdx,
  onPageChange,
  onPageSizeChange,
}) => (
  <div className="flex justify-between items-center mt-3 text-sm">
    <span>
      Showing {startIdx}–{endIdx} of {totalItems}
    </span>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span>Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => {
            const value = e.target.value === "all" ? "all" : parseInt(e.target.value);
            onPageSizeChange(value);
            onPageChange(1);
          }}
          className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value="all">All</option>
        </select>
      </div>
      {pageSize !== "all" && totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  </div>
);

// ✅ Small summary card
const Card = ({ title, value, icon, color }) => (
  <div className={`p-4 rounded-md shadow bg-${color}-100 text-${color}-800`}>
    <div className="flex justify-between items-center">
      <p>{title}</p>
      {icon}
    </div>
    <h3 className="text-xl font-bold mt-2">{value}</h3>
  </div>
);

export default AdminDashboard;
