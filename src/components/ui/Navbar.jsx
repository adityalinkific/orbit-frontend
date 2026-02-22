import { CiSearch } from "react-icons/ci";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <div className="h-[54px] bg-white px-5 grid grid-cols-[auto_1fr_auto] items-center shadow-[0_4px_14px_rgba(0,0,0,0.06)] z-10">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-bold">
          <img
            src="/src/assets/icons/orbit.1.svg"
            alt="Orbit Logo"
            className="w-[42px] h-[42px] object-contain"
          />
          <span className="text-xl font-bold text-black">
            Orbit
          </span>
        </div>
      </div>

      {/* CENTER */}
      <div className="flex justify-center">
  <div className="relative w-[420px]">
    <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
    
    <input
      type="text"
      placeholder="Search tasks, meetings, users, documents..."
      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
    />
      </div>
    </div>


      {/* RIGHT */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
        >
          Logout
        </button>
      </div>

    </div>
  );
}
