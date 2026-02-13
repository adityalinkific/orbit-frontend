import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineOfficeBuilding,
  HiOutlineCog,
  HiOutlineFolder,
  HiOutlineChartBar,
} from "react-icons/hi";

const allMenus = {
  super_admin: [
    { name: "Dashboard", icon: <HiOutlineViewGrid />, path: "/dashboard" },
    { name: "People", icon: <HiOutlineUsers />, path: "/people" },
    { name: "Departments", icon: <HiOutlineOfficeBuilding />, path: "/departments" },
    { name: "Settings", icon: <HiOutlineCog />, path: "/settings" },
  ],

  admin: [
    { name: "Dashboard", icon: <HiOutlineViewGrid />, path: "/dashboard" },
    { name: "People", icon: <HiOutlineUsers />, path: "/people" },
    { name: "Projects", icon: <HiOutlineFolder />, path: "/projects" },
    { name: "Departments", icon: <HiOutlineOfficeBuilding />, path: "/departments" },
    { name: "Analytics", icon: <HiOutlineChartBar />, path: "/analytics" },
    { name: "Settings", icon: <HiOutlineCog />, path: "/settings" },
  ],

  manager: [
    { name: "Dashboard", icon: <HiOutlineViewGrid />, path: "/dashboard" },
    { name: "Projects", icon: <HiOutlineFolder />, path: "/projects" },
    { name: "People", icon: <HiOutlineUsers />, path: "/people" },
  ],

  employee: [
    { name: "Dashboard", icon: <HiOutlineViewGrid />, path: "/dashboard" },
    { name: "Projects", icon: <HiOutlineFolder />, path: "/projects" },
  ],

  intern: [
    { name: "Dashboard", icon: <HiOutlineViewGrid />, path: "/dashboard" },
  ],
};

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const { user } = useAuth();

  const role = user?.role || "super_admin";
  const menuItems = allMenus[role] || allMenus.super_admin;

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "➡" : "⬅"}
        </button>
      </div>

      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={location.pathname === item.path ? "active" : ""}
          >
            <span className="side-icon">{item.icon}</span>
            {!collapsed && <span className="side-text">{item.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
