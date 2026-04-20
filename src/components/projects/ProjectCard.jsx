import { useNavigate } from "react-router-dom";

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  
  const {
    id,
    name,
    description,
    department,
    status = "active", 
    progress = 0,
    owner = "Unassigned",
  } = project;


  // Helper to determine status styling
  const getStatusBadge = () => {
    if (status === "delayed") return <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-50 text-red-500">DELAYED</span>;
    if (status === "risk") return <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-50 text-orange-500">AT RISK</span>;
    return <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-500">ACTIVE</span>;
  };

  return (
    <div 
      onClick={() => navigate(`/projects/${id}`)} 
      className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col gap-3"
    >
      {/* HEADER: Department and Status */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">
          {department?.toUpperCase() || "ENGINEERING"}
        </span>
        <div className="flex gap-2">
          {getStatusBadge()}
        </div>
      </div>

      {/* TITLE */}
      <h3 className="text-lg font-bold text-slate-900 leading-tight">
        {name}
      </h3>

      {/* DESCRIPTION */}
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
        {description || "No description provided."}
      </p>

      {/* PROGRESS BAR */}
      <div className="mt-2">
        <div className="flex justify-between text-xs font-semibold text-gray-400 mb-1">
          <span>Passed</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm font-semibold text-gray-400">
          {owner}
        </span>
        <span className="text-sm font-bold text-slate-900">
          {project.total_tasks || 24} <span className="text-gray-400 font-normal">TASKS</span>
        </span>
      </div>
    </div>
  );
}