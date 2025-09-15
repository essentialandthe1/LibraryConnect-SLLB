import React, { useEffect, useState } from 'react';
import { Inbox, Send, Folder, Bell, FileText } from 'lucide-react';

const Dashboard = () => {
  const [folders, setFolders] = useState([]);
  const user = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    fetch('/api/folders/')
      .then(res => res.json())
      .then(data => setFolders(data.filter(f => f.allowed_roles.includes(user.id))))
      .catch(err => console.error(err));
  }, [user]);

  return (
    <>
      <h2 className="text-2xl font-bold mb-2">Welcome, {user.username}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card title="Inbox" icon={<Inbox />} value={12} color="blue" />
        <Card title="Outbox" icon={<Send />} value={9} color="green" />
        <Card title="Folders" icon={<Folder />} value={folders.length} color="yellow" />
        <Card title="Notifications" icon={<Bell />} value={3} color="red" />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">My Folders</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {folders.map(f => (
            <div key={f.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <p className="font-medium">{f.name}</p>
                <p className="text-sm text-gray-500">{f.document_count || 0} files</p>
              </div>
              <Folder size={20} className="text-blue-600" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const Card = ({ title, value, icon, color }) => (
  <div className={`p-4 rounded-lg shadow ${'bg-' + color + '-100'} text-${color}-800 flex items-center justify-between`}>
    <div>
      <p className="text-sm">{title}</p>
      <h4 className="text-xl font-bold">{value}</h4>
    </div>
    {icon}
  </div>
);

export default Dashboard;
