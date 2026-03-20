import { useEffect, useState } from "react";
import { TaskTabs } from "../../components/tasks/TaskTabs";
import TaskSidebar from "../../components/tasks/TaskSidebar";
import TaskDetails from "../../components/tasks/TaskDetails";
import CreateTaskModal from "../../components/tasks/CreateTaskModal";
import KanbanBoard from "../../components/tasks/KanbanBoard";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Search, Check, SquareDashedKanban, TextAlignJustify } from "lucide-react"; // Added Check and Search

// Assuming these are your service imports
import { getAllTasksService } from "../../services/tasks.services";
import { meService } from "../../services/auth.service";

const sortOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Priority", value: "all" },
];

const statusOptions = [
  { label: "Status", value: "all" },
  { label: "To Do", value: "to-do" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
];

export default function Tasks() {
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("list");
  const [tab, setTab] = useState("ongoing");

  // --- ADDED MISSING STATE ---
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("created");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadProfile();
    loadTasks();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await meService();
      setProfile(res?.data || res);
    } catch (err) {
      console.error("Profile load failed", err);
    }
  };

  const loadTasks = async () => {
    try {
      const res = await getAllTasksService();
      setTasks(res?.data || []);
    } catch (err) {
      console.error("Tasks load failed", err);
    }
  };

  return (
    <div className="bg-[#F9FBFC] min-h-screen flex flex-col">
      {/* Header - Added sticky and subtle shadow */}
      <div className="sticky top-0 z-50 flex flex-wrap bg-white justify-between items-center px-6 py-4 border-b border-gray-200 gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative w-[300px] lg:w-[450px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search tasks, people, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F3F4F6] pl-10 pr-4 py-2 rounded-xl border-transparent text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50 transition">
                {statusOptions.find((s) => s.value === status)?.label || "Status"}
                <ChevronDown size={14} />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                sideOffset={8}
                className="z-[60] w-40 rounded-xl bg-white p-1 shadow-xl border border-gray-100"
              >
                {statusOptions.map((opt) => (
                  <DropdownMenu.Item
                    key={opt.value}
                    onSelect={() => setStatus(opt.value)}
                    className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 outline-none hover:bg-blue-50 hover:text-blue-600"
                  >
                    {opt.label}
                    {status === opt.value && <Check size={14} />}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {/* Sort Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50 transition">
                {sortOptions.find((o) => o.value === sortBy)?.label || "Sort"}
                <ChevronDown size={14} />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                sideOffset={8}
                className="z-[60] w-48 rounded-xl bg-white p-1 shadow-xl border border-gray-100"
              >
                {sortOptions.map((opt) => (
                  <DropdownMenu.Item
                    key={opt.value}
                    onSelect={() => setSortBy(opt.value)}
                    className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 outline-none hover:bg-blue-50 hover:text-blue-600"
                  >
                    {opt.label}
                    {sortBy === opt.value && <Check size={14} />}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* View Switcher */}
          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-2 ${
                view === "list" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <TextAlignJustify size={14} /> List
            </button>
            <button
              onClick={() => setView("kanban")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-2 ${
                view === "kanban" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <SquareDashedKanban size={14}/> Kanban
            </button>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition shadow-md hover:shadow-lg flex items-center gap-2 active:scale-95"
          >
            Create Task
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden w-280" >
        {view === "list" ? (
          <div className="grid grid-cols-12 h-[calc(100vh-73px)]">
            {/* Sidebar Column */}
            <div className="col-span-12 lg:col-span-4 h-full bg-white border-r border-gray-200 flex flex-col">
              <div className="px-4 border-b border-gray-100 bg-white">
                <TaskTabs tab={tab} setTab={setTab} />
              </div>
              <div className="flex-1 overflow-y-auto bg-[#F9FBFC]">
                <TaskSidebar tasks={tasks} onSelect={setSelectedTask} selectedId={selectedTask?.id} />
              </div>
            </div>
            
            {/* Details Column */}
            <div className="hidden lg:block lg:col-span-8 bg-white overflow-y-auto">
              {selectedTask ? (
                <TaskDetails task={selectedTask} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-10">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                     <TextAlignJustify size={32} />
                   </div>
                   <p className="font-medium text-sm">Select a task to view details</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 overflow-x-auto h-[calc(100vh-73px)]">
            {/* <KanbanBoard tasks={tasks} /> */}
          </div>
        )}
      </div>

      <CreateTaskModal open={open} onOpenChange={setOpen} reload={loadTasks} />
    </div>
  );
}