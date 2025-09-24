import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, Download, Trash2, Check, X } from "lucide-react";

const FolderDocuments = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { folder } = location.state || {}; // ✅ folder name
  const currentUser = JSON.parse(localStorage.getItem("userInfo")) || { role: "", email: "" };

  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const allDocs = JSON.parse(localStorage.getItem("uploadedDocuments")) || [];
    const folderDocs = allDocs.filter((doc) => doc.folder === folder);
    setDocuments(folderDocs);
  }, [folder]);

  // ✅ Save docs back to localStorage
  const updateDocs = (updatedDocs) => {
    localStorage.setItem("uploadedDocuments", JSON.stringify(updatedDocs));
    setDocuments(updatedDocs.filter((doc) => doc.folder === folder));
  };

  // ✅ View doc
  const handleView = (docId) => {
    navigate(`/view-document/${docId}`);
  };

  // ✅ Download doc
  const handleDownload = (doc) => {
    const link = document.createElement("a");
    link.href = doc.fileUrl;
    link.download = doc.file;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Request Trash (approval needed)
  const handleRequestTrash = (doc) => {
    if (window.confirm("Request to move this document to Trash?")) {
      const allDocs = JSON.parse(localStorage.getItem("uploadedDocuments")) || [];
      const updated = allDocs.map((d) =>
        d.id === doc.id ? { ...d, status: "pending-trash" } : d
      );
      updateDocs(updated);

      // 🔔 Notify original uploader
      const newNotification = {
        title: `Trash Request: ${doc.file}`,
        sender: currentUser.email,
        recipient: doc.by, // uploader
        docId: doc.id,
        action: "trash-request",
        timestamp: new Date().toISOString(),
        unread: true,
      };
      const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
      notifications.unshift(newNotification);
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
  };

  // ✅ Approve Trash
  const handleApproveTrash = (doc) => {
    const allDocs = JSON.parse(localStorage.getItem("uploadedDocuments")) || [];
    const updated = allDocs.map((d) =>
      d.id === doc.id ? { ...d, status: "trash" } : d
    );
    updateDocs(updated);
    alert("✅ Document moved to Trash.");
  };

  // ✅ Reject Trash
  const handleRejectTrash = (doc) => {
    const allDocs = JSON.parse(localStorage.getItem("uploadedDocuments")) || [];
    const updated = allDocs.map((d) =>
      d.id === doc.id ? { ...d, status: "active" } : d
    );
    updateDocs(updated);
    alert("❌ Trash request rejected.");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📁 {folder} Documents</h2>

      {documents.length === 0 ? (
        <p className="text-gray-500">No documents found in this folder.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Type</th>
                <th className="p-3 border">Uploaded By</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{doc.file}</td>
                  <td className="p-3 border">{doc.type}</td>
                  <td className="p-3 border">{doc.by}</td>
                  <td className="p-3 border">{doc.date}</td>
                  <td className="p-3 border">
                    {doc.status === "pending-trash" ? (
                      <span className="text-yellow-600 font-medium">Pending Approval</span>
                    ) : doc.status === "trash" ? (
                      <span className="text-red-600 font-medium">Trashed</span>
                    ) : (
                      <span className="text-green-600">Active</span>
                    )}
                  </td>
                  <td className="p-3 border flex justify-center gap-2">
                    {/* View */}
                    <button
                      onClick={() => handleView(doc.id)}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      <Eye size={14} /> View
                    </button>

                    {/* Download */}
                    <button
                      onClick={() => handleDownload(doc)}
                      className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                    >
                      <Download size={14} /> Download
                    </button>

                    {/* Trash Logic */}
                    {doc.status === "active" && (
                      <button
                        onClick={() => handleRequestTrash(doc)}
                        className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        <Trash2 size={14} /> Trash
                      </button>
                    )}

                    {/* Approve/Reject only for uploader */}
                    {doc.status === "pending-trash" && doc.by === currentUser.role && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveTrash(doc)}
                          className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          <Check size={14} /> Approve
                        </button>
                        <button
                          onClick={() => handleRejectTrash(doc)}
                          className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                        >
                          <X size={14} /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FolderDocuments;
