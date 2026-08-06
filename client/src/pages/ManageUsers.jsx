import { useEffect, useState } from "react";
import {
  Search,
  UserPlus,
  Users,
  X,
  User,
  Mail,
  Phone,
  Lock,
  LoaderCircle,
} from "lucide-react";

import {
  getUsers,
  addUser,
  updateUserStatus,
  resetUserPassword,
  updateUser,
  getUserAssignmentSummary,
  reassignAndDeleteUser,
} from "../services/api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [resetUser, setResetUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
  });

  const [editLoading, setEditLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  });
  // ================= DELETE / REASSIGN STATES =================

  const [deletingUser, setDeletingUser] = useState(null);

  const [assignmentSummary, setAssignmentSummary] = useState(null);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [selectedReassignUser, setSelectedReassignUser] = useState("");

  // ===============================
  // FETCH USERS
  // ===============================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getUsers();

      setUsers(response.data);
    } catch (err) {
      console.error("Fetch users error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===============================
  // INPUT CHANGE
  // ===============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // ===============================
  // CREATE USER
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.username.trim() ||
      !formData.password.trim()
    ) {
      setError(
        "Name, email, username and password are required."
      );

      return;
    }

    try {
      setSubmitting(true);

      const response = await addUser(formData);

      setSuccess(
        response.data.message ||
        "Employee created successfully."
      );

      // Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        username: "",
        password: "",
      });

      // Close form
      setShowForm(false);

      // Refresh employee list
      await fetchUsers();
    } catch (err) {
      console.error("Create user error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to create employee."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (user) => {
    try {
      setError("");
      setSuccess("");

      const newStatus =
        user.status?.toLowerCase() === "active"
          ? "Disabled"
          : "Active";

      const response = await updateUserStatus(
        user.id,
        newStatus
      );

      setSuccess(
        response.data.message ||
        `Employee ${newStatus.toLowerCase()} successfully.`
      );

      await fetchUsers();
    } catch (err) {
      console.error("Status update error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to update employee status."
      );
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm the new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setResetLoading(true);
      setError("");
      setSuccess("");

      const response = await resetUserPassword(
        resetUser.id,
        newPassword
      );

      setSuccess(
        response.data.message ||
        "Employee password reset successfully."
      );

      // Close reset modal
      setResetUser(null);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Reset password error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to reset employee password."
      );
    } finally {
      setResetLoading(false);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();

    if (
      !editFormData.name ||
      !editFormData.email ||
      !editFormData.username
    ) {
      setError("Name, email and username are required.");
      return;
    }

    try {
      setEditLoading(true);
      setError("");
      setSuccess("");

      const response = await updateUser(
        editingUser.id,
        editFormData
      );

      setSuccess(
        response.data.message ||
        "Employee updated successfully."
      );

      // Refresh employee list
      await fetchUsers();

      // Close modal
      setEditingUser(null);

      setEditFormData({
        name: "",
        email: "",
        phone: "",
        username: "",
      });

    } catch (err) {
      console.error("Edit employee error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to update employee."
      );

    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteClick = async (user) => {
    try {
      setDeleteLoading(true);
      setError("");
      setSuccess("");

      // Store employee being deleted
      setDeletingUser(user);

      // Reset old selection / summary
      setSelectedReassignUser("");
      setAssignmentSummary(null);

      // Get assigned Leads + Customers count
      const response = await getUserAssignmentSummary(user.id);

      setAssignmentSummary(response.data.assignments);

    } catch (err) {
      console.error("Assignment summary error:", err);

      setDeletingUser(null);

      setError(
        err.response?.data?.message ||
        "Unable to check employee assignments."
      );

    } finally {
      setDeleteLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;

    if (!selectedReassignUser) {
      setError("Please select an employee to reassign the records.");
      return;
    }

    try {
      setDeleteLoading(true);
      setError("");
      setSuccess("");

      const response = await reassignAndDeleteUser(
        deletingUser.id,
        selectedReassignUser
      );

      setSuccess(
        response.data?.message ||
        "Employee deleted and records reassigned successfully."
      );

      // Remove deleted employee immediately from UI
      setUsers((prevUsers) =>
        prevUsers.filter(
          (user) => user.id !== deletingUser.id
        )
      );

      // Close modal
      setDeletingUser(null);
      setAssignmentSummary(null);
      setSelectedReassignUser("");

    } catch (err) {
      console.error("Delete employee error:", err);

      setError(
        err.response?.data?.message ||
        "Failed to delete employee."
      );

    } finally {
      setDeleteLoading(false);
    }
  };
  // ===============================
  // SEARCH
  // ===============================

  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(searchValue) ||
      user.username?.toLowerCase().includes(searchValue) ||
      user.email?.toLowerCase().includes(searchValue) ||
      user.role?.toLowerCase().includes(searchValue)
    );
  });

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Manage Users
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage employees and their CRM access.
          </p>
        </div>

        <button
          onClick={() => {
            setError("");
            setSuccess("");
            setShowForm(true);
          }}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-blue-600
            px-5
            py-3
            font-medium
            text-white
            shadow-sm
            transition
            hover:bg-blue-700
            active:scale-[0.98]
          "
        >
          <UserPlus size={19} />

          Add User
        </button>

      </div>


      {/* ================= STATS ================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Users size={24} />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Total Employees
            </p>

            <h2 className="text-2xl font-bold text-slate-900">
              {users.length}
            </h2>
          </div>

        </div>

      </div>


      {/* ================= SUCCESS ================= */}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}


      {/* ================= ERROR ================= */}

      {error && !showForm && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* ================= TABLE CARD ================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Search */}

        <div className="border-b border-slate-200 p-5">

          <div className="relative max-w-md">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                py-3
                pl-11
                pr-4
                text-sm
                text-slate-700
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-500
                focus:bg-white
                focus:ring-4
                focus:ring-blue-100
              "
            />

          </div>

        </div>


        {/* Loading */}

        {loading ? (

          <div className="flex items-center justify-center gap-2 py-16 text-slate-500">

            <LoaderCircle
              size={22}
              className="animate-spin"
            />

            Loading employees...

          </div>

        ) : filteredUsers.length === 0 ? (

          /* Empty State */

          <div className="py-16 text-center">

            <Users
              size={42}
              className="mx-auto mb-3 text-slate-300"
            />

            <h3 className="font-semibold text-slate-700">
              No users found
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Add your first employee to get started.
            </p>

          </div>

        ) : (

          /* Table */

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">

                  <th className="px-6 py-4">
                    Employee
                  </th>

                  <th className="px-6 py-4">
                    Username
                  </th>

                  <th className="px-6 py-4">
                    Contact
                  </th>

                  <th className="px-6 py-4">
                    Role
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left">
                    ACTIONS
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredUsers.map((user) => (

                  <tr
                    key={user.id}
                    className="transition hover:bg-slate-50/70"
                  >

                    {/* Employee */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">

                          {user.name
                            ? user.name
                              .charAt(0)
                              .toUpperCase()
                            : "U"}

                        </div>

                        <div>

                          <p className="font-medium text-slate-800">
                            {user.name || "No Name"}
                          </p>

                          <p className="text-xs text-slate-400">
                            ID #{user.id}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* Username */}

                    <td className="px-6 py-4 text-sm text-slate-600">
                      @{user.username}
                    </td>


                    {/* Contact */}

                    <td className="px-6 py-4">

                      <p className="text-sm text-slate-700">
                        {user.email || "No email"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {user.phone || "No phone"}
                      </p>

                    </td>


                    {/* Role */}

                    <td className="px-6 py-4">

                      <span
                        className={
                          user.role?.toLowerCase() ===
                            "admin"
                            ? "rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600"
                            : "rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600"
                        }
                      >
                        {user.role}
                      </span>

                    </td>


                    {/* Status */}
                    <td className="px-6 py-4">

                      <span
                        className={
                          user.status?.toLowerCase() === "active"
                            ? "inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600"
                            : "inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600"
                        }
                      >

                        <span
                          className={
                            user.status?.toLowerCase() === "active"
                              ? "h-2 w-2 rounded-full bg-green-500"
                              : "h-2 w-2 rounded-full bg-red-500"
                          }
                        ></span>

                        {user.status}

                      </span>

                    </td>


                    {/* Actions */}
                    <td className="px-6 py-4">

                      {user.role?.toLowerCase() !== "admin" && (

                        <div className="flex items-center gap-2">

                          {/* Enable / Disable */}
                          <button
                            onClick={() => handleStatusChange(user)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${user.status?.toLowerCase() === "active"
                              ? "bg-red-100 text-red-600 hover:bg-red-200"
                              : "bg-green-100 text-green-600 hover:bg-green-200"
                              }`}
                          >
                            {user.status?.toLowerCase() === "active"
                              ? "Disable"
                              : "Enable"}
                          </button>


                          {/* Reset Password */}
                          <button
                            onClick={() => {
                              setResetUser(user);
                              setNewPassword("");
                              setConfirmPassword("");
                              setError("");
                              setSuccess("");
                            }}
                            className="px-4 py-2 rounded-lg text-sm font-semibold bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition whitespace-nowrap"
                          >
                            Reset Password
                          </button>

                          {/* Edit Employee */}
                          <button
                            onClick={() => {
                              setEditingUser(user);

                              setEditFormData({
                                name: user.name || "",
                                email: user.email || "",
                                phone: user.phone || "",
                                username: user.username || "",
                              });

                              setError("");
                              setSuccess("");
                            }}
                            className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                          >
                            Edit
                          </button>

                          {/* Delete Employee */}
                          <button
                            onClick={() => handleDeleteClick(user)}
                            disabled={deleteLoading}
                            className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Delete
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


      {/* ================= ADD USER MODAL ================= */}

      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-3xl border border-white/70 bg-white p-7 shadow-2xl">

            {/* Modal Header */}

            <div className="mb-6 flex items-start justify-between">

              <div>

                <h2 className="text-2xl font-bold text-slate-900">
                  Add New Employee
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create login credentials for a new user.
                </p>

              </div>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setError("");
                }}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>


            {/* Modal Error */}

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}


            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* Name */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>

                <div className="flex items-center rounded-xl border border-slate-200 px-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">

                  <User
                    size={18}
                    className="text-slate-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter employee name"
                    className="w-full bg-transparent px-3 py-3 outline-none"
                  />

                </div>

              </div>


              {/* Email */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <div className="flex items-center rounded-xl border border-slate-200 px-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">

                  <Mail
                    size={18}
                    className="text-slate-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="employee@company.com"
                    className="w-full bg-transparent px-3 py-3 outline-none"
                  />

                </div>

              </div>


              {/* Phone */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone
                </label>

                <div className="flex items-center rounded-xl border border-slate-200 px-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">

                  <Phone
                    size={18}
                    className="text-slate-400"
                  />

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full bg-transparent px-3 py-3 outline-none"
                  />

                </div>

              </div>


              {/* Username */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Username
                </label>

                <div className="flex items-center rounded-xl border border-slate-200 px-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">

                  <User
                    size={18}
                    className="text-slate-400"
                  />

                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Create username"
                    className="w-full bg-transparent px-3 py-3 outline-none"
                  />

                </div>

              </div>


              {/* Password */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Temporary Password
                </label>

                <div className="flex items-center rounded-xl border border-slate-200 px-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">

                  <Lock
                    size={18}
                    className="text-slate-400"
                  />

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create temporary password"
                    className="w-full bg-transparent px-3 py-3 outline-none"
                  />

                </div>

              </div>


              {/* Buttons */}

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setError("");
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {submitting && (
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                  )}

                  {submitting
                    ? "Creating..."
                    : "Create User"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}
      {/* ==========================================
    RESET PASSWORD MODAL
========================================== */}

      {resetUser && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            {/* Heading */}
            <h2 className="text-2xl font-bold text-slate-900">
              Reset Password
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Set a new password for{" "}
              <span className="font-semibold text-slate-700">
                {resetUser.name || resetUser.username}
              </span>
            </p>


            <form
              onSubmit={handleResetPassword}
              className="mt-6 space-y-4"
            >

              {/* New Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  New Password
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>


              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>


              {/* Error */}
              {error && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}


              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => {
                    setResetUser(null);
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                  }}
                  className="rounded-lg bg-gray-100 px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={resetLoading}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {resetLoading
                    ? "Resetting..."
                    : "Reset Password"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}
      {/* ================= EDIT EMPLOYEE MODAL ================= */}

      {editingUser && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-3xl border border-white/70 bg-white p-7 shadow-2xl">

            {/* Header */}
            <div className="mb-6 flex items-start justify-between">

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Edit Employee
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update employee account information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingUser(null);
                  setError("");
                }}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>


            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}


            <form
              onSubmit={handleEditUser}
              className="space-y-4"
            >

              {/* Name */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>

                <div className="flex items-center rounded-xl border border-slate-200 px-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">

                  <User size={18} className="text-slate-400" />

                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        name: e.target.value,
                      })
                    }
                    className="w-full bg-transparent px-3 py-3 outline-none"
                  />

                </div>

              </div>


              {/* Email */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <div className="flex items-center rounded-xl border border-slate-200 px-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">

                  <Mail size={18} className="text-slate-400" />

                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        email: e.target.value,
                      })
                    }
                    className="w-full bg-transparent px-3 py-3 outline-none"
                  />

                </div>

              </div>


              {/* Phone */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone
                </label>

                <div className="flex items-center rounded-xl border border-slate-200 px-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">

                  <Phone size={18} className="text-slate-400" />

                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full bg-transparent px-3 py-3 outline-none"
                  />

                </div>

              </div>


              {/* Username */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Username
                </label>

                <div className="flex items-center rounded-xl border border-slate-200 px-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">

                  <User size={18} className="text-slate-400" />

                  <input
                    type="text"
                    value={editFormData.username}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        username: e.target.value,
                      })
                    }
                    className="w-full bg-transparent px-3 py-3 outline-none"
                  />

                </div>

              </div>


              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(null);
                    setError("");
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {editLoading && (
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                  )}

                  {editLoading
                    ? "Updating..."
                    : "Update Employee"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}
      {/* ================= REASSIGN & DELETE MODAL ================= */}

      {deletingUser && assignmentSummary && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-3xl border border-white/70 bg-white p-7 shadow-2xl">

            {/* Header */}
            <div className="mb-6 flex items-start justify-between">

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Delete Employee
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Reassign employee records before permanent deletion.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDeletingUser(null);
                  setAssignmentSummary(null);
                  setSelectedReassignUser("");
                  setError("");
                }}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>


            {/* Employee being deleted */}
            <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4">

              <p className="text-sm font-medium text-red-600">
                You are deleting
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                {deletingUser.name}
              </p>

              <p className="text-sm text-slate-500">
                @{deletingUser.username}
              </p>

            </div>


            {/* Assignment Summary */}
            <div className="mb-6">

              <p className="mb-3 text-sm font-semibold text-slate-700">
                Currently Assigned Records
              </p>

              <div className="grid grid-cols-3 gap-3">

                {/* Leads */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">

                  <p className="text-2xl font-bold text-slate-900">
                    {assignmentSummary.leads || 0}
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Leads
                  </p>

                </div>


                {/* Customers */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">

                  <p className="text-2xl font-bold text-slate-900">
                    {assignmentSummary.customers || 0}
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Customers
                  </p>

                </div>


                {/* Total */}
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-center">

                  <p className="text-2xl font-bold text-blue-600">
                    {assignmentSummary.total || 0}
                  </p>

                  <p className="mt-1 text-xs font-medium text-blue-500">
                    Total
                  </p>

                </div>

              </div>

            </div>


            {/* Reassign Dropdown */}
            <div className="mb-6">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Reassign records to
              </label>

              <select
                value={selectedReassignUser}
                onChange={(e) =>
                  setSelectedReassignUser(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >

                <option value="">
                  Select employee
                </option>

                {users
                  .filter(
                    (user) =>
                      user.id !== deletingUser.id &&
                      user.role?.toLowerCase() !== "admin" &&
                      user.status?.toLowerCase() === "active"
                  )
                  .map((user) => (

                    <option
                      key={user.id}
                      value={user.id}
                    >
                      {user.name} (@{user.username})
                    </option>

                  ))}

              </select>

              <p className="mt-2 text-xs text-slate-500">
                All assigned leads and customers will be transferred
                to this employee.
              </p>

            </div>


            {/* Warning */}
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">

              <p className="text-sm text-amber-700">
                This action permanently deletes the employee account.
                Assigned CRM records will not be deleted.
              </p>

            </div>


            {/* Error inside modal */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}


            {/* Buttons */}
            <div className="flex justify-end gap-3">

              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => {
                  setDeletingUser(null);
                  setAssignmentSummary(null);
                  setSelectedReassignUser("");
                  setError("");
                }}
                className="rounded-xl border border-slate-200 px-5 py-2.5 font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={
                  deleteLoading ||
                  !selectedReassignUser
                }
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {deleteLoading && (
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                )}

                {deleteLoading
                  ? "Deleting..."
                  : "Reassign & Delete"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}