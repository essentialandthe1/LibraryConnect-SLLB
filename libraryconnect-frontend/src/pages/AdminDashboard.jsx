import React, { useEffect, useState } from 'react';
import { Users, FileText, Building, Plus, FolderPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    fetch('/api/folders/')
      .then(res => res.json())
      .then(data => setFolders(data))
      .catch(err => console.error('Error fetching folders:', err));
  }, []);

  const handleCreateFolder = () => {
    navigate('/create-folder');
  };

  const users = [
    { name: 'Mattia', email: 'mattia@sllb.gov.sl', role: 'Admin' },
    { name: 'Fatmata K.', email: 'fatmata@hq.sllb.sl', role: 'Chief Librarian' },
    { name: 'Andrew B.', email: 'andrew@bo.sllb.sl', role: 'Regional Librarian' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold">Welcome, Back Admin 👋</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <Card title="Total Users" value={users.length} icon={<Users />} color="blue" />
        <Card title="Folders" value={folders.length} icon={<FolderPlus />} color="yellow" />
        <Card title="Documents" value={134} icon={<FileText />} color="green" />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Manage Users</h3>
          <button onClick={() => navigate('/create-user')} className="bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-1">
            <Plus size={16} /> Add User
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2  text-start w-2/5">Name</th>
              <th className="p-2  text-start w-2/5">Email</th>
              <th className="p-2 text-start">Role</th>
            </tr>
          </thead>
          <tbody >
            {users.map((u, i) => (
              <tr key={i} className="border-b">
                <td className="p-2 w-2/5">{u.name}</td>
                <td className="p-2 w-2/5">{u.email}</td>
                <td className="p-2 ">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
