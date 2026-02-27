import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { MoreHorizontal } from "lucide-react"

const DepartmentListView = ({ departments, onEdit, onDelete, onDepartmentClick }) => {
  return (
    <div className="overflow-hidden rounded-xl text-slate-900 border border-gray-200 bg-white">
      <table className="w-full text-sm">
        {/* Header */}
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-6 py-4 text-left font-medium">Department</th>
            <th className="px-6 py-4 text-left font-medium">Description</th>
            <th className="px-6 py-4 text-center font-medium">Members</th>
            <th className="px-6 py-4 text-center font-medium">Status</th>
            <th className="px-6 py-4 text-left font-medium">Created</th>
            <th className="px-6 py-4 text-right font-medium">Actions</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-[#e0e0e0]">
          {departments.map((dept) => (
            <tr key={dept.id} className="hover:bg-gray-50 cursor-pointer"
            onClick={() => onDepartmentClick?.(dept)}
            >
              {/* Department */}
              <td className="px-6 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    {dept.name?.[0]}
                  </div>
                  <span className="font-medium">{dept.name}</span>
                </div>
              </td>

              {/* Description */}
              <td className="px-6 py-4 text-gray-600 max-w-md">
                {dept.description || "—"}
              </td>

              {/* Members */}
              <td className="px-6 py-4 font-medium text-center">
                {dept.member_count ?? 0}
              </td>

              {/* Status */}
              <td className="px-6 py-4 text-center">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    dept.is_active
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {dept.is_active ? "active" : "inactive"}
                </span>
              </td>

              {/* Created */}
              <td className="px-6 py-4 text-gray-600">
                {dept.created_at
                  ? new Date(dept.created_at).toLocaleDateString()
                  : "—"}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-right">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="rounded-md p-2 hover:bg-gray-100">
                      <MoreHorizontal size={16} />
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      align="end"
                      sideOffset={6}
                      className="z-50 w-32 rounded-lg border bg-white p-1 shadow-xl"
                    >
                      <DropdownMenu.Item
                        onSelect={(e) => {
                          e.preventDefault()
                          onEdit(dept.id)
                        }}
                        className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-100 text-slate-900"
                      >
                        Edit
                      </DropdownMenu.Item>

                      <DropdownMenu.Item
                        onSelect={(e) => {
                          e.preventDefault()
                          onDelete(dept.id)
                        }}
                        className="cursor-pointer rounded-md px-3 py-2 text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DepartmentListView
