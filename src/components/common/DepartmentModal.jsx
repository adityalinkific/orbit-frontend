import * as Dialog from "@radix-ui/react-dialog"
import * as Switch from "@radix-ui/react-switch"
import * as Select from "@radix-ui/react-select"
import { ChevronDown, Check } from "lucide-react"

import { X } from "lucide-react"
import { useEffect } from "react"

const DepartmentModal = ({
  open,
  onOpenChange,
  mode = "create", 
  form,
  setForm,
  onSubmit,
  errorMessage,
  setErrorMessage, 
  departments = [],  
  isSubmitting = false,
  disabled = false,
  users = [],
}) => {

  // FIXED useEffect - use 'mode' instead of 'editing'
  useEffect(() => {
    if (form.name && mode === "create" && departments.length > 0) {
      const exists = departments.some(d => 
        d.name.toLowerCase() === form.name.toLowerCase()
      )
      if (exists) {
        setErrorMessage("Department with this name already exists")
      } else {
        setErrorMessage("")  // Clear error if no duplicate
      }
    }
  }, [form.name, departments, mode, setErrorMessage])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />

        {/* Content */}
        <Dialog.Content className="fixed text-slate-900 left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#f9fafb] shadow-xl focus:outline-none">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              {mode === "edit" ? "Edit Department" : "Create Department"}
            </Dialog.Title>

            <Dialog.Close asChild>
              <button className="text-gray-500 hover:text-gray-700">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          {/* Body */}
          <form onSubmit={onSubmit} className="space-y-5 px-6 py-5">
            {errorMessage && (
              <div className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            {/* Department Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Department Name
              </label>
              <input
                  required
                    placeholder="e.g. Engineering"
                    value={form.name}
                    onChange={(e) => {
                        const trimmed = e.target.value.trimStart() // Prevent leading spaces
                        setForm({ ...form, name: trimmed })
                        if (errorMessage.includes("already exists")) {
                        setErrorMessage("")
                        }
                    }}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errorMessage.includes("exists") 
                    ? "border-red-500 bg-red-50" 
                    : "border-gray-200 bg-white focus:border-blue-500"
                }`}
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Brief description of the department"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Department Head */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Department Head
              </label>

              <Select.Root
                value={
                  form.department_head_id !== null
                    ? String(form.department_head_id)
                    : undefined
                }
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    department_head_id: Number(value),
                  })
                }
              >
                <Select.Trigger
                  className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition
                            focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                >
                  <Select.Value placeholder="Select a user" />
                  <Select.Icon className="text-gray-400">
                    <ChevronDown size={16} />
                  </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                  <Select.Content
                    position="popper"
                    sideOffset={6}
                    className="z-50 max-h-60 w-[--radix-select-trigger-width] overflow-hidden
                              rounded-lg border border-gray-200 bg-white shadow-xl"
                  >
                    <Select.Viewport className="p-1">
                      {users.map((u) => (
                        <Select.Item
                          key={u.id}
                          value={String(u.id)}   // ✅ MUST be non-empty
                          className="relative flex cursor-pointer select-none items-center justify-between
                                    rounded-md px-3 py-2 text-sm text-gray-900 outline-none
                                    data-[highlighted]:bg-gray-100"
                        >
                          <Select.ItemText>{u.name}</Select.ItemText>

                          <Select.ItemIndicator className="text-blue-600">
                            <Check size={14} />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>




            {/* Status */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-medium text-gray-900">
                Status
              </span>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {form.is_active ? "Active" : "Inactive"}
                </span>

                <Switch.Root
                  checked={form.is_active}
                  onCheckedChange={(val) =>
                    setForm({ ...form, is_active: val })
                  }
                  className="relative h-6 w-11 rounded-full bg-gray-300 data-[state=checked]:bg-blue-600 transition-colors"
                >
                  <Switch.Thumb className="block h-4 w-4 translate-x-1 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-6" />
                </Switch.Root>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm"
                >
                  Cancel
                </button>
              </Dialog.Close>

<button
  type="submit"
  disabled={isSubmitting}
  className={`rounded-lg px-5 py-2 text-sm font-medium text-white transition-all ${
    isSubmitting
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  {isSubmitting ? "Creating..." : (mode === "edit" ? "Update" : "Create")}
</button>



            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default DepartmentModal
