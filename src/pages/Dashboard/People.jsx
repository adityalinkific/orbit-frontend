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

  /* ---------------- FETCH ROLES ---------------- */

  const refreshRoles = async () => {
    try {
      const res = await rolesService();
      console.log("ROLES RESPONSE 👉", res);

      let data = [];
      if (Array.isArray(res)) {
        data = res;
      } else if (Array.isArray(res?.data)) {
        data = res.data;
      } else if (Array.isArray(res?.results)) {
        data = res.results;
      } else {
        console.warn("Unexpected roles format:", res);
      }

      // Fallback if empty or failed
      if (data.length === 0) {
        data = [
          { name: "super_admin", id: "super_admin" },
          { name: "admin", id: "admin" },
          { name: "manager", id: "manager" },
          { name: "employee", id: "employee" },
        ];
      }

      setRoles(data);
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

  /* ---------------- FETCH USERS ---------------- */

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();

      // Supports paginated Django response
      setUsers(Array.isArray(res) ? res : res?.results || []);
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

  /* ---------------- ROLE FILTER ---------------- */

  const getRoleName = (r) => r.name || r.role_name || r.role || r;

  const filteredRoles = (roles || []).filter((r) => {
    const rName = getRoleName(r);
    if (user?.role === "super_admin") return true;
    if (user?.role === "admin") return rName !== "super_admin";
    return true;
  });

  /* ---------------- SUBMIT ---------------- */

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (editing) {
        await updateUserService(editing.id, form);
      } else {
        await createUserService(form);
      }

      await fetchUsers();
      closeForm();
    } catch (err) {
      console.error("Failed to save user:", err);
    }
  };

  /* ---------------- DELETE ---------------- */

  const remove = async (id) => {
    try {
      await deleteUserService(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  /* ---------------- EDIT ---------------- */

  const edit = (u) => {
    setEditing(u);
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role,
      department: u.department,
    });
    setOpen(true);
  };

  const closeForm = () => {
    setOpen(false);
    setEditing(null);
    setForm({
      name: "",
      email: "",
      password: "",
      role: "",
      department: "",
    });
  };

  /* ---------------- UI ---------------- */

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
            {loading && (
              <tr>
                <td colSpan="5" className="empty">
                  Loading users...
                </td>
              </tr>
            )}

            {!loading && users.length === 0 && (
              <tr>
                <td colSpan="5" className="empty">
                  No users found
                </td>
              </tr>
            )}

            {!loading &&
              users.map((u) => (
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
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />

              <label>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
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
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
                required
              >
                <option value="">Select Role</option>
                {filteredRoles.map((r) => {
                  const rName = getRoleName(r);
                  return (
                    <option key={r.id || rName} value={rName}>
                      {rName}
                    </option>
                  );
                })}
              </select>

              <label>Department</label>
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
