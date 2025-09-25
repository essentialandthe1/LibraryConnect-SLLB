// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Users,
  FileText,
  FolderPlus,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  CheckCircle,
  XCircle,
  Download,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [folders, setFolders] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [documents, setDocuments] = useState([]);

  // Search/filter states
  const [userSearch, setUserSearch] = useState("");
  const [docSearch, setDocSearch] = useState("");

  useEffect(() => {
    // ✅ Users → backend: GET /api/users
    setUsers([
      { id: 1, name: "Mattia", email: "mattia@sllb.gov.sl", role: "Admin" },
      { id: 2, name: "Fatmata K.", email: "fatmata@hq.sllb.sl", role: "Chief Librarian" },
      { id: 3, name: "Andrew", email: "andrew@bo.sllb.sl", role: "Regional Librarian" },
      { id: 4, name: "Mariama", email: "mariama@kenema.sllb.sl", role: "User" },
    ]);

    // ✅ Documents → backend: GET /api/documents
    setDocuments([
      { id: 1, file: "Budget Report", type: "Finance", folder: "Finance", date: "2025-01-10" },
      { id: 2, file: "Staff Policy", type: "HR", folder: "HR Documents", date: "2025-02-02" },
      { id: 3, file: "Library Rules", type: "General", folder: "Personal", date: "2025-03-01" },
    ]);

    // ✅ Folders → backend: GET /api/folders
    setFolders([{ id: 1 }, { id: 2 }, { id: 3 }]);

    // ✅ Approvals → backend: GET /api/approvals
    setApprovals([{ id: 1, type: "Trash Request", doc: "Finance Report" }]);

    // ✅ Audit logs → backend: GET /api/audit-logs
    setAuditLogs([{ id: 1, user: "Mattia", action: "Uploaded", target: "Policy.pdf", date: "Today" }]);
  }, []);

  // 📊 Analytics
  const analytics = [
    { month: "Jan", uploads: 12 },
    { month: "Feb", uploads: 18 },
    { month: "Mar", uploads: 9 },
  ];

  // Role management
  const promoteUser = (id) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: "Admin" } : u)));
    // TODO: Backend PATCH /api/users/:id/role
  };
  const demoteUser = (id) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: "User" } : u)));
    // TODO: Backend PATCH /api/users/:id/role
  };

  // Export logs
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

  // Filters
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome Back, Admin 👋</h2>

      {/* Summary */}
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

      {/* Users + Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">👥 Manage Users</h3>
          <button
            onClick={() => navigate("/create-user")}
            className="bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-1"
          >
            <Plus size={16} /> Add User
          </button>
        </div>
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="pl-9 pr-3 py-2 border rounded w-full dark:bg-gray-700 dark:text-white"
          />
        </div>
        <table className="w-full text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2 text-start">Name</th>
              <th className="p-2 text-start">Email</th>
              <th className="p-2 text-start">Role</th>
              <th className="p-2 text-start">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => promoteUser(u.id)} className="text-green-600 flex items-center gap-1">
                    <ArrowUpCircle size={14} /> Promote
                  </button>
                  <button onClick={() => demoteUser(u.id)} className="text-red-600 flex items-center gap-1">
                    <ArrowDownCircle size={14} /> Demote
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Documents + Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-3">📂 All Documents</h3>
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={docSearch}
            onChange={(e) => setDocSearch(e.target.value)}
            className="pl-9 pr-3 py-2 border rounded w-full dark:bg-gray-700 dark:text-white"
          />
        </div>
        <table className="w-full text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2 text-start">Title</th>
              <th className="p-2 text-start">Type</th>
              <th className="p-2 text-start">Folder</th>
              <th className="p-2 text-start">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map((d) => (
              <tr key={d.id} className="border-b">
                <td className="p-2">{d.file}</td>
                <td className="p-2">{d.type}</td>
                <td className="p-2">{d.folder}</td>
                <td className="p-2">{d.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                  <button className="text-green-600 flex items-center gap-1"><CheckCircle size={14} /> Approve</button>
                  <button className="text-red-600 flex items-center gap-1"><XCircle size={14} /> Reject</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Audit Logs */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">📜 Recent Activity (Audit Logs)</h3>
          <button onClick={exportLogs} className="text-blue-600 flex items-center gap-1">
            <Download size={16} /> Export CSV
          </button>
        </div>
        <ul className="space-y-2 text-sm">
          {auditLogs.map((log) => (
            <li key={log.id} className="flex justify-between border-b pb-1">
              <span><b>{log.user}</b> {log.action} <i>{log.target}</i></span>
              <span className="text-gray-500">{log.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

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
