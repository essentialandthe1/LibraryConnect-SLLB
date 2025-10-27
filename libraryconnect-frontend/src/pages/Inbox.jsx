import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Inbox = () => {
  const navigate = useNavigate();

  // 👤 Current logged-in user
  const currentUser =
    JSON.parse(localStorage.getItem("userInfo")) || { role: "", email: "" };

  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("inbox"); // toggle inbox/outbox

  // 📂 Load uploaded documents
  useEffect(() => {
    const storedDocs =
      JSON.parse(localStorage.getItem("uploadedDocuments")) || [];
    setDocuments(storedDocs);
  }, []);

  // 📥 Inbox → docs received by current user
  const inbox = documents.filter((doc) =>
    (doc.recipient || "")
      .toLowerCase()
      .includes(currentUser.role.toLowerCase())
  );

  // 📤 Outbox → docs sent by current user
  const outbox = documents.filter(
    (doc) => (doc.by || "").toLowerCase() === currentUser.role.toLowerCase()
  );

  // 🔎 Search
  const filteredInbox = inbox.filter(
    (doc) =>
      (doc.file || "").toLowerCase().includes(search.toLowerCase()) ||
      (doc.by || "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredOutbox = outbox.filter(
    (doc) =>
      (doc.file || "").toLowerCase().includes(search.toLowerCase()) ||
      (doc.recipient || "").toLowerCase().includes(search.toLowerCase())
  );

  // ⬇️ Download file
  const downloadFile = (doc) => {
    const a = document.createElement("a");
    a.href = doc.fileUrl;
    a.download = doc.file;
    a.click();
  };

  // 👀 View file
  const viewFile = (id) => {
    if (!id) return alert("Document ID is missing!");
    navigate(`/view-document/${id}`);
  };

  // 🗑️ Move file to trash (with approval + notification)
  const moveToTrash = (doc) => {
    // remove from inbox/outbox
    const updatedDocs = documents.filter((d) => d.id !== doc.id);
    localStorage.setItem("uploadedDocuments", JSON.stringify(updatedDocs));

    // prepare trashed doc with pendingApproval flag
    const trashedDocs =
      JSON.parse(localStorage.getItem("trashedDocuments")) || [];
    const trashedDoc = {
      ...doc,
      trashedAt: new Date().toLocaleString(),
      pendingApproval: true, // ✅ sender must approve
    };

    trashedDocs.push(trashedDoc);
    localStorage.setItem("trashedDocuments", JSON.stringify(trashedDocs));

    // create notification (consistent schema)
    const notifications =
      JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.push({
      id: Date.now(),
      recipient: doc.by, // 👈 only this user sees it
      title: `⚠️ Document "${doc.file}" moved to Trash`,
      sender: "System",
      timestamp: new Date().toISOString(),
      unread: true,
      docId: doc.id, // link to trashed doc
      action: "approve-delete",
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));

    setDocuments(updatedDocs);
    alert("🗑️ Document moved to Trash! Sender has been notified.");
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow">
      {/* Toggle buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-left sm:items-center mb-4 gap-2">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {activeTab === "inbox" ? "📥 Inbox" : "📤 Outbox"}
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("inbox")}
            className={`w-full px-3 py-1 rounded ${
              activeTab === "inbox"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-white"
            }`}
          >
            Inbox
          </button>
          <button
            onClick={() => setActiveTab("outbox")}
            className={`w-full px-3 py-1 rounded ${
              activeTab === "outbox"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-white"
            }`}
          >
            Outbox
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative sm:w-64 mb-4">
        <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search documents..."
          className="w-full pl-9 pr-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Inbox Table */}
      {activeTab === "inbox" && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-4">Title</th>
                <th className="py-2 px-4">Sender</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInbox.map((doc) => (
                <tr key={doc.id} className="border-b dark:border-gray-700">
                  <td className="py-2 px-4">{doc.file}</td>
                  <td className="py-2 px-4">{doc.by}</td>
                  <td className="py-2 px-4">{doc.date}</td>
                  <td className="py-2 px-4 text-blue-600 space-x-3">
                    <button onClick={() => downloadFile(doc)}>Download</button>
                    <button onClick={() => viewFile(doc.id)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredInbox.length === 0 && (
            <p className="text-sm text-gray-400 mt-2">
              No documents found in your inbox.
            </p>
          )}
        </div>
      )}

      {/* Outbox Table */}
      {activeTab === "outbox" && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-4">Title</th>
                <th className="py-2 px-4">Recipient</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOutbox.map((doc) => (
                <tr key={doc.id} className="border-b dark:border-gray-700">
                  <td className="py-2 px-4">{doc.file}</td>
                  <td className="py-2 px-4">{doc.recipient}</td>
                  <td className="py-2 px-4">{doc.date}</td>
                  <td className="py-2 px-4 text-blue-600 space-x-3">
                    <button onClick={() => downloadFile(doc)}>Download</button>
                    <button onClick={() => viewFile(doc.id)}>View</button>
                    <button
                      onClick={() => moveToTrash(doc)}
                      className="text-red-600"
                    >
                      Trash
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOutbox.length === 0 && (
            <p className="text-sm text-gray-400 mt-2">
              You have not sent any documents yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Inbox;
