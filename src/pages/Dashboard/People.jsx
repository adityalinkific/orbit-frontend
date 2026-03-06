import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";

/* ---------------- USER SERVICES ---------------- */
import {
  getAllUsersService,
  deleteUserService,
  createUserService,
  updateUserService,
} from "../../services/user.service";

/* ---------------- ROLE + DEPARTMENT SERVICES ---------------- */
import {
  rolesService,
  departmentsService,
} from "../../services/auth.service";

/* ---------------- AUTH HOOK ---------------- */
import useAuth from "../../hooks/useAuth";

/* ---------------- ICONS ---------------- */
import { HiDotsHorizontal } from "react-icons/hi";
import { FiSearch, FiShield, FiUserPlus } from "react-icons/fi";
import Modal from "../../components/common/Modal";

export default function People() {
  const { user } = useAuth();

  /* ================= STATE ================= */

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [dropdownUserId, setDropdownUserId] = useState(null);
  const [hoveredUser, setHoveredUser] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

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

  /* ================= FETCH ================= */

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsersService();
      setUsers(res?.data || []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await rolesService();
      setRoles(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await departmentsService();
      setDepartments(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchDepartments();
  }, []);

  useEffect(() => {
    const close = () => setDropdownUserId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  /* ================= GROUP USERS ================= */

  const groupedUsers = useMemo(() => {
    const filtered = users.filter((u) =>
      u.name?.toLowerCase().includes(search.toLowerCase())
    );

    const groups = {};
    filtered.forEach((u) => {
      const roleName = u.role?.role?.toUpperCase() || "OTHERS";
      if (!groups[roleName]) groups[roleName] = [];
      groups[roleName].push(u);
    });

    return groups;
  }, [users, search]);

  const rolePriority = {
    SUPER_ADMIN: 1,
    ADMIN: 2,
    EMPLOYEE: 3,
  };

  const sortedGroupedUsers = Object.entries(groupedUsers).sort(
    ([a], [b]) =>
      (rolePriority[a] ?? 99) - (rolePriority[b] ?? 99)
  );

  /* ================= ACTIONS ================= */

const handleEdit = (user) => {
  setEditingUser(user);

  setForm({
    name: user.name,
    email: user.email,
    password: "",

    role_id: String(user.role_id || user.role?.id || ""),
    department_id: String(user.department_id || user.department?.id || ""),

    reporting_manager_id: user.reporting_manager_id || null,
    is_active: user.is_active,

    joined_date: user.joined_date
      ? user.joined_date.split("T")[0]
      : new Date().toISOString().split("T")[0],
  });

  setShowModal(true);
};


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await toast.promise(deleteUserService(id), {
      loading: "Deleting user...",
      success: "User deleted successfully",
      error: "Failed to delete user",
    });

    fetchUsers();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const basePayload = {
      name: form.name,
      email: form.email,
      role_id: Number(form.role_id),
      department_id: Number(form.department_id),
      reporting_manager_id: form.reporting_manager_id
        ? Number(form.reporting_manager_id)
        : null,
      is_active: form.is_active,
      joined_date: form.joined_date,
    };

    if (editingUser) {
      await toast.promise(
        updateUserService(editingUser.id, {
          ...basePayload,
          ...(form.password ? { password: form.password } : {}),
        }),
        {
          loading: "Updating user...",
          success: "User updated successfully",
          error: "Failed to update user",
        }
      );
    } else {
      await toast.promise(
        createUserService({
          ...basePayload,
          password: form.password,
        }),
        {
          loading: "Creating user...",
          success: "User created successfully",
          error: "Failed to create user",
        }
      );
    }

    closeModal();
    fetchUsers();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setViewingUser(null);
  };

  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase();

  const statusColor = (active) =>
    active ? "bg-green-500" : "bg-gray-400";

  /* ================= UI ================= */

  return (
    <div className="bg-slate-100 min-h-screen px-25 py-10 pb-50">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              People
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Manage team members and permissions
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search people..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="
                    w-72
                    pl-10 pr-4 py-2.5
                    text-sm text-slate-700
                    bg-slate-100
                    border border-transparent
                    rounded-lg
                    outline-none
                    transition
                    duration-200
                    focus:bg-white
                    focus:border-slate-300
                    focus:ring-2
                    focus:ring-slate-200
                  "
                />

            </div>

            <button
              onClick={() => {
                setEditingUser(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 bg-[#1d3658] text-white px-4 py-2 rounded-md text-sm"
            >
              <FiUserPlus size={16} />
              Create
            </button>
          </div>
        </div>

        {/* CONTENT */}
        {sortedGroupedUsers.map(([roleName, roleUsers]) => (
          <div key={roleName} className="space-y-4  pr-65">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 uppercase">
              <FiShield className="w-4 h-4" />
              {roleName} ({roleUsers.length})
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {roleUsers.map((u) => (
                <div
                  key={u.id}
                  onMouseEnter={() => setHoveredUser(u)}
                  onMouseLeave={() => setHoveredUser(null)}
                  className="relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition duration-200 p-6 flex justify-between"
                >
                  <div className="flex gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-[#4b799b] text-white flex items-center justify-center font-semibold">
                        {getInitials(u.name)}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${statusColor(
                          u.is_active
                        )}`}
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {u.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {u.email}
                      </p>
                      <p className="text-sm text-slate-400">
                        {u.department?.department || "—"}
                      </p>
                    </div>
                  </div>

                  {/* MENU */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownUserId(
                          dropdownUserId === u.id ? null : u.id
                        );
                      }}
                      className="p-1.5 hover:bg-[#4299da] text-slate-600 hover:text-white rounded-lg"
                    >
                      <HiDotsHorizontal  size={20} />
                    </button>

                    {dropdownUserId === u.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(u);
                          }}
                          className="block text-slate-800 w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50"
                        >
                          Edit
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(u.id);
                          }}
                          className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* HOVER PREVIEW */}
                  {hoveredUser?.id === u.id && (
                    <div className="absolute text-slate-900 top-6 left-full ml-4 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-5 z-50 animate-in fade-in duration-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-[#4b799b] text-white flex items-center justify-center font-semibold text-sm">
                            {getInitials(u.name)}
                          </div>
                          <span
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${statusColor(
                              u.is_active
                            )}`}
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">
                            {u.name}
                          </h4>
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-slate-100 rounded-full">
                            {u.role?.role}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-slate-600 mb-4">
                        <p><strong>Email:</strong> {u.email}</p>
                        <p><strong>Department:</strong> {u.department?.department || "—"}</p>
                        <p><strong>Manager:</strong> {u.reporting_manager?.name || "—"}</p>
                        <p>
                          <strong>Joined:</strong>{" "}
                          {u.joined_date
                            ? new Date(u.joined_date).toLocaleDateString()
                            : "—"}
                        </p>
                      </div>
                      <div className="border-t border-slate-300 pt-3 text-xs space-y-1">
                            <div>
                              <h3 className="text-base font-semibold">Quick Stats</h3>
                            </div>
                        <p><strong>Assigned:</strong> {u.assigned_tasks || 0}</p>
                        <p><strong>Completed:</strong> {u.completed_tasks || 0}</p>
                        <p className="text-red-500">
                          <strong>Overdue:</strong> {u.overdue_tasks || 0}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* MODAL */}
        <Modal
          open={showModal}
          onOpenChange={(v) => (!v ? closeModal() : setShowModal(true))}
          editingUser={editingUser}
          form={form}
          setForm={setForm}
          roles={roles}
          departments={departments}
          onSubmit={handleSubmit}
        />

      </div>
    </div>
  );
}
