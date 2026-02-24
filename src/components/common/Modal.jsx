import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import {
  ChevronDownIcon,
  CheckIcon,
  EyeOpenIcon,
  EyeClosedIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";

export default function Modal({
  open,
  onOpenChange,
  editingUser,
  form,
  setForm,
  roles,
  departments,
  onSubmit,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />

        <Dialog.Content className="fixed text-slate-900 left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 shadow-2xl focus:outline-none">
          <div className="mb-6">
            <Dialog.Title className="text-2xl font-semibold">
              {editingUser ? "Edit User" : "Create User"}
            </Dialog.Title>
            <p className="text-sm text-slate-500 mt-1">
              Add a team member and assign role & department
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">

            {/* Name + Email */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                {editingUser
                  ? "Password (Leave empty to keep unchanged)"
                  : "Password"}
              </label>

              <div className="relative mt-2">
                <input
                  required={!editingUser}
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </button>
              </div>

              <p className="text-xs text-slate-400 mt-1">
                Must be at least 8 characters.
              </p>
            </div>

            {/* Role + Department */}
            <div className="grid grid-cols-2 gap-6">

              {/* ROLE */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Role
                </label>

                <Select.Root
                  value={form.role_id || undefined}
                  onValueChange={(value) =>
                    setForm({ ...form, role_id: value })
                  }
                >
                  <Select.Trigger className="mt-2 flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 focus:ring-2 focus:ring-blue-100">
                    <Select.Value placeholder="Select Role" />
                    <Select.Icon>
                      <ChevronDownIcon />
                    </Select.Icon>
                  </Select.Trigger>

                  <Select.Portal>
                    <Select.Content className="z-50 mt-2 text-slate-900 rounded-xl border bg-white shadow-xl">
                      <Select.Viewport className="p-2">
                        {roles.map((r) => (
                          <Select.Item
                            key={r.id}
                            value={String(r.id)}
                            className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-slate-100 outline-none"
                          >
                            <Select.ItemText>{r.role}</Select.ItemText>
                            <Select.ItemIndicator>
                              <CheckIcon />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              {/* DEPARTMENT */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Department
                </label>

                <Select.Root
                  value={form.department_id || undefined}
                  onValueChange={(value) =>
                    setForm({ ...form, department_id: value })
                  }
                >
                  <Select.Trigger className="mt-2 flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 focus:ring-2 focus:ring-blue-100">
                    <Select.Value placeholder="Select Department" />
                    <Select.Icon>
                      <ChevronDownIcon />
                    </Select.Icon>
                  </Select.Trigger>

                  <Select.Portal>
                    <Select.Content className="z-50 mt-2 text-slate-900 rounded-xl border bg-white shadow-xl">
                      <Select.Viewport className="p-2">
                        {departments.map((d) => (
                          <Select.Item
                            key={d.id}
                            value={String(d.id)}
                            className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-slate-100 outline-none"
                          >
                            <Select.ItemText>
                              {d.department || d.name}
                            </Select.ItemText>
                            <Select.ItemIndicator>
                              <CheckIcon />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={!form.role_id || !form.department_id}
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {editingUser ? "Update User" : "Create User"}
              </button>

              <Dialog.Close asChild>
                <button
                  type="button"
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
              </Dialog.Close>
            </div>

          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
