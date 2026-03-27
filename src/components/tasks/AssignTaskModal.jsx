import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { useState } from "react";
import { assignTaskService } from "../../services/tasks.services";

export default function AssignTaskModal({ open, onOpenChange, task, reload }) {
  const [form, setForm] = useState({
    task_id: task?.id || 0,
    user_id: "",
    due_date: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.task_id || !form.user_id || !form.due_date) return;
    
    setLoading(true);
    try {
      await assignTaskService(form);
      reload();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to assign task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-xl p-8 rounded-3xl w-[500px] max-w-[90vw] shadow-2xl border border-white/50 max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
            Assign Task
          </Dialog.Title>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Task</label>
              <input
                value={task?.title || ''}
                readOnly
                className="w-full p-4 border-2 border-gray-200 rounded-2xl bg-gray-50 font-medium text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Assign To</label>
              <Select.Root onValueChange={(v) => setForm({ ...form, user_id: parseInt(v) })}>
                <Select.Trigger className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200">
                  <Select.Value placeholder="Select intern" />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="bg-white shadow-2xl rounded-2xl border border-gray-200 w-full mt-2 z-[110]">
                    <Select.Viewport>
                      <Select.Item value="1" className="px-6 py-4 hover:bg-blue-50 cursor-pointer focus:bg-blue-50 outline-none">
                        <Select.ItemText>John Doe (Intern)</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="2" className="px-6 py-4 hover:bg-blue-50 cursor-pointer focus:bg-blue-50 outline-none">
                        <Select.ItemText>Jane Smith (Intern)</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="3" className="px-6 py-4 hover:bg-blue-50 cursor-pointer focus:bg-blue-50 outline-none">
                        <Select.ItemText>Mike Johnson (Intern)</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-10 pt-8 border-t border-gray-200">
            <button 
              onClick={() => onOpenChange(false)}
              className="px-8 py-3 text-gray-700 font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !form.user_id || !form.due_date}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Assigning...
                </>
              ) : (
                'Assign Task'
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
