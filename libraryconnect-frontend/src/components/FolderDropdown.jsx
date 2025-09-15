import React, { useEffect, useState } from 'react';
import { getFolders } from '../api/folderApi';

const FolderDropdown = ({ onSelect }) => {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    getFolders().then((res) => setFolders(res.data));
  }, []);

  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      className="border px-3 py-2 rounded w-full max-w-sm"
    >
      <option value="">Select Folder</option>
      {folders.map((folder) => (
        <option key={folder.id} value={folder.id}>
          {folder.name}
        </option>
      ))}
    </select>
  );
};

export default FolderDropdown;
