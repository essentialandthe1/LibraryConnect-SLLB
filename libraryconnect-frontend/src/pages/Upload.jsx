// src/pages/Upload.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Upload = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 get navigation state
  const currentUser = JSON.parse(localStorage.getItem('userInfo')) || { role: '' };

  const [folders, setFolders] = useState([]);
  const [form, setForm] = useState({
    title: '',
    type: '',
    folder: '',
    recipient: '',
    message: '',
    file: null,
  });

  // 🔹 Load folders for dropdown
  useEffect(() => {
    const storedFolders = JSON.parse(localStorage.getItem('folders')) || [];
    setFolders(storedFolders);

    // 👇 If coming from FolderView, preselect folder
    if (location.state?.folder) {
      setForm((prev) => ({
        ...prev,
        folder: location.state.folder,
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.file) {
      alert('❌ Please select a file to upload.');
      return;
    }
    if (!form.folder) {
      alert('❌ Please select a folder.');
      return;
    }

    const fileUrl = URL.createObjectURL(form.file);

    const newDoc = {
      id: uuidv4(),
      file: form.title || form.file.name,
      fileUrl,
      type: form.type,
      folder: form.folder, // ✅ saved into chosen/preselected folder
      recipient: form.recipient,
      message: form.message,
      by: currentUser.role,
      date: new Date().toLocaleDateString(),
      status: 'active',
    };

    const uploadedDocuments = JSON.parse(localStorage.getItem('uploadedDocuments')) || [];
    uploadedDocuments.push(newDoc);
    localStorage.setItem('uploadedDocuments', JSON.stringify(uploadedDocuments));

    alert(`✅ Document uploaded to "${form.folder}"!`);
    navigate('/folders');

    // 🔔 Create notification
    const newNotification = {
      title: `New document uploaded: ${newDoc.file}`,
      sender: currentUser.role,
      timestamp: new Date().toISOString(),
      unread: true,
    };

    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    notifications.unshift(newNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
  };

  const handleCancel = () => {
    setForm({
      title: '',
      type: '',
      folder: '',
      recipient: '',
      message: '',
      file: null,
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-md shadow">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
        Send a New Document
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Document Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Enter document title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Type
          </label>
          <input
            type="text"
            name="type"
            value={form.type}
            onChange={handleChange}
            placeholder="e.g. Report, Memo"
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* ✅ Folder dropdown with preselected value */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Select Folder
          </label>
          <select
            name="folder"
            value={form.folder}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="">Choose folder</option>
            {folders.map((f) => (
              <option key={f.id} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Recipient
          </label>
          <select
            name="recipient"
            value={form.recipient}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="">Choose recipient</option>
            <option value="Admin">Admin</option>
            <option value="HQ Librarian">HQ Librarian</option>
            <option value="Regional Librarian">Regional Librarian</option>
            <option value="Branch Librarian">Branch Librarian</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Upload File
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Message
          </label>
          <textarea
            name="message"
            placeholder="Optional message..."
            value={form.message}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send Document
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Upload;
