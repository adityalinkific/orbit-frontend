import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Search, ChevronDown, LayoutGrid, List, Check } from "lucide-react"

const sortOptions = [
  { label: "Sort by Name", value: "name" },
  { label: "Sort by Members", value: "members" },
  { label: "Sort by Created", value: "created" },
]

const statusOptions = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
]

const DepartmentsToolbar = ({
  search,
  setSearch,
  status,
  setStatus,
  sortBy,
  setSortBy,
  view,
  setView,
}) => {
  return (
    <div className="relative z-20 mb-6 flex flex-wrap items-center justify-between gap-4 text-slate-900">
      {/* Left section */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search departments..."
            className="w-64 rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
              {statusOptions.find((s) => s.value === status)?.label}
              <ChevronDown size={14} />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              sideOffset={8}
              className="z-[60] w-40 rounded-xl bg-white p-1 shadow-xl text-slate-900"
            >
              {statusOptions.map((opt) => (
                <DropdownMenu.Item
                  key={opt.value}
                  onSelect={(e) => {
                    e.preventDefault()
                    setStatus(opt.value)
                  }}
                  className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                >
                  {opt.label}
                  {status === opt.value && <Check size={14} />}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Sort */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
              {sortOptions.find((o) => o.value === sortBy)?.label}
              <ChevronDown size={14} />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              sideOffset={8}
              className="z-[60] w-48 rounded-xl bg-white p-1 shadow-xl text-slate-900"
            >
              {sortOptions.map((opt) => (
                <DropdownMenu.Item
                  key={opt.value}
                  onSelect={(e) => {
                    e.preventDefault()
                    setSortBy(opt.value)
                  }}
                  className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                >
                  {opt.label}
                  {sortBy === opt.value && <Check size={14} />}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* View toggle */}
      <div className="flex rounded-lg border border-gray-200 bg-white">
        <button
          onClick={() => setView("grid")}
          className={`rounded-md p-2 ${
            view === "grid" ? "bg-blue-600 text-white" : "text-gray-500"
          }`}
        >
          <LayoutGrid size={16} />
        </button>
        <button
          onClick={() => setView("list")}
          className={`rounded-md p-2 ${
            view === "list" ? "bg-blue-600 text-white" : "text-gray-500"
          }`}
        >
          <List size={16} />
        </button>
      </div>
    </div>
  )
}

export default DepartmentsToolbar
