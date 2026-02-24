import { useEffect, useState, useMemo } from "react";



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

/* ============================================================
   PEOPLE COMPONENT
   Responsible for:
   - Fetching users
   - Grouping users by role
   - Creating users
   - Updating users
   - Deleting users
   - Viewing user details
   ============================================================ */

export default function People() {
  const { user } = useAuth(); // Current logged-in user

  /* ============================================================
     STATE MANAGEMENT
     ============================================================ */

  // All users list
  const [users, setUsers] = useState([]);

  // Roles & Departments
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  // Search filter
  const [search, setSearch] = useState("");

  // Dropdown control (for three-dot menu)
  const [dropdownUserId, setDropdownUserId] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  /* ============================================================
     FORM STATE (Used for Create & Edit)
     ============================================================ */

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role_id: "",
    department_id: "",
    reporting_manager_id: null,
    is_active: true,
    joined_date: new Date().toISOString().split("T")[0], // Default today
  });

  /* ============================================================
     FETCH DATA FUNCTIONS
     ============================================================ */

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsersService();
      setUsers(res?.data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const res = await rolesService();
      setRoles(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
    }
  };

  // Fetch departments
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

  /* ============================================================
     INITIAL LOAD
     Runs once when component mounts
     ============================================================ */

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchDepartments();
  }, []);

  /* ============================================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
     ============================================================ */

  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownUserId(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  /* ============================================================
     GROUP USERS BY ROLE (Memoized for performance)
     ============================================================ */

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
  "SUPER_ADMIN": 1,
  "ADMIN": 2,
  "EMPLOYEE": 3,
};

const sortedGroupedUsers = Object.entries(groupedUsers).sort(
  ([roleA], [roleB]) => {
    const normalizedA = roleA.trim().toUpperCase();
    const normalizedB = roleB.trim().toUpperCase();

    const priorityA = rolePriority[normalizedA] ?? 99;
    const priorityB = rolePriority[normalizedB] ?? 99;

    return priorityA - priorityB;
  }
);



  /* ============================================================
     VIEW USER DETAILS
     ============================================================ */
  const handleView = (user) => {
    setViewingUser(user);
  };

  /* ============================================================
     EDIT USER (Prefill form with existing values)
     ============================================================ */
  const handleEdit = (user) => {
    setEditingUser(user);

    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role_id: user.role_id || user.role?.id || "",
      department_id: user.department_id || user.department?.id || "",
      reporting_manager_id: user.reporting_manager_id || null,
      is_active: user.is_active,
      joined_date: user.joined_date
        ? user.joined_date.split("T")[0]
        : new Date().toISOString().split("T")[0],
    });

    setShowModal(true);
  };

  /* ============================================================
     DELETE USER
     ============================================================ */
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

  /* ============================================================
     SUBMIT FORM (CREATE OR UPDATE)
     ============================================================ */
const handleSubmit = async (e) => {
  e.preventDefault();

  const basePayload = {
    name: form.name,
    email: form.email, // ✅ FIXED
    role_id: Number(form.role_id),
    department_id: Number(form.department_id),
    reporting_manager_id: form.reporting_manager_id
      ? Number(form.reporting_manager_id)
      : null,
    is_active: form.is_active,
    joined_date: form.joined_date,
  };

  try {
    if (editingUser) {
      // 🔹 On edit, only send password if user typed one
      const updatePayload = {
        ...basePayload,
        ...(form.password ? { password: form.password } : {}),
      };

      await updateUserService(editingUser.id, updatePayload);
    } else {
      // 🔹 On create, password is required
      await createUserService({
        ...basePayload,
        password: form.password,
      });
    }

    closeModal();
    fetchUsers();
  } catch (err) {
    console.error("Error saving user", err);
  }
};





  /* ============================================================
     RESET FORM + CLOSE MODALS
     ============================================================ */
  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setViewingUser(null);

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

  /* ============================================================
     HELPER FUNCTIONS
     ============================================================ */

  // Get initials for avatar circle
  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  // Active / Inactive indicator color
  const statusColor = (isActive) =>
    isActive ? "bg-green-500" : "bg-gray-400";

  /* ============================================================
     UI RENDER
     ============================================================ */
  return (
    <div className="bg-slate-100 min-h-screen p-10">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              People
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Manage team members and permissions
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search people..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-72 pl-10 pr-4 py-2 text-slate-600 rounded-lg border border-slate-300 text-sm"
              />
            </div>

            {/* Invite */}
            <button
              onClick={() => {
                setEditingUser(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition"
            >
              <FiUserPlus size={16} />
              Create
            </button>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          sortedGroupedUsers.map(([roleName, roleUsers]) => (
            <div key={roleName} className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 uppercase">
                <FiShield className="w-4 h-4" />
                {roleName} ({roleUsers.length})
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roleUsers.map((u) => (
                  <div
                    key={u.id}
                    className="bg-white rounded-xl border-gray-200 shadow-md  p-6 flex justify-between"
                  >
                    <div className="flex gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-slate-500 text-white flex items-center justify-center font-semibold">
                          {getInitials(u.name)}
                        </div>
                        <span
                          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${statusColor(
                            u.is_active
                          )}`}
                        ></span>
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">{u.name}</h3>
                        <p className="text-sm text-slate-500">
                          {u.email}
                        </p>
                        <p className="text-sm text-slate-400">
                          {u.department?.department || "—"}
                        </p>
                      </div>
                    </div>


                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownUserId(dropdownUserId === u.id ? null : u.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-100 transition"
                    >
                      <HiDotsHorizontal size={20} className="text-slate-500" />
                    </button>
                    
                      {dropdownUserId === u.id && (
                        <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-lg z-20 animate-in slide-in-from-top-2 duration-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleView(u);
                            }}
                            className="block text-slate-900 w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                          >
                            View
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(u.id);
                            }}
                            className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {/* CREATE / EDIT MODAL */}
            <Modal
              open={showModal}
              onOpenChange={(value) => {
                if (!value) {
                  closeModal();
                } else {
                  setShowModal(true);
                }
              }}
              editingUser={editingUser}
              form={form}
              setForm={setForm}
              roles={roles}
              departments={departments}
              onSubmit={handleSubmit}
            />



        {/* VIEW USER MODAL */}
        {viewingUser && (
          <div className="fixed inset-0 bg-black/40 text-slate-800 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4 shadow-lg">
              <h2 className="text-lg font-semibold">User Details</h2>
              <div className="space-y-3 text-sm">
                <p><strong>Name:</strong> {viewingUser.name}</p>
                <p><strong>Email:</strong> {viewingUser.email}</p>
                <p><strong>Role:</strong> {viewingUser.role?.role || "N/A"}</p>
                <p><strong>Department:</strong> {viewingUser.department?.department || viewingUser.department?.name || "N/A"}</p>
                <p><strong>Status:</strong> {viewingUser.is_active ? "Active" : "Inactive"}</p>
                {viewingUser.joined_date && (
                  <p><strong>Joined:</strong> {new Date(viewingUser.joined_date).toLocaleDateString()}</p>
                )}
              </div>
              <div className="flex gap-3 justify-end pt-2">
                          <button
                            onClick={() => {
                              setViewingUser(null);
                              handleEdit(viewingUser);
                            }}
                            className="px-4 py-2 text-sm border rounded-lg hover:bg-slate-50"
                          >
                            Edit
                          </button>

                <button
                  onClick={() => setViewingUser(null)}
                  className="px-4 py-2 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
