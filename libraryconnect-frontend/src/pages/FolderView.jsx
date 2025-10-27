// src/pages/Folders.jsx
import React, { useState } from "react";
import { Lock, Search } from "lucide-react";

// Example folder data
const allFolders = [
  { name: "HQ Management", files: 300, restricted: true },
  { name: "Admin", files: 250, restricted: true },
  { name: "Regional Kenema", files: 90, restricted: false },
  { name: "Regional BO", files: 87, restricted: false },
  { name: "Regional Makeni", files: 60, restricted: false },
  { name: "Adult Lending HQ", files: 94, restricted: false },
  { name: "Cataloguing HQ", files: 200, restricted: false },
  { name: "Reference HQ", files: 120, restricted: false },
  { name: "Children's HQ", files: 140, restricted: false },
  { name: "City Lib - Kenema", files: 80, restricted: false },
  { name: "City Lib - Bo", files: 88, restricted: false },
  { name: "City Lib - Makeni", files: 90, restricted: false },
  { name: "Waterloo Lib", files: 100, restricted: false },
];

// TEMP: hardcoded role for now
const userRole = "admin"; // change to "regular" to see all

const Folders = () => {
  const [search, setSearch] = useState("");

  // ================================
  // Option B (default) – hide restricted folders from list
  // BUT if searched, show them locked 🔒
  // ================================
  const baseFolders =
    userRole === "admin"
      ? allFolders
      : allFolders.filter((f) => !f.restricted);

  const searchedFolders = allFolders.filter((folder) =>
    folder.name.toLowerCase().includes(search.toLowerCase())
  );

  const visibleFolders = search ? searchedFolders : baseFolders;

  // ================================
  // Option A – always show restricted but locked
  // Uncomment this if you want restricted folders always visible
  // ================================
  /*
  const visibleFolders = allFolders.filter((folder) =>
    folder.name.toLowerCase().includes(search.toLowerCase())
  );
  */

  // 🔑 BACKEND PLACEHOLDER
  // Replace `userRole` with actual user.role from auth
  // Example:
  // const { user } = useAuth();
  // const userRole = user?.role || "regular";

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 sm:gap-0 ">
        <h1 className="text-2xl font-bold">Folders</h1>

        {/* Search Bar */}
        <div className="relative">
          <Search
            className="absolute left-3 top-2.5 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search folders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Folder Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {visibleFolders.length > 0 ? (
          visibleFolders.map((folder, index) => (
            <div
              key={index}
              className={`p-4 rounded-2xl shadow-md flex flex-col items-center justify-center text-center cursor-pointer 
                ${folder.restricted && userRole !== "admin"
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-yellow-100 hover:bg-yellow-200"
                }`}
            >
              <div className="text-5xl mb-2">📁</div>
              <h2 className="font-semibold">{folder.name}</h2>

              {folder.restricted && userRole !== "admin" ? (
                <div className="flex items-center gap-1 text-sm">
                  <Lock size={14} /> <span>Restricted</span>
                </div>
              ) : (
                <p className="text-sm">{folder.files} files</p>
              )}
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No folders found.
          </p>
        )}
      </div>

    </div>
  );
};

export default Folders;
