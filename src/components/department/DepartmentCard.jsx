import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { MoreVertical, Users, Pencil, Trash2, Building2 } from "lucide-react"

const DepartmentCard = ({ department, onEdit, onDelete, onClick }) => {
  return (
    <div
      className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md cursor-pointer"
      onClick={() => onClick?.(department)}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Building2 />
        </div>

        {/* Hover menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="invisible rounded-lg p-1 text-gray-400 hover:bg-gray-100 group-hover:visible"
            >
              <MoreVertical size={18} />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content
            align="end"
            className="z-50 w-36 rounded-lg  bg-white p-1 shadow-md"
            onClick={(e) => e.stopPropagation()}   
          >
            <DropdownMenu.Item
              onSelect={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onEdit()
              }}
              className="flex text-slate-900 cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-gray-100"
            >
              <Pencil size={14} />
              Edit
            </DropdownMenu.Item>

            <DropdownMenu.Item
              onSelect={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDelete()
              }}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} />
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      {/* Title */}
      <h3 className="mt-5 text-lg font-medium text-gray-900">
        {department.name}
      </h3>

      {/* Description */}
      <p className="mt-1 text-sm text-gray-500 leading-relaxed">
        {department.description}
      </p>

      {/* Core badge */}
      {department.is_core && (
        <span className="mt-3 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
          Core Department
        </span>
      )}

      <hr className="my-4 border-gray-200" />

      {/* Footer */}
      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Users size={16} />
          {department.total_members ?? department.members?.length ?? 0} members
        </div>

        {department.department_head_name ? (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4b8fe2] text-[10px] font-medium text-white">
              {department.department_head_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <span>
              Led by{" "}
              <span className="font-medium text-gray-800">
                {department.department_head_name}
              </span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-400">
            <Users size={16} />
            No team lead assigned
          </div>
        )}
      </div>
    </div>
  )
}

export default DepartmentCard
