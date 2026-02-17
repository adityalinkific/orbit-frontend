import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { rolesService } from "../../services/auth.service";
import {
  getAllUsers,
  createUserService,
  deleteUserService,
} from "../../services/user.service";

export default function People() {
  const { user } = useAuth();

  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role_id: "",
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
      setLoading(true);
      const res = await getAllUsers();
      setUsers(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRoles();
    fetchUsers();
  }, []);

  /* ---------------- CREATE USER ---------------- */
  const submit = async (e) => {
    e.preventDefault();
    try {
      await createUserService(form);
      await fetchUsers();
      setOpen(false);
      setForm({
        name: "",
        email: "",
        password: "",
        role: "",
        department: "",
      });
    } catch (err) {
      console.error("Failed to create user:", err);
    }
  };

  /* ---------------- DELETE CURRENT USER ---------------- */
  const remove = async () => {
    try {
      await deleteUserService();
      alert("Current user deleted (backend limitation).");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="page people-page">
      <div className="people-header">
        <h1>People</h1>
        <button className="primary-btn" onClick={() => setOpen(true)}>
          + Create User
        </button>
      </div>

      <div className="widget people-card">
        <table className="people-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="2">Loading...</td>
              </tr>
            )}

            {!loading &&
              users.map((u, i) => (
                <tr key={i}>
                  <td>{u.name || u.role_name}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="modal-backdrop">
          <div className="widget modal-card">
            <h3>Create User</h3>
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

              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />

              <select
                value={form.role_id}
                onChange={(e) =>
                  setForm({ ...form, role_id: e.target.value })
                }
                required
              >
                <option value="">Select Role</option>
                {roles.map((r, i) => (
                  <option key={r.id} value={r.id}>
                    {r.role}
                  </option>
                ))}
              </select>

              <select
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
                required
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>

              <div className="form-actions">
                <button className="primary-btn">Create</button>
                <button type="button" onClick={() => setOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
