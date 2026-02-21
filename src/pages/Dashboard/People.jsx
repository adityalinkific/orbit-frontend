import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { rolesService, departmentsService } from "../../services/auth.service";
import {
  getAllUsersService,
  createUserService,
  updateUserService,
  deleteUserService,
} from "../../services/user.service";

export default function People() {
  const { user } = useAuth();

  /* ---------------- STATE ---------------- */

  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [users, setUsers] = useState([]);
  const [viewingUser, setViewingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role_id: "",
    department_id: "",
    reporting_manager_id: null,
    is_active: true,
    joined_date: new Date().toISOString().split("T")[0],
  });

  /* ---------------- FETCH ROLES ---------------- */

  const refreshRoles = async () => {
    try {
      const res = await rolesService();
      setRoles(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
    }
  };

  /* ---------------- FETCH USERS ---------------- */

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await getAllUsersService();
      setUsers(res?.data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  /* ---------------- FETCH DEPARTMENTS ---------------- */

  const fetchDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const data = await departmentsService();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    } finally {
      setLoadingDepartments(false);
    }
  };

  useEffect(() => {
    refreshRoles();
    fetchUsers();
    fetchDepartments();
  }, []);

  /* ---------------- HANDLE EDIT ---------------- */

  const handleEdit = (user) => {
    setEditingUser(user);

    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role_id: user.role_id,
      department_id: user.department_id,
      reporting_manager_id: user.reporting_manager_id || null,
      is_active: user.is_active,
      joined_date: user.joined_date,
    });

    setOpen(true);
  };

  /* ---------------- HANDLE DELETE ---------------- */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await deleteUserService(id);
      fetchUsers();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  /* ---------------- SUBMIT (CREATE + UPDATE) ---------------- */

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        await updateUserService(editingUser.id, {
          name: form.name,
          email: form.email,
          role_id: Number(form.role_id),
          department_id: Number(form.department_id),
        });
      } else {
        await createUserService({
          name: form.name,
          email: form.email,
          password: form.password,
          role_id: Number(form.role_id),
          department_id: Number(form.department_id),
          reporting_manager_id: form.reporting_manager_id,
          is_active: form.is_active,
          joined_date: form.joined_date,
        });
      }

      setOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Error saving user", err);
    }
  };

  /* ---------------- RESET FORM ---------------- */

  const closeModal = () => {
    setOpen(false);
    setEditingUser(null);
    setForm({
      name: "",
      email: "",
      password: "",
      role_id: "",
      department_id: "",
      reporting_manager_id: null,
      is_active: true,
      joined_date: new Date().toISOString().split("T")[0],
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="page people-page">
      <div className="people-header">
        <h1>People</h1>
        <button className="primary-btn" onClick={() => setOpen(true)}>
          + Create User
        </button>
      </div>

      {/* TABLE */}
      <div className="widget people-card">
        <table className="people-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th width="200">Action</th>
            </tr>
          </thead>
          <tbody>
            {loadingUsers ? (
              <tr>
                <td colSpan="5">Loading users...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5">No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role?.role || "N/A"}</td>
                  <td>{user.is_active ? "Active" : "Inactive"}</td>
                  <td>
                    <button onClick={() => setViewingUser(user)}>View</button>
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE / EDIT MODAL */}
      {open && (
        <div className="modal-backdrop">
          <div className="widget modal-card">
            <h3>{editingUser ? "Edit User" : "Create User"}</h3>

            <form onSubmit={submit} className="people-form">
              <input
                placeholder="Full Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />

              {!editingUser && (
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              )}

              <select
                value={form.role_id}
                onChange={(e) =>
                  setForm({ ...form, role_id: e.target.value })
                }
                required
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.role}
                  </option>
                ))}
              </select>

              <select
                value={form.department_id}
                onChange={(e) =>
                  setForm({ ...form, department_id: e.target.value })
                }
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>

              <div className="form-actions">
                <button className="primary-btn">
                  {editingUser ? "Update" : "Create"}
                </button>
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW USER MODAL */}
      {viewingUser && (
        <div className="modal-backdrop">
          <div className="modal-card saas-modal">
            <h2>User Details</h2>

            <div className="view-grid">
              <p><strong>Name:</strong> {viewingUser.name}</p>
              <p><strong>Email:</strong> {viewingUser.email}</p>
              <p><strong>Role:</strong> {viewingUser.role?.role}</p>
              <p><strong>Department:</strong> {viewingUser.department?.department}</p>
              <p><strong>Status:</strong> {viewingUser.is_active ? "Active" : "Inactive"}</p>
              <p><strong>Joined:</strong> {new Date(viewingUser.joined_date).toLocaleDateString()}</p>
            </div>

            <div className="form-actions">
              <button
                className="primary-btn"
                onClick={() => setViewingUser(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}