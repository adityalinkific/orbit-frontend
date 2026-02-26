import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { MoreVertical, Users, Pencil, Trash2, Building2 } from "lucide-react"

const DepartmentCard = ({ department, onEdit, onDelete }) => {
  return (
    <div className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">

      {/* Top row */}
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Building2 />
        </div>

        {/* Hover menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="invisible rounded-lg p-1 text-gray-400 hover:bg-gray-100 group-hover:visible">
              <MoreVertical size={18} />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content
  align="end"
  className="z-50 w-36 rounded-lg border bg-white p-1 shadow-md"
>
  <DropdownMenu.Item
    onSelect={(e) => {
      e.preventDefault()
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
      <h3 className="mt-5 text-lg font-semibold text-gray-900">
        {department.name}
      </h3>

      {/* Description */}
      <p className="mt-1 text-sm text-gray-500 leading-relaxed">
        {department.description}
      </p>

      {/* Badge */}
      {department.is_core && (
        <span className="mt-3 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
          Core Department
        </span>
      )}

      {/* Divider */}
      <hr className="my-4 border-gray-200" />

      {/* Footer (STACKED like image) */}
      <div className="space-y-3 text-sm text-gray-600 ">
        <div className="flex items-center gap-2">
          <Users size={16} />
          {department.member_count} members
        </div>

        
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">
              JM
            </div>
            <span>
              Led by <span className="font-medium text-gray-800">Jamne Myres</span>
            </span>
          </div>

      </div>
    </div>
  )
}

export default DepartmentCard
