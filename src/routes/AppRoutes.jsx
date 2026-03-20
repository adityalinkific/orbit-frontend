import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import AuthLayout from "../layouts/AuthLayout";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import Dashboard from "../pages/Dashboard/Dashboard";
import Tasks from "../pages/Dashboard/Tasks";
import Projects from "../pages/Dashboard/Projects";
import People from "../pages/Dashboard/People";
import Departments from "../pages/Dashboard/Departments";
import Documents from "../pages/Dashboard/Documents";
import Analytics from "../pages/Dashboard/Analytics";
import SystemAudit from "../pages/Dashboard/SystemAudit";
import Assistant from "../pages/Dashboard/Assistant";
import Settings from "../pages/Dashboard/Settings";

import NotFound from "../pages/NotFound";
import useAuth from "../hooks/useAuth";
import Meetings from "../pages/Dashboard/Meetings";

function Protected({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* ---------- AUTH ---------- */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ---------- PROTECTED APP ---------- */}
      <Route
        element={
          <Protected>
            <AppLayout />
          </Protected>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/task" element={<Tasks />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/people" element={<People />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/meetings" element={<Meetings/>}/>
        <Route path="/documents" element={<Documents />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/audit" element={<SystemAudit />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* ---------- FALLBACK ---------- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
