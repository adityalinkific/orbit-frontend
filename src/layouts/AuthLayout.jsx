import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eef3fb] to-[#f9fbff]">
      <Outlet />
    </div>
  );
}
