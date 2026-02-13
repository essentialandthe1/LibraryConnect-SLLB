import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Pencil, Trash2, Plus } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const isActive = status === 'active';

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${
        isActive
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-gray-200 text-gray-600'
      }`}
    >
      {status}
    </span>
  );
};

const UserCard = ({ user, onToggle, onDelete, onEdit }) => (
  <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl p-4 shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {user.name}
        </h3>
        <p className="text-sm text-gray-500">{user.email}</p>
        <p className="text-sm text-gray-400 capitalize">{user.role}</p>
      </div>

      <StatusBadge status={user.status} />
    </div>

    <div className="flex gap-3 mt-4">
      <button
        onClick={() => onToggle(user.email)}
        className="text-sm px-3 py-1 rounded-md bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
      >
        {user.status === 'active' ? 'Deactivate' : 'Activate'}
      </button>

      <button
        onClick={() => onEdit(user.email)}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <Pencil size={16} className="text-blue-600" />
      </button>

      <button
        onClick={() => onDelete(user.email)}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <Trash2 size={16} className="text-red-600" />
      </button>
    </div>
  </div>
);

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(data);
  }, []);

  const updateUsers = (updated) => {
    localStorage.setItem('users', JSON.stringify(updated));
    setUsers(updated);
  };

  const handleToggleStatus = (email) => {
    const updated = users.map((user) =>
      user.email === email
        ? {
            ...user,
            status: user.status === 'active' ? 'inactive' : 'active',
          }
        : user
    );
    updateUsers(updated);
  };

  const handleDelete = (email) => {
    if (!window.confirm('Delete this user?')) return;
    updateUsers(users.filter((user) => user.email !== email));
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            User Management
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded"
              />
            </div>

            <button
              onClick={() => navigate('/create-user')}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition rounded"
            >
              <Plus size={16} />
              Create User
            </button>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="grid gap-4 md:hidden">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserCard
                key={user.email}
                user={user}
                onToggle={handleToggleStatus}
                onDelete={handleDelete}
                onEdit={(email) => navigate(`/edit-user/${email}`)}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-6">
              No users found.
            </p>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-700 text-left text-gray-500 uppercase text-xs">
                <th className="py-3">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.email}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="py-3 font-medium">{user.name}</td>
                  <td>{user.email}</td>
                  <td className="capitalize">{user.role}</td>
                  <td>
                    <StatusBadge status={user.status} />
                  </td>

                  <td className="text-right space-x-2">
                    <button
                      onClick={() => handleToggleStatus(user.email)}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      {user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>

                    <button
                      onClick={() => navigate(`/edit-user/${user.email}`)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    >
                      <Pencil size={16} className="text-blue-600" />
                    </button>

                    <button
                      onClick={() => handleDelete(user.email)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default ManageUsers;
