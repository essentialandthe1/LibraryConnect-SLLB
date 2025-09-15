import React, { useEffect, useState } from 'react';
import { FileText, FolderPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FolderView = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const [folders, setFolders] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/folders/')
      .then(res => res.json())
      .then(data => {
        const filtered = user.role === 'Admin'
          ? data
          : data.filter(f => f.allowed_roles.includes(user.id));
        setFolders(filtered);
      });
  }, [user]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Folders</h2>
        {user.role === 'Admin' && (
          <button
            onClick={() => navigate('/create-folder')}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded"
          >
            <FolderPlus size={16} /> Add Folder
          </button>
        )}
      </div>

      <input
        type="text"
        className="w-full mb-4 p-2 border rounded"
        placeholder="Search folders..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {folders
        .filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
        .map(folder => (
          <div key={folder.id} className="p-4 bg-white rounded shadow mb-4">
            <h3 className="text-lg font-semibold text-blue-600">📁 {folder.name}</h3>
            <p className="text-sm text-gray-500">{folder.description}</p>
          </div>
        ))}
    </div>
  );
};

export default FolderView;
