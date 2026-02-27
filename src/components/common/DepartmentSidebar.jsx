import { Users, X } from "lucide-react"; 

const DepartmentSidebar = ({ department, isOpen, onClose }) => {
if (!isOpen) return null;

if (!department) {
  return (
    <div className="fixed top-0 right-0 h-screen w-[420px] bg-white shadow-2xl z-50 flex items-center justify-center">
      <span className="text-gray-400 text-sm">Loading department…</span>
    </div>
  );
}

  return (
    
    <div
      className={`
        fixed top-0 right-0 h-screen w-[420px] bg-white shadow-2xl z-50
        transform transition-transform duration-300 ease-in-out border-l border-gray-200
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
    >
      {/* Fixed Header - Never scrolls */}
      
      <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-20">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 truncate">{department?.name ?? "—"}</h2>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:bg-gray-100 hover:text-slate-900 rounded-lg transition-colors flex-shrink-0"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      <div className="h-[calc(100vh-80px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent p-6 pb-12">
        {/* Description */}
        <div className="grid grid-cols-[auto_1fr_auto] items-start gap-4 mb-8 pb-6 border-b border-gray-100">
          <div>
            <h3 className="font-medium text-sm text-slate-600 mb-2">Description</h3>
            <p className="text-sm text-gray-900 leading-relaxed">
              {department.description || 'No description available'}
            </p>
          </div>
        </div>
        {/*Head Of Department*/}
        <div className="mb-8 pb-6 border-b border-gray-100">
            <h3 className="font-medium text-sm text-slate-600 mb-2">Head of Department</h3>
            <div className="flex gap-2 item-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4b8fe2] text-xs font-medium text-white">
              JM
            </div>
            <p className="text-sm text-gray-900 leading-relaxed font-medium">
              {department.head || 'James Myres'}
            </p>
            </div>

        </div>

        {/* Members */}
        <div className="mb-8">
          <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
            <Users size={16}/> Members
            <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
              {department.member_count ?? 0}
            </span>
          </h3>
          <div className="space-y-3">
            {[
              { name: 'James Miller', role: 'Head of Engineering & Product' },
              { name: 'Ming Wang', role: 'Senior Developer' },
              { name: 'Sarah Chen', role: 'Product Manager' },
              { name: 'David Patel', role: 'DevOps Engineer' },
              { name: 'Lisa Wong', role: 'Frontend Developer' },
              { name: 'Michael Brown', role: 'Backend Developer' },
              { name: 'Anna Schmidt', role: 'QA Engineer' },
              { name: 'Carlos Rodriguez', role: 'Designer' }
            ].map((member, i) => (
              <div key={i} className="flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                <div className="w-8 h-8 bg-[#f0f2f4] rounded-full flex items-center justify-center text-[11px] font-medium text-slate-900 flex-shrink-0">
                  {member.name
                    .split(" ")
                    .slice(0, 2)
                    .map(word => word[0])
                    .join("")
                    .toUpperCase()}

                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {member.name}
                  </p>
                  {member.role && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{member.role}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Projects */}
        <div>
          <h3 className="font-medium text-slate-900 mb-4">Active Projects</h3>
          <div className="space-y-2">
            {[
              'API Gateway',
              'Pipeline',
              'User Dashboard V2',
              'Mobile App',
              'Analytics Platform',
              'Notification System'
            ].map((project, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl hover:shadow-sm transition-all border border-blue-100/50">
                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                <span className="font-medium text-slate-900 text-sm">{project}</span>
              </div>
            ))}
          </div>
          {/* Created At */}
<div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
  <span className="font-medium text-slate-600">Created on:</span>{" "}
  {department?.created_at
    ? new Date(department.created_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—"}
</div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentSidebar;
