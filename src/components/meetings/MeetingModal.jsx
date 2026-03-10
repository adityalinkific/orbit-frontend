import * as Dialog from "@radix-ui/react-dialog"
import * as Switch from "@radix-ui/react-switch"
import { X } from "lucide-react"

const inputClass =
  "mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

const MeetingModal = ({
  open,
  onOpenChange,
  form,
  setForm,
  onSubmit,
  isSubmitting = false,
  mode = "create",
}) => {
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>

        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm data-[state=open]:animate-fadeIn z-50" />

        {/* Modal */}
        <Dialog.Content className="fixed text-slate-900 left-1/2 top-1/2 z-50 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl outline-none">

          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div>
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                {mode === "edit" ? "Edit Meeting" : "Schedule Meeting"}
              </Dialog.Title>

              <p className="text-xs text-gray-500 mt-0.5">
                ORBIT Meetings • Create a new synchronization event
              </p>
            </div>

            <Dialog.Close asChild>
              <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          {/* BODY */}
          <form
            onSubmit={onSubmit}
            className="p-6 grid grid-cols-2 gap-x-6 gap-y-5"
          >

            {/* LEFT SIDE */}
            <div className="space-y-4">

              {/* Title */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Meeting Title
                </label>

                <input
                  required
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g. Q4 Strategy Review"
                  className={inputClass}
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    updateField("description", e.target.value)
                  }
                  placeholder="Add meeting agenda or notes..."
                  className={inputClass}
                />
              </div>

              {/* Organizer */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Organizer
                </label>

                <select
                  value={form.organizer}
                  onChange={(e) =>
                    updateField("organizer", e.target.value)
                  }
                  className={inputClass}
                >
                  <option>Alex Rivera</option>
                  <option>Sarah Chen</option>
                  <option>Mike Ross</option>
                </select>
              </div>

              {/* Project */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Project Association
                </label>

                <select
                  value={form.project}
                  onChange={(e) =>
                    updateField("project", e.target.value)
                  }
                  className={inputClass}
                >
                  <option>Internal Ops</option>
                  <option>Product</option>
                  <option>Marketing</option>
                </select>
              </div>

              {/* EMAIL INVITE SWITCH */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-700">
                  Send email invite
                </span>

                <Switch.Root
                  checked={form.sendInvite}
                  onCheckedChange={(val) =>
                    updateField("sendInvite", val)
                  }
                  className="relative h-5 w-9 rounded-full bg-gray-200 data-[state=checked]:bg-blue-600 outline-none"
                >
                  <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-4" />
                </Switch.Root>
              </div>

              {/* GENERATE LINK SWITCH */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  Generate meeting link
                </span>

                <Switch.Root
                  checked={form.generateLink}
                  onCheckedChange={(val) =>
                    updateField("generateLink", val)
                  }
                  className="relative h-5 w-9 rounded-full bg-gray-200 data-[state=checked]:bg-blue-600 outline-none"
                >
                  <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-4" />
                </Switch.Root>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-4">

              {/* DATE */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Select Date
                </label>

                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) =>
                    updateField("date", e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              {/* TIME */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Start Time
                  </label>

                  <input
                    type="time"
                    required
                    value={form.startTime}
                    onChange={(e) =>
                      updateField("startTime", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    End Time
                  </label>

                  <input
                    type="time"
                    required
                    value={form.endTime}
                    onChange={(e) =>
                      updateField("endTime", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              {/* ATTENDEES */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Attendees
                </label>

                <input
                  placeholder="Add attendees..."
                  value={form.attendees}
                  onChange={(e) =>
                    updateField("attendees", e.target.value)
                  }
                  className={inputClass}
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="col-span-2 flex justify-end gap-3 pt-5 border-t mt-3">

              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </Dialog.Close>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {isSubmitting
                  ? "Saving..."
                  : mode === "edit"
                  ? "Update Meeting"
                  : "Schedule Meeting"}
              </button>

            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default MeetingModal
