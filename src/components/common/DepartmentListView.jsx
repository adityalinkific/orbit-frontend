import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { ArrowUpDown, MoreHorizontal, ArrowUp, ArrowDown } from "lucide-react"

const DepartmentListView = ({
  departments,
  onEdit,
  onDelete,
  onDepartmentClick,
  sortBy,        
  onSortChange,  
}) => {
  // Sort column mappings
  const sortColumns = {
    name: "Department",
    members: "Members", 
    created: "Created"
  }

  const handleSortClick = (column) => {
    onSortChange(column)
  }

  const getSortIcon = (column) => {
    if (sortBy !== column) {
      return <ArrowUpDown size={16} className="text-gray-400" />
    }
    
    // Active sort column - show direction
    return sortBy === column ? (
      <div className="flex flex-col gap-px">
        <ArrowUpDown size={16} className="text-blue-600" />
      </div>
    ) : null
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white text-slate-900">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            {/* Department - Sortable */}
            <th 
              className="flex items-center gap-1 px-6 py-4 text-left cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSortClick('name')}
            >
              <span>Department</span>
              {getSortIcon('name')}
            </th>

            <th className="px-6 py-4 text-left">Description</th>
            
            <th className="px-6 py-4 text-left">Head</th>

            {/* Members - Sortable */}
            <th 
              className="flex items-center gap-1 px-6 py-4 text-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSortClick('members')}
            >
              <span>Members</span>
              {getSortIcon('members')}
            </th>

            <th className="px-6 py-4 text-center">Status</th>

            {/* Created - Sortable */}
            <th 
              className="flex items-center gap-1 px-6 py-4 text-left cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSortClick('created')}
            >
              <span>Created</span>
              {getSortIcon('created')}
            </th>

            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#e0e0e0]">
          {departments.map((dept) => (
            <tr
              key={dept.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onDepartmentClick(dept)}
            >
              <td className="flex items-center gap-1 px-6 py-4 font-medium">
                {dept.name}
              </td>

              <td className="px-6 py-4 text-gray-600">
                {dept.description || "—"}
              </td>

              <td className="flex items-center gap-1 px-6 py-4 text-gray-600">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4b8fe2] text-[10px] font-medium text-white">
                  {dept.department_head_name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "NA"}
                </div>
                {dept.department_head_name || "_"}
              </td>

              <td className="px-6 py-4 text-center">
                {dept.total_members ?? 0}
              </td>

              <td className="px-6 py-4 text-center">
                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                    dept.is_active
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {dept.is_active ? "active" : "inactive"}
                </span>
              </td>

              <td className="px-6 py-4 text-gray-600">
                {dept.created_at
                  ? new Date(dept.created_at).toLocaleDateString()
                  : "—"}
              </td>

              <td className="px-6 py-4 text-right">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-md p-2 hover:bg-gray-100"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      align="end"
                      sideOffset={6}
                      className="z-50 w-32 rounded-lg border bg-white p-1 shadow-xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu.Item
                        onSelect={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          onEdit(dept.id)
                        }}
                        className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-100 text-slate-900"
                      >
                        Edit
                      </DropdownMenu.Item>

                      <DropdownMenu.Item
                        onSelect={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
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
