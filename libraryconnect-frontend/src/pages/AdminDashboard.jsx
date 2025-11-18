// src/pages/AdminDashboard.jsx
import React, { useState } from "react";
import { Users, FileText, FolderPlus, TrendingUp, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

// Reusable components
import { Table } from "../components/ui/table.jsx";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";

// Hover-lift styles (can also go in a global CSS or Tailwind config)
const hoverLiftClass = "transition-transform transform hover:-translate-y-1 hover:shadow-lg";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Search & Pagination
  const [userSearch, setUserSearch] = useState("");
  const [logSearch, setLogSearch] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userPageSize, setUserPageSize] = useState(5);

  // Fetch API data
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => (await api.get("/users")).data,
  });

  const { data: documents = [], isLoading: docsLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => (await api.get("/documents")).data,
  });

  const { data: auditLogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ["auditLogs"],
    queryFn: async () => (await api.get("/audit-logs")).data,
  });

  // Stats array
 const stats = [
    {
      title: 'Total Users',
      value: '248',
      icon: Users,
      change: '+12.5%',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Documents',
      value: '1,834',
      icon: FileText,
      change: '+8.2%',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Active Folders',
      value: '42',
      icon: FolderPlus,
      change: '+3.1%',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Monthly Growth',
      value: '23%',
      icon: TrendingUp,
      change: '+5.4%',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
  ];

  // Chart Data
  const analytics = [
    { month: "Jan", uploads: 12 },
    { month: "Feb", uploads: 18 },
    { month: "Mar", uploads: 9 },
    { month: "Apr", uploads: 24 },
    { month: "May", uploads: 15 },
  ];

  // Filters
  const filteredUsers = users.filter((u) =>
    [u.name, u.email, u.role].some((value) =>
      value?.toLowerCase().includes(userSearch.toLowerCase())
    )
  );

  const filteredLogs = auditLogs.filter((l) =>
    [l.user, l.action, l.target].some((value) =>
      value?.toLowerCase().includes(logSearch.toLowerCase())
    )
  );

  // Pagination
  const paginate = (data, page, size) =>
    size === "all" ? data : data.slice((page - 1) * size, page * size);

  const totalPages = (data, size) =>
    size === "all" ? 1 : Math.ceil(data.length / size);

  const paginatedUsers = paginate(filteredUsers, userPage, userPageSize);

  // CSV Export
  const exportLogs = () => {
    const csv = [
      ["User", "Action", "Target", "Date"],
      ...auditLogs.map((l) => [l.user, l.action, l.target, l.date]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "audit_logs.csv";
    a.click();
  };

  if (usersLoading || docsLoading || logsLoading)
    return (
      <div className="text-center py-10 text-gray-700 dark:text-gray-200">
        Loading dashboard...
      </div>
    );

  return (
    <div className="space-y-8 p-8">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage users, documents, and system analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={stat.title} className={`${hoverLiftClass}`} style={{ animationDelay: `${index * 100}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className= "w-full rounded flex flex-row items-center gap-5 justify-center">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className={hoverLiftClass}>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Button onClick={() => navigate('/create-user')} className={`${hoverLiftClass} w-full rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 justify-center`}>
            <Users className="h-4 w-4" />
            Create New User
          </Button>
          <Button onClick={() => navigate('/manage-users')} variant="outline" className={`${hoverLiftClass} w-full rounded flex items-center gap-2 justify-center`}>
            <Users className="h-4 w-4" />
            Manage Users
          </Button>
          <Button onClick={() => navigate('/upload')} variant="outline" className={`${hoverLiftClass} w-full rounded flex items-center gap-2 justify-center`}>
            <FileText className="h-4 w-4" />
            Upload Document
          </Button>
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card className={hoverLiftClass}>
        <CardHeader>
          <CardTitle>Document Upload Trends</CardTitle>
          <CardDescription>Monthly document uploads over the last 5 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics}>
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="uploads" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <SectionWithSearch
        title="System Audit Logs"
        placeholder="Search logs..."
        buttonLabel="Export Logs"
        buttonIcon={FileText} 
        buttonColor="bg-blue-600 text-white hover:bg-blue-700"
        onButtonClick={exportLogs}
        searchValue={logSearch}
        onSearch={setLogSearch}
        columns={["User", "Action", "Target", "Date"]}
        data={filteredLogs.map((l) => [l.user, l.action, l.target, l.date])}
        hoverLift={hoverLiftClass}
      />
    </div>
  );
};

/* ---------------------------------- */
/* SectionWithSearch Component */
const SectionWithSearch = ({ title, searchValue, onSearch, placeholder, buttonLabel, buttonIcon: ButtonIcon, buttonColor, onButtonClick, columns, data, paginationProps, hoverLift }) => (
  <div className={`bg-card p-6 rounded-lg shadow ${hoverLift}`}>
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      {buttonLabel && (
        <Button
          onClick={onButtonClick}
          className={`flex items-center gap-2 px-4 py-2 rounded ${buttonColor || "btn-primary"} ${hoverLift}`}
        >
          {ButtonIcon && <ButtonIcon className="h-4 w-4" />}
          {buttonLabel}
        </Button>
      )}
    </div>

    <div className="relative w-64 mb-4">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        className="input pl-10"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>

    <Table columns={columns} data={data} />
    {paginationProps && <PaginationControls {...paginationProps} />}
  </div>
);

/* PaginationControls Component */
const PaginationControls = ({ currentPage, totalPages, pageSize, totalItems, onPageChange, onPageSizeChange }) => (
  <div className="flex justify-between items-center mt-4 text-sm">
    <span>
      Page {currentPage} of {totalPages} ({totalItems} items)
    </span>
    <div className="flex items-center gap-3">
      <select value={pageSize} onChange={(e) => onPageSizeChange(parseInt(e.target.value))} className="input h-9 w-20">
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </select>
      <button className="btn-outline px-3 py-1" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>Prev</button>
      <button className="btn-outline px-3 py-1" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  </div>
);

export default AdminDashboard;
