import { Users, X, Plus, FolderKanban } from "lucide-react";
import { useEffect, useState } from "react";

import { getAllUsersService } from "../../services/user.service";
import { getDepartmentById } from "../../services/department.service";
import ManageMembersModal from "./AddMembersModal";

const DepartmentSidebar = ({ department, isOpen, onClose }) => {
  const [members, setMembers] = useState([]);
  const [deptMeta, setDeptMeta] = useState(null);
  const [openManageMembers, setOpenManageMembers] = useState(false); // ✅ Renamed for clarity
  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    if (department?.id) {
      fetchDepartmentMeta();
      fetchMembers();
    }
  }, [department?.id]);

  const fetchDepartmentMeta = async () => {
    try {
      const data = await getDepartmentById(department.id);
      setDeptMeta(data);
    } catch (err) {
      console.error("Failed to fetch department meta", err);
    }
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const users = await getAllUsersService();
      const deptMembers = users.data?.filter( 
        (u) => u.department_id === department.id
      ) || [];
      setMembers(deptMembers);
    } catch (err) {
      console.error("Failed to fetch members", err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleManageMembersSuccess = () => {
    fetchMembers();
    fetchDepartmentMeta();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed top-0 right-0 h-screen w-[420px] bg-[#f6f7f9] shadow-2xl z-50">
        {/* Header */}
        <div className="p-6 flex items-center justify-between sticky top-0 bg-[#f6f7f9] z-20">
          <div className="flex gap-2 item-center">
            <h2 className="text-xl text-slate-1000 font-medium truncate text-slate-900">
            {department.name}
          </h2>
          <div>
            <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    department.is_active
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {department.is_active ? "active" : "inactive"}
                </span>

          </div>
           
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-slate-900 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

          <div className="h-[calc(100vh-80px)] overflow-y-auto p-6 scrollbar-modern">
          {/* Description */}
          <div className="mb-8 pb-6 ">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Description
            </h3>
            <p className="text-sm text-slate-900">
              {department.description || "No description available"}
            </p>
          </div>

          {/* HEAD OF DEPARTMENT */}
          <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
              Head of Department
            </h3>
           {department.department_head_name ? (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4b8fe2] text-xs font-medium text-white">
              {department.department_head_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <span className="text-slate-900 text-sm font-medium">
                {department.department_head_name}
              </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-400">
            <Users size={16} />
            No team lead assigned
          </div>
        )}
        </div>

          {/* MEMBERS SECTION */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-sm text-gray-600 flex items-center gap-2">
                <Users size={16} />
                Members
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                  {deptMeta?.total_members ?? members.length}
                </span>
              </h3>

              <button
                onClick={() => setOpenManageMembers(true)}
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <Plus size={14} /> Manage
              </button>
            </div>

            {loading ? (
              <p className="text-sm text-gray-400">Loading members…</p>
            ) : members.length === 0 ? (
              <p className="text-sm text-gray-400">
                No members in this department
              </p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-modern">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-9 h-9 bg-[#f0f2f4] text-slate-900 rounded-full flex items-center justify-center text-xs font-medium">
                      {member.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate text-slate-900">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {member.role?.role || "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ASSOCIATED PROJECTS SECTION */}
          <div className="mb-8 pt-6 bg-[#f6f7f9] ">
            <h3 className="font-medium text-sm text-gray-600 flex items-center gap-2 mb-2">
             <FolderKanban size={16} /> Associated Projects
            </h3>

            <div className="rounded-lg bg-[#f0f2f4] p-2 flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Projects</span>
              <span className="text-lg font-semibold">
                {deptMeta?.total_associated_projects ?? "—"}
              </span>
            </div>
          </div>

          {/* Created At */}
          <div className="pt-6 border-t text-sm text-gray-500">
            <span className="font-medium">Created on:</span>{" "}
            {new Date(department.created_at).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      <ManageMembersModal
        open={openManageMembers}
        onOpenChange={setOpenManageMembers}
        departmentId={department.id}
        existingMembers={members} // ✅ Pass current members
        onSuccess={handleManageMembersSuccess}
      />
    </>
  );
};

export default DepartmentSidebar;
