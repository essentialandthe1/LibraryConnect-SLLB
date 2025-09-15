import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    branch: '',
    password: '',
    confirmPassword: '',
    status: 'active',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('❌ Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/admin-create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // JWT token from login
        },
        body: JSON.stringify({
          username: form.name,
          email: form.email,
          role: form.role,
          password: form.password,
        }),
      });

      if (response.ok) {
        alert(`✅ User "${form.name}" created successfully!`);
        navigate('/manage-users');
      } else {
        const err = await response.json();
        alert('❌ Error: ' + JSON.stringify(err));
      }
    } catch (error) {
      console.error('User creation failed:', error);
      alert('❌ Failed to create user. Please try again.');
    }
  };

  const handleClear = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      role: '',
      branch: '',
      password: '',
      confirmPassword: '',
      status: 'active',
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-md shadow">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Create New User</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* All your form inputs go here */}
        {/* ... (rest of your JSX) ... */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Enter full name"
            className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Create User
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;