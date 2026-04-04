import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { useState, useEffect } from "react";
import { createTaskService } from "../../services/tasks.services";
import { getDepartments } from "../../services/department.service"; 
import { getAllUsersService } from "../../services/user.service"; 
import { Cross2Icon, ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { Plus, User, Building2, AlertCircle } from "lucide-react";
import { getAllProjects } from "../../services/project.service";
import toast from "react-hot-toast";


export default function CreateTaskModal({ open, onOpenChange, reload }) {

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    project_id: "",
    department_id: "",
    user_id: "", // For task assignment
    task_type: "daily",
    priority: "low",
    due_date: "",
  });

  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  // Fetch Dropdown Data
  useEffect(() => {
    if (open) {
    const fetchData = async () => {
      setFetchingData(true);
      try {
        const [deptData, userRes, projectRes] = await Promise.all([
  getDepartments(),
  getAllUsersService(),
  getAllProjects()
]);

setDepartments(Array.isArray(deptData) ? deptData : []);
setUsers(Array.isArray(userRes) ? userRes : userRes?.data || []);
setProjects(Array.isArray(projectRes) ? projectRes : []);



        const userList = Array.isArray(userRes) ? userRes : userRes?.data || [];
        
        setDepartments(Array.isArray(deptData) ? deptData : []);
        setUsers(userList);
        
      } catch (err) {
        console.error("Error fetching modal data:", err);
        setUsers([]); // Fallback to empty array on error
      } finally {
        setFetchingData(false);
      }
    };
    fetchData();

      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setForm(prev => ({
        ...prev,
        due_date: tomorrow.toISOString().split('T')[0]
      }));
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.department_id || !form.project_id) return;

    const toastId = toast.loading("Creating task...");
    setLoading(true);
    try {
      await createTaskService({
        title: form.title.trim(),
        description: form.description,
        project_id: Number(form.project_id),
        department_id: Number(form.department_id),
        task_type: form.task_type.toLowerCase(), 
        priority: form.priority.toLowerCase(),
        due_date: form.due_date
      });
       toast.success("Task created successfully", { id: toastId });

      reload();
      onOpenChange(false);
      resetForm();

    } catch (error) {
      toast.error("Failed to create task", { id: toastId });
      console.error("Failed to create task:", error?.response?.data || error);
    } finally {
      setLoading(false);
    }
  };


  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      project_id: "",
      department_id: "",
      user_id: "",
      task_type: "daily",
      priority: "low",
      due_date: "",
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] animate-in fade-in duration-200" />
        <Dialog.Content className="fixed text-slate-900 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-7 rounded-2xl w-[550px] max-w-[95vw] shadow-2xl z-[101] border border-slate-200 focus:outline-none overflow-y-auto max-h-[90vh]">
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <Dialog.Title className="text-xl font-bold text-slate-900">Create New Task</Dialog.Title>
              <Dialog.Description className="text-sm text-slate-500 mt-1">Assign tasks to departments and team members.</Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"><Cross2Icon className="w-5 h-5" /></button>
            </Dialog.Close>
          </div>

          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Task Title *</label>
              <input
                placeholder="Describe the task..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Description</label>
              <textarea
                placeholder="Add more details..."
                rows={3}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                Project *
              </label>

              <Select.Root
                value={form.project_id || undefined}
                onValueChange={(v) => setForm({ ...form, project_id: v })}
              >
                <Select.Trigger className="flex items-center justify-between w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                  <Select.Value placeholder="Select Project" />
                  <ChevronDownIcon />
                </Select.Trigger>

                <Select.Portal>
                  <Select.Content className="bg-white text-slate-500 shadow-xl rounded-xl border border-slate-200 z-[110]">
                    <Select.Viewport className="p-1">
                      {projects.map((proj) => (
                        <Select.Item
                          key={proj.id}
                          value={proj.id.toString()}
                          className="px-3 py-2 text-sm rounded-lg hover:bg-slate-50"
                        >
                          <Select.ItemText>{proj.name}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>


            {/* Department & User Assignment */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Department *</label>
                <Select.Root value={form.department_id || undefined} onValueChange={(v) => setForm({ ...form, department_id: v })}>
                  <Select.Trigger className="flex items-center justify-between w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none">
                    <Select.Value placeholder="Select Dept" />
                    <ChevronDownIcon className="text-slate-400" />
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="bg-white text-slate-500 shadow-xl rounded-xl border border-slate-200 z-[110]">
                      <Select.Viewport className="p-1">
                        {departments.map((dept) => (
                          <Select.Item key={dept.id} value={dept.id.toString()} className="flex items-center px-3 py-2 text-sm rounded-lg cursor-pointer outline-none hover:bg-slate-50">
                            <Select.ItemText>{dept.name}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Assign To</label>
                <Select.Root value={form.user_id || undefined} onValueChange={(v) => setForm({ ...form, user_id: v })}>
                  <Select.Trigger className="flex items-center justify-between w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none">
                    <Select.Value placeholder="Select Member" />
                    <ChevronDownIcon className="text-slate-400" />
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="bg-white text-slate-500 shadow-xl rounded-xl border border-slate-200 z-[110]">
                      <Select.Viewport className="p-1">
                        {users.map((user) => (
                          <Select.Item key={user.id} value={user.id.toString()} className="flex items-center px-3 py-2 text-sm rounded-lg cursor-pointer outline-none hover:bg-slate-50">
                            <Select.ItemText>{user.name}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
            </div>

            {/* Priority, Date, Status, and Category Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              
              {/* Priority */}
              <div className="flex flex-col">
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Priority</label>
                <Select.Root value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                  <Select.Trigger className="flex items-center justify-between w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all">
                    <Select.Value />
                    <ChevronDownIcon className="text-slate-400" />
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="bg-white text-slate-900 shadow-xl rounded-xl border border-slate-200 overflow-hidden z-[110]">
                      <Select.Viewport className="p-1">
                        {[{v: 'low', c: 'text-emerald-500'}, {v: 'medium', c: 'text-amber-500'}, {v: 'high', c: 'text-red-500'}].map((p) => (
                          <Select.Item key={p.v} value={p.v} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer outline-none hover:bg-slate-50 capitalize">
                            <span className={p.c}>●</span>
                            <Select.ItemText>{p.v}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              {/* Due Date */}
              <div className="flex flex-col">
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Due Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                />
              </div>

              {/* Status */}
              <div className="flex flex-col">
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Status</label>
                <Select.Root value={form.status || "to-do"} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <Select.Trigger className="flex items-center justify-between w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all">
                    <Select.Value />
                    <ChevronDownIcon className="text-slate-400" />
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="bg-white text-slate-900 shadow-xl rounded-xl border border-slate-200 overflow-hidden z-[110]">
                      <Select.Viewport className="p-1">
                        {[{ val: "to-do", label: "To Do"}, { val: "in-progress", label: "In Progress"}, { val: "completed", label: "Completed" }].map((item) => (
                          <Select.Item key={item.val} value={item.val} className="flex items-center justify-between px-3 py-2 text-sm rounded-lg cursor-pointer outline-none hover:bg-slate-50">
                            <Select.ItemText>{item.label}</Select.ItemText>
                            <Select.ItemIndicator><CheckIcon className="text-blue-600" /></Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              {/* Task Type */}
              <div className="flex flex-col">
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Task Type</label>
                <Select.Root
                  value={form.task_type}
                  onValueChange={(v) => setForm({ ...form, task_type: v })}
                >
                  <Select.Trigger className="flex items-center justify-between w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none">
                    <Select.Value />
                    <ChevronDownIcon />
                  </Select.Trigger>

                  <Select.Portal>
                  <Select.Content
                    position="popper"
                    sideOffset={6}
                    className="z-[110] bg-white text-slate-900 shadow-xl rounded-xl border border-slate-200 overflow-hidden min-w-[var(--radix-select-trigger-width)]"
                  >
                    <Select.Viewport className="p-1">
                      {[
                        { val: "daily", label: "Daily" },
                        { val: "weekly", label: "Weekly" }
                      ].map((item) => (
                        <Select.Item
                          key={item.val}
                          value={item.val}
                          className="flex items-center px-3 py-2 text-sm rounded-lg cursor-pointer outline-none hover:bg-slate-50"
                        >
                          <Select.ItemText>{item.label}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>

                </Select.Root>

              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
            <Dialog.Close asChild>
              <button className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
            </Dialog.Close>
            <button
              onClick={handleSubmit}
              disabled={loading || !form.title.trim() || !form.department_id}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={18} />}
              Create Task
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}