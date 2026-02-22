import { useEffect, useState, useMemo } from "react";
import {
  getAllUsersService,
  deleteUserService,
} from "../../services/user.service";
import useAuth from "../../hooks/useAuth";
import { HiDotsHorizontal } from "react-icons/hi";
import { FiSearch, FiShield, FiUserPlus } from "react-icons/fi";

export default function People() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  /* ---------------- FETCH USERS ---------------- */

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsersService();
      setUsers(res?.data || []);
      console.log(res?.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ---------------- GROUP BY ROLE ---------------- */

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

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await deleteUserService(id);
    fetchUsers();
  };

  /* ---------------- HELPERS ---------------- */

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const statusColor = (isActive) =>
    isActive ? "bg-green-500" : "bg-gray-400";

  /* ---------------- UI ---------------- */

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
                className="w-72 pl-10 pr-4 py-2 rounded-lg border border-slate-300 text-slate-800 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            {/* Invite */}
            <button className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition">
              <FiUserPlus size={16} />
              Invite
            </button>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          Object.entries(groupedUsers).map(([roleName, roleUsers]) => (
            <div key={roleName} className="space-y-4">
              {/* ROLE TITLE */}
             <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 uppercase tracking-wide">
                <FiShield className="w-4 h-4 text-slate-500" />
                <span>
                 {roleName} ({roleUsers.length})
                </span>
          </div>


              {/* CARDS */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roleUsers.map((u) => (
                  <div
                    key={u.id}
                    className="bg-white rounded-xl border border-slate-200 p-6 flex justify-between items-start hover:shadow-sm transition"
                  >
                    {/* LEFT SIDE */}
                    <div className="flex gap-4">
                      {/* Avatar */}
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

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">
                            {u.name}
                          </h3>

                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600 capitalize">
                            {u.role?.role}
                          </span>
                        </div>

                        <p className="text-slate-500 text-sm mt-1">
                          {u.email}
                        </p>

                        <p className="text-slate-400 text-sm mt-1">
                          {u.department?.department || "—"}
                        </p>
                      </div>
                    </div>

                    {/* ACTION MENU */}
                    <div className="relative group">
                      <button className="text-slate-400 hover:text-slate-600">
                        <HiDotsHorizontal size={20} />
                      </button>


                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
