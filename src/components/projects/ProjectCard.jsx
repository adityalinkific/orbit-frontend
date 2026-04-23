import { useNavigate } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function ProjectCard({ project, onToggleStatus }) {
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

  const isArchived = status === "archived";

  const getStatusBadge = () => {
    if (status === "delayed")
      return <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-50 text-red-500">DELAYED</span>;
    if (status === "risk")
      return <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-50 text-orange-500">AT RISK</span>;
    if (status === "archived")
      return <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-500">ARCHIVED</span>;

    return <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-500">ACTIVE</span>;
  };

  return (
    <div
      onClick={() => navigate(`/projects/${id}`)}
      className="group bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col gap-3 relative"
>
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">
          {department?.toUpperCase() || "ENGINEERING"}
        </span>

        <div className="flex items-center gap-2">
          {getStatusBadge()}

          {/* 3 DOT MENU */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100 
                          opacity-0 group-hover:opacity-100 transition"
              >
                <MoreVertical size={18} />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content
              align="end"
              sideOffset={5}
              onClick={(e) => e.stopPropagation()} 
              className="z-50 bg-white border border-gray-200 rounded-md shadow-md p-1 min-w-[160px]
           data-[state=open]:animate-in data-[state=closed]:animate-out
           data-[state=open]:fade-in data-[state=closed]:fade-out"
            >

              <DropdownMenu.Item
                onClick={() => onToggleStatus(id, isArchived ? "active" : "archived")}
                className="text-sm px-3 py-2 rounded cursor-pointer hover:bg-gray-100"
              >
                {isArchived ? "Mark as Active" : "Archive Project"}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
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

      {/* PROGRESS */}
      <div className="mt-2">
        <div className="flex justify-between text-xs font-semibold text-gray-400 mb-1">
          <span>Progress</span>
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
      <div className="flex items-center  justify-between mt-2">
        <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4b8fe2] text-[10px] font-medium text-white">
              {owner
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
        <span className="text-sm font-medium text-gray-400">
          {owner}
        </span>        </div>

        <span className="text-sm font-bold text-slate-900">
          {project.total_tasks || 24}{" "}
          <span className="text-gray-400 font-normal">TASKS</span>
        </span>
      </div>
    </div>
  );
}
