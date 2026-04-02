import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  HiOutlineUsers,
  HiOutlineOfficeBuilding,
  HiOutlineCog,
  HiOutlineFolder,
  HiOutlineChartBar,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import { FiShield } from "react-icons/fi";
import { VscRobot } from "react-icons/vsc";
import { MdOutlineTaskAlt } from "react-icons/md";
import { FaRegCalendar } from "react-icons/fa6";
import { LayoutDashboard } from "lucide-react";
const allMenus = {
  all_menu: [
    { name: "Task", icon: <MdOutlineTaskAlt size={20} />, path: "/task" },
    { name: "Projects", icon: <HiOutlineFolder size={20} />, path: "/projects" },
    { name: "People", icon: <HiOutlineUsers size={20} />, path: "/people" },
    { name: "Departments", icon: <HiOutlineOfficeBuilding size={20} />, path: "/departments" },
    { name: "Meetings", icon: <FaRegCalendar  size={20} />, path: "/meetings" },
    { name: "Documents", icon: <HiOutlineFolder size={20} />, path: "/documents" },
    { name: "Analytics", icon: <HiOutlineChartBar size={20} />, path: "/analytics" },
    { name: "System Audit", icon: <FiShield  size={20} />, path: "/audit" },
    { name: "Assistant", icon: <VscRobot size={20} />, path: "/assistant" },
    { name: "Settings", icon: <HiOutlineCog size={20} />, path: "/settings" },
  ],
};
const superAdminMenu = {
  super_admin: [
    { name: "People", icon: <HiOutlineUsers size={20} />, path: "/people" },
    { name: "Departments", icon: <HiOutlineOfficeBuilding size={20} />, path: "/departments" },
    { name: "Meetings", icon: <FaRegCalendar size={20} />, path: "/meetings" },
    { name: "Task", icon: <MdOutlineTaskAlt size={20} />, path: "/task" },
    { name: "Settings", icon: <HiOutlineCog size={20} />, path: "/settings" },
  ],
};

const adminMenu = {
  admin: [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Task", icon: <MdOutlineTaskAlt size={20} />, path: "/task" },
    { name: "People", icon: <HiOutlineUsers size={20} />, path: "/people" },
    { name: "Departments", icon: <HiOutlineOfficeBuilding size={20} />, path: "/departments" },
    { name: "Meetings", icon: <FaRegCalendar size={20} />, path: "/meetings" },
    { name: "Settings", icon: <HiOutlineCog size={20} />, path: "/settings" },
  ],
};


export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const { user } = useAuth();

  const role =
    (typeof user?.role === "string"
      ? user.role
      : user?.role?.role
    )?.toLowerCase();

    console.log("USER NAME:", user?.name);
  console.log("USER ROLE:", user?.role);
  console.log("ROLE STRING:", user?.role?.role);


  let menuItems = [];

if (role === "super_admin") {
  menuItems = superAdminMenu.super_admin;
} else if (role === "admin") {
  menuItems = adminMenu.admin;
} else {
  menuItems = allMenus.all_menu; // fallback (or employee/user)
}


  return (
    <aside
      className={`h-full bg-[#f3f4f6] border-r border-slate-200 flex flex-col transition-all duration-300 ${
        collapsed ? "w-[70px]" : "w-[250px]"
      }`}
    >
      {/* Menu Items */}
      <div className="flex-1 px-3 pt-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[15px] transition-all
                ${
                  isActive
                    ? "bg-gray-200 text-slate-900 font-medium"
                    : "text-slate-600 hover:bg-gray-200 hover:text-slate-900"
                }
                ${collapsed ? "justify-center px-2" : ""}
              `}
            >
              <span className="flex justify-center min-w-[24px] text-slate-500">
                {item.icon}
              </span>

              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>

      {/* Bottom Collapse Section */}
      <div className="border-t border-slate-200 p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-between w-full text-slate-600 hover:text-slate-900 text-sm"
        >
          {!collapsed && <span>Collapse</span>}
          {collapsed ? (
            <HiChevronRight size={18} />
          ) : (
            <HiChevronLeft size={18} />
          )}
        </button>
      </div>
    </aside>
  );
}
