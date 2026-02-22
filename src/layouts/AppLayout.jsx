import { useState } from "react";
import Navbar from "../components/ui/Navbar";
import Sidebar from "../components/ui/Sidebar";
import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="h-screen flex flex-col">
      
      {/* Navbar (fixed height) */}
      <Navbar />

      {/* Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-slate-50 ">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
