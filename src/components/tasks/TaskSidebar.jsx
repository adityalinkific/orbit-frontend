import { useEffect, useState } from "react";
import { getDepartments } from "../../services/department.service";
import { getAllUsersService } from "../../services/user.service";

const getDeptStyles = (deptName) => {
  const styles = {
    MARKETING: "bg-orange-50 text-orange-600",
    PRODUCT: "bg-purple-50 text-purple-600",
    FINANCE: "bg-emerald-50 text-emerald-600",
    ENGINEERING: "bg-blue-50 text-blue-600",
    DESIGN: "bg-pink-50 text-pink-600",
  };

  return styles[deptName] || "bg-gray-50 text-gray-600";
};

export default function TaskSidebar({
  onSelect,
  selectedId,
  tasks = [],
}) {
  const [departments, setDepartments] = useState({});
  const [users, setUsers] = useState({});

  useEffect(() => {
    fetchDepartments();
    fetchUsers();
  }, []);

  /* =========================
     FETCH DEPARTMENTS
  ========================= */
  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();

      const map = {};

      data.forEach((d) => {
        map[d.id] = d.name.toUpperCase();
      });

      setDepartments(map);
    } catch (err) {
      console.error("Failed to fetch departments", err);
    }
  };

  /* =========================
     FETCH USERS
  ========================= */
  const fetchUsers = async () => {
    try {
      const res = await getAllUsersService();

      const usersArray = res?.data || res || [];

      const userMap = {};

      usersArray.forEach((user) => {
        userMap[user.id] = user;
      });

      setUsers(userMap);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  return (
    <div className="p-4 space-y-3">
      {tasks.map((task) => {
        const deptName =
          departments[task.department_id] || "UNKNOWN";

        const priority = task.priority?.toLowerCase();

        // Get actual user
        const user = users[task.created_by];

        // Full name fallback
        const userName =
          user?.full_name ||
          user?.name ||
          user?.username ||
          "Unknown User";

        // Avatar initials
        const initials = userName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        return (
          <div
            key={task.id}
            onClick={() => onSelect(task)}
            className={`p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer 
              ${
                selectedId === task.id
                  ? "border-blue-500 bg-white shadow-xl translate-x-1"
                  : "border-white bg-white hover:border-gray-200 shadow-sm"
              }`}
          >
            <div className="flex justify-between items-start mb-3">
              {/* Department */}
              <span
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getDeptStyles(
                  deptName
                )}`}
              >
                {deptName}
              </span>

              {/* Date */}
              <span className="text-gray-400 text-[11px] font-medium flex items-center gap-1">
                {task.due_date}
              </span>
            </div>

            <h3 className="font-bold text-gray-800 text-[14px] mb-4 leading-snug">
              {task.title}
            </h3>

            <div className="flex justify-between items-center border-t border-gray-50 pt-3">
              {/* User */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-100 to-purple-100 flex items-center justify-center text-[10px] font-bold text-blue-600 ring-2 ring-white">
                  {initials}
                </div>

                <span className="text-[12px] font-semibold text-gray-600">
                  {userName}
                </span>
              </div>

              {/* Priority */}
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[11px] font-bold uppercase tracking-tight px-2 py-1 rounded-md 
                    ${
                      priority === "high"
                        ? "text-red-600 bg-red-100"
                        : priority === "medium"
                        ? "text-orange-600 bg-orange-100"
                        : priority === "low"
                        ? "text-green-600 bg-green-100"
                        : "text-gray-600 bg-gray-100"
                    }`}
                >
                  {priority}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}