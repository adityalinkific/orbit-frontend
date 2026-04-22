import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export default function ProjectModal({
  open,
  onClose,
  onSubmit,
  formData,
  setFormData,
  departments,
  users,
  editingProject,
  isSubmitting,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        {/* OVERLAY */}
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />

        {/* MODAL */}
        <Dialog.Content className="fixed z-50 text-slate-900 top-1/2 left-1/2 w-[95%] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 shadow-2xl">

          {/* CLOSE */}
          <Dialog.Close asChild>
            <button className="absolute right-5 top-5 text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </Dialog.Close>

          {/* HEADER */}
          <Dialog.Title className="text-xl font-semibold text-gray-900">
            {editingProject ? "Edit Project" : "Create Project"}
          </Dialog.Title>

          <Dialog.Description className="text-sm text-gray-500 mt-1 mb-6">
            Define a new enterprise initiative with its owner, scope and timeline.
          </Dialog.Description>

          {/* FORM */}
          <div className="space-y-5">

            {/* PROJECT NAME */}
            <div>
              <label className="text-[11px] font-semibold text-gray-400 tracking-wide uppercase">
                Project Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Project Quantum Leap"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* DEPARTMENT + OWNER */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase">
                  Department
                </label>
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none"
                >
                  <option value="">Select Dept</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase">
                  Owner
                </label>
                <select
                  name="owner_id"
                  value={formData.owner_id}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none"
                >
                  <option value="">Assign Owner</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name || u.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* DATES */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase">
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Brief summary..."
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end items-center gap-3 mt-8 pt-5 border-t border-gray-100">
            <Dialog.Close asChild>
              <button className="text-sm text-gray-500 hover:text-gray-700">
                Cancel
              </button>
            </Dialog.Close>

            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className={`text-sm px-5 py-2 rounded-sm font-medium shadow-sm transition
                ${
                  isSubmitting
                    ? "bg-gray-300 cursor-not-allowed text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }
              `}
            >
              {isSubmitting
                ? editingProject
                  ? "Updating..."
                  : "Creating..."
                : editingProject
                ? "Update Project"
                : "Create Project"}
            </button>

          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
