// src/pages/FolderView.jsx
import React, { useEffect, useState } from "react";
import { Folder as FolderIcon, FolderPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FolderView = () => {
  const user =
    JSON.parse(localStorage.getItem("userInfo")) || {
      role: "",
      email: "",
      id: "",
    };

  const [folders, setFolders] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("folders")) || [];

    if (stored.length === 0) {
      const defaultFolders = [
        {
          id: 1,
          name: "HQ Management",
          description: "Headquarters documents",
          ownerId: "admin",
          allowedUsers: ["Admin", "Admin/HR"],
        },
        {
          id: 2,
          name: "Regional Kenema",
          description: "Kenema regional office",
          ownerId: "chief",
          allowedUsers: ["Chief Librarian"],
        },
        {
          id: 3,
          name: "Adult Lending HQ",
          description: "Adult lending section",
          ownerId: "user123",
          allowedUsers: ["user123"],
        },
      ];
      localStorage.setItem("folders", JSON.stringify(defaultFolders));
      setFolders(defaultFolders);
    } else {
      setFolders(stored);
    }
  }, []);

  // ✅ Check if user can open a folder
  const canOpenFolder = (folder) => {
    return (
      user.role === "Admin" ||
      user.role === "Admin/HR" ||
      folder.ownerId === user.id ||
      folder.allowedUsers.includes(user.role) ||
      folder.allowedUsers.includes(user.email)
    );
  };

  // ✅ Count docs inside each folder
  const getFileCount = (folderName) => {
    const allDocs =
      JSON.parse(localStorage.getItem("uploadedDocuments")) || [];
    return allDocs.filter((doc) => doc.folder === folderName).length;
  };

  // ✅ Filter folders by search
  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  // ------------------------------
  // OPTION A: Keep restricted visible but locked
  // const visibleFolders = filteredFolders;

  // OPTION B: Hide restricted folders completely
  const visibleFolders = filteredFolders.filter((f) => canOpenFolder(f));
  // ------------------------------

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Folders</h2>
        {user.role === "Admin" && (
          <button
            onClick={() => navigate("/create-folder")}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
          >
            <FolderPlus size={16} /> Add Folder
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Search folders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Folder Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {visibleFolders.map((folder) => (
          <div
            key={folder.id}
            onClick={() =>
              canOpenFolder(folder) &&
              navigate("/folder-documents", { state: { folder: folder.name } })
            }
            className={`bg-white border rounded-lg shadow-sm p-4 flex flex-col items-center text-center transition
              ${
                canOpenFolder(folder)
                  ? "cursor-pointer hover:shadow-md"
                  : "cursor-not-allowed opacity-50"
              }
            `}
          >
            <FolderIcon
              size={48}
              className="text-yellow-500 mb-2"
              fill="currentColor"
            />
            <h3 className="text-sm font-semibold text-gray-700">
              {folder.name}
            </h3>
            <p className="text-xs text-gray-500">
              {canOpenFolder(folder)
                ? `${getFileCount(folder.name)} files`
                : "Restricted"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderView;
