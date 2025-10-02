// src/pages/Upload.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { UploadCloud, FileText, Image as ImageIcon } from "lucide-react"; // icons

const Upload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("userInfo")) || { role: "" };

  const [folders, setFolders] = useState([]);
  const [uploading, setUploading] = useState(false); // ✅ new status

  const [form, setForm] = useState({
    title: "",
    type: "",
    folder: "",
    recipient: "",
    message: "",
    file: null,
  });

  useEffect(() => {
    const storedFolders = JSON.parse(localStorage.getItem("folders")) || [];
    setFolders(storedFolders);

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
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      // 10MB limit
      alert("❌ File size exceeds 10MB limit.");
      return;
    }
    setForm((prev) => ({ ...prev, file }));
  };

  const getFileIcon = () => {
    if (!form.file) return <FileText size={20} />;
    if (form.file.type.startsWith("image")) return <ImageIcon size={20} />;
    return <FileText size={20} />;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.file) return alert("❌ Please select a file to upload.");
    if (!form.folder) return alert("❌ Please select a folder.");

    setUploading(true);

    const fileUrl = URL.createObjectURL(form.file);

    const newDoc = {
      id: uuidv4(),
      file: form.title || form.file.name,
      fileUrl,
      type: form.type,
      folder: form.folder,
      recipient: form.recipient,
      message: form.message,
      by: currentUser.role,
      date: new Date().toLocaleDateString(),
      status: "active",
    };

    const uploadedDocuments =
      JSON.parse(localStorage.getItem("uploadedDocuments")) || [];
    uploadedDocuments.push(newDoc);
    localStorage.setItem("uploadedDocuments", JSON.stringify(uploadedDocuments));

    // 🔔 Create notification
    const newNotification = {
      title: `📄 New document uploaded: ${newDoc.file}`,
      sender: currentUser.role,
      timestamp: new Date().toISOString(),
      unread: true,
    };

    const notifications =
      JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.unshift(newNotification);
    localStorage.setItem("notifications", JSON.stringify(notifications));

    // ⚡ Future backend API placeholder:
    // await api.uploadDocument(newDoc);

    setTimeout(() => {
      setUploading(false);
      alert(`✅ Document uploaded to "${form.folder}"!`);
      navigate("/folders");
    }, 1200); // fake delay for realism
  };

  const handleCancel = () => {
    setForm({
      title: "",
      type: "",
      folder: "",
      recipient: "",
      message: "",
      file: null,
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-md shadow">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
        <UploadCloud size={22} /> Send a New Document
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
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

        {/* Type */}
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

        {/* Folder dropdown */}
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

        {/* Recipient */}
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

        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Upload File
          </label>
          <div className="flex items-center gap-2 border rounded px-3 py-2 dark:bg-gray-700 dark:text-white">
            {getFileIcon()}
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full bg-transparent"
              required
            />
          </div>
          {form.file && (
            <p className="text-sm mt-1 text-gray-500">
              Selected: {form.file.name} ({(form.file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        {/* Message */}
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

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            disabled={uploading}
            className={`${
              uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white px-4 py-2 rounded`}
          >
            {uploading ? "Uploading..." : "Send Document"}
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
