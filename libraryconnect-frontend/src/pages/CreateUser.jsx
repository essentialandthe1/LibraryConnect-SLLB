// src/pages/CreateUser.jsx
// ============================================================
// 📌 CREATE USER PAGE
// ------------------------------------------------------------
// Handles creating a new user account (admin-only action).
// Integrates Axios + TanStack Query for clean async logic.
// Includes comments for backend integration.
// ============================================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { api } from "../services/api"; // ✅ Reusable Axios instance
import toast from "react-hot-toast";

const CreateUser = () => {
  const navigate = useNavigate();

  // 🔹 Local state for form inputs
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    branch: "",
    password: "",
    confirmPassword: "",
    status: "active",
  });

  // 🔹 Handle input field updates
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // 🚀 TanStack Mutation for user creation
  // ============================================================
  const { mutate: createUser, isPending } = useMutation({
    mutationFn: async () => {
      // 🧩 FRONTEND VALIDATION
      if (form.password !== form.confirmPassword) {
        throw new Error("Passwords do not match!");
      }

      // 🧩 BACKEND ENDPOINT (replace URL when backend ready)
      const payload = {
        username: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        branch: form.branch,
        password: form.password,
        status: form.status,
      };

      // Backend should accept POST /users/admin-create
      const res = await api.post("/users/admin-create", payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`✅ User "${form.name}" created successfully!`);
      navigate("/manage-users");
    },
    onError: (err) => {
      toast.error(`❌ ${err.message || "Failed to create user"}`);
      console.error("Error creating user:", err);
    },
  });

  // 🔹 Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    createUser(); // ⛓️ Trigger API request via mutation
  };

  // 🔹 Reset Form
  const handleClear = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      role: "",
      branch: "",
      password: "",
      confirmPassword: "",
      status: "active",
    });
  };

  // ============================================================
  // 🧭 UI Rendering
  // ============================================================
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-md shadow">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
        Create New User
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <InputField
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter full name"
          required
        />

        {/* Email */}
        <InputField
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email"
          required
        />

        {/* Phone */}
        <InputField
          label="Phone Number"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
          required
        />

        {/* Role */}
        <SelectField
          label="User Role / Position"
          name="role"
          value={form.role}
          onChange={handleChange}
          options={[
            "Admin/HR",
            "Chief Librarian",
            "Deputy Chief Librarian",
            "Principal Librarian",
            "Branch Librarian",
            "Staff",
          ]}
          required
        />

        {/* Branch */}
        <SelectField
          label="Branch / Department"
          name="branch"
          value={form.branch}
          onChange={handleChange}
          options={[
            "HQ - Cataloguing Department",
            "HQ - Reference Department",
            "HQ - Adult Lending Department",
            "HQ - Children Department",
            "Regional Library South (Bo)",
            "Regional Library East (Kenema)",
            "Regional Library North (Makeni)",
            "City Library Bo",
            "City Library Kenema",
            "City Library Makeni",
            "Kailahun District Library",
            "Koidu District Library",
            "Segbuma Branch Library",
          ]}
          required
        />

        {/* Password */}
        <InputField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter password"
          required
        />

        {/* Confirm Password */}
        <InputField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter password"
          required
        />

        {/* Account Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Account Status
          </label>
          <div className="flex gap-4 items-center">
            {["active", "inactive"].map((status) => (
              <label
                key={status}
                className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300"
              >
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={form.status === status}
                  onChange={handleChange}
                />
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-60"
          >
            {isPending ? "Creating..." : "Create User"}
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

// ============================================================
// 🧩 Reusable Components
// ============================================================

// ✅ Text Input
const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    />
  </div>
);

// ✅ Select Input
const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    >
      <option value="">Select an option</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
