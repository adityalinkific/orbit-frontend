import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { rolesService, createRoleService } from "../../services/auth.service";
import {
  getAllUsers,
  createUserService,
  updateUserService,
  deleteUserService,
} from "../../services/user.service";


export default function People() {
  const { user } = useAuth();

  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [roleForm, setRoleForm] = useState({ name: "", description: "" });

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    department: "",
  });

  const refreshRoles = async () => {
    try {
      const res = await rolesService();
      if (Array.isArray(res) && res.length > 0) setRoles(res);
      else if (Array.isArray(res.data) && res.data.length > 0) setRoles(res.data);
      else {
        console.warn("Roles API returned empty or invalid data, using fallback.");
        setRoles([
          { name: "super_admin", id: "super_admin" },
          { name: "admin", id: "admin" },
          { name: "manager", id: "manager" },
          { name: "employee", id: "employee" },
        ]);
      }
    } catch (err) {
      console.error("Failed to fetch roles:", err);
      setRoles([
        { name: "super_admin", id: "super_admin" },
        { name: "admin", id: "admin" },
        { name: "manager", id: "manager" },
        { name: "employee", id: "employee" },
      ]);
    }
  };

  useEffect(() => {
    refreshRoles();
  }, []);

  const createRole = async (e) => {
    e.preventDefault();
    await createRoleService(roleForm);
    setRoleForm({ name: "", description: "" });
    refreshRoles();
  };

  const filteredRoles = (roles || []).filter((r) => {
    if (user?.role === "super_admin") return true;
    if (user?.role === "admin") return r.name !== "super_admin";
    return true;
  });

  const submit = (e) => {
    e.preventDefault();

    if (editing) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editing.id ? { ...u, ...form } : u))
      );
    } else {
      setUsers((prev) => [...prev, { ...form, id: Date.now() }]);
    }

    closeForm();
  };

  const remove = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const edit = (u) => {
    setEditing(u);
    setForm(u);
    setOpen(true);
  };

  const closeForm = () => {
    setOpen(false);
    setEditing(null);
    setForm({ name: "", email: "", password: "", role: "", department: "" });
  };

  return (
    <div className="page fade-in people-page">
      {/* HEADER */}
      <div className="people-header">
        <h1>People</h1>
        <button className="primary-btn" onClick={() => setOpen(true)}>
          + Create User
        </button>
      </div>

      {/* TABLE */}
      <div className="widget people-card slide-up">
        <table className="people-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th width="120">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="empty">
                  No users yet
                </td>
              </tr>
            )}

            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.department}</td>
                <td className="row-actions">
                  <button onClick={() => edit(u)}>Edit</button>
                  <button className="danger" onClick={() => remove(u.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && (
        <div className="modal-backdrop">
          <div className="widget modal-card slide-up">
            <h3>{editing ? "Edit User" : "Create User"}</h3>

            <form onSubmit={submit} className="people-form">
              <label>Full Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <label>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />

              {!editing && (
                <>
                  <label>Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                </>
              )}

              <label>Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="">Select Role</option>
                {filteredRoles.map((r) => (
                  <option key={r.id || r.name} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>

              <label>Department</label>
              <select
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>

              <div className="form-actions">
                <button className="primary-btn">
                  {editing ? "Update" : "Create"}
                </button>
                <button type="button" onClick={closeForm}>
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
