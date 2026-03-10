import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { SlidersHorizontal } from "lucide-react"

const FilterDropdown = ({ filters, setFilters }) => {

  const update = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const selectClass =
    "w-full mt-1 rounded-md border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <DropdownMenu.Root>

      {/* Trigger */}
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-2 rounded-md text-sm hover:bg-gray-50 shadow-sm">
          <SlidersHorizontal className="w-4 h-4" />
          Filter
        </button>
      </DropdownMenu.Trigger>

      {/* Dropdown */}
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          className="w-72 text-slate-900 rounded-lg border border-gray-200 bg-white p-4 shadow-xl space-y-4"
        >

          {/* STATUS */}
          <div>
            <label className="text-xs font-semibold text-gray-500">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => update("status", e.target.value)}
              className={selectClass}
            >
              <option value="all">All statuses</option>
              <option value="live">Live</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* PARTICIPANTS */}
          <div>
            <label className="text-xs font-semibold text-gray-500">
              Participants
            </label>
            <select
              value={filters.participant}
              onChange={(e) => update("participant", e.target.value)}
              className={selectClass}
            >
              <option value="all">All participants</option>
              <option value="joined">Meetings I joined</option>
              <option value="hosted">Meetings I hosted</option>
            </select>
          </div>

          {/* TYPE */}
          <div>
            <label className="text-xs font-semibold text-gray-500">
              Meeting Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => update("type", e.target.value)}
              className={selectClass}
            >
              <option value="all">All types</option>
              <option value="client">Client</option>
              <option value="internal">Internal</option>
            </select>
          </div>

          {/* DATE */}
          <div>
            <label className="text-xs font-semibold text-gray-500">
              Date Range
            </label>
            <select
              value={filters.date}
              onChange={(e) => update("date", e.target.value)}
              className={selectClass}
            >
              <option value="all">All time</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
            </select>
          </div>

        </DropdownMenu.Content>
      </DropdownMenu.Portal>

    </DropdownMenu.Root>
  )
}

export default FilterDropdown
