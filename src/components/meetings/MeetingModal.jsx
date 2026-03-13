import * as Dialog from "@radix-ui/react-dialog"
import * as Switch from "@radix-ui/react-switch"
import { X, Check, Copy } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { getAllUsersService } from "../../services/user.service"

const inputClass =
  "mt-1 w-full bg-[#f8fafc] rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"

const MeetingModal = ({
  open,
  onOpenChange,
  form,
  setForm,
  onSubmit,
  isSubmitting = false,
  mode = "create",
}) => {

  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [copied, setCopied] = useState(false)


  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  /* ---------------- MEETING LINK & EMAIL LOGIC ---------------- */
  useEffect(() => {
    if (form.generateLink && !form.meetingLink) {
      const randomId = Math.random().toString(36).substring(2, 12)
      setForm((prev) => ({ ...prev, meetingLink: `https://meet.orbit.com/${randomId}` }))
    } else if (!form.generateLink && form.meetingLink) {
      setForm((prev) => ({ ...prev, meetingLink: "" }))
    }
  }, [form.generateLink, form.meetingLink, setForm])

  const copyLink = () => {
    if (form.meetingLink) {
      navigator.clipboard.writeText(form.meetingLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleLocalSubmit = (e) => {
    e.preventDefault()

    if (form.sendInvite && form.attendees?.length > 0) {
      const emails = form.attendees.map((a) => a.email).filter(Boolean).join(",")
      if (emails) {
        const subject = encodeURIComponent(`Meeting Invite: ${form.title}`)
        const body = encodeURIComponent(
          `You are invited to a meeting.\n\n` +
          `Title: ${form.title || 'Untitled Meeting'}\n` +
          `Date: ${form.date}\n` +
          `Time: ${form.startTime} - ${form.endTime}\n` +
          (form.description ? `Agenda/Notes: ${form.description}\n` : "") +
          (form.generateLink && form.meetingLink ? `\nJoin Meeting: ${form.meetingLink}\n` : "")
        )
        window.location.href = `mailto:${emails}?subject=${subject}&body=${body}`
      }
    }

    // Call the parent's onSubmit
    if (onSubmit) onSubmit(e)
  }

  /* ---------------- FETCH USERS ---------------- */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsersService()

        // API returns { status, message, data }
        setUsers(res?.data || [])

      } catch (err) {
        console.error("Failed to fetch users", err)
      }
    }

    if (open) fetchUsers()
  }, [open])


  /* ---------------- ORGANIZERS ---------------- */
  const organizers = users.filter((u) =>
    ["admin", "superadmin", "manager"].includes(
      u.role?.role?.toLowerCase()
    )
  )

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [users, search])


  const toggleAttendee = (user) => {
    setForm((prev) => {
      const attendees = prev.attendees || []

      const exists = attendees.some((u) => u.id === user.id)

      return {
        ...prev,
        attendees: exists
          ? attendees.filter((u) => u.id !== user.id)
          : [...attendees, user],
      }
    })
  }

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ")

    if (parts.length === 1) {
      return parts[0][0]?.toUpperCase()
    }

    return (parts[0][0] + parts[1][0]).toUpperCase()
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
            onSubmit={handleLocalSubmit}
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

                <div className="relative mt-1">
                  <select
                    value={form.organizer}
                    onChange={(e) => updateField("organizer", e.target.value)}
                    className={`${inputClass} pr-10`}
                  >
                    <option value="">Select Organizer</option>

                    {organizers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.role?.role})
                      </option>
                    ))}
                  </select>

                  {/* Arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
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
              <div>
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

                {form.generateLink && form.meetingLink && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      readOnly
                      value={form.meetingLink}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 outline-none"
                    />
                    <button
                      type="button"
                      onClick={copyLink}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Copy Link"
                    >
                      {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    </button>
                  </div>
                )}
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

                {/* Selected users */}
                {form.attendees?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 mb-2">
                    {form.attendees.map((user) => (
                      <span
                        key={user.id}
                        className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 flex items-center justify-center rounded-full bg-[#4b8fe2] text-white text-[10px] font-semibold">
                            {getInitials(user.name)}
                          </div>

                          <span>{user.name}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleAttendee(user)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Search */}
                <input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full mb-2 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Users list */}
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-[#e0e0e0]">

                  {filteredUsers.map((user) => {
                    const active = form.attendees?.some((u) => u.id === user.id)

                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => toggleAttendee(user)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50
                          ${active ? "bg-blue-50" : ""}`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 flex items-center justify-center rounded-full bg-[#4b8fe2] text-white text-[10px] font-semibold">
                            {getInitials(user.name)}
                          </div>

                          <span>
                            {user.name}
                            <span className="text-xs text-gray-400 ml-1">
                              ({user.role?.role})
                            </span>
                          </span>
                        </div>


                        {active && <Check size={16} className="text-blue-600" />}
                      </button>
                    )
                  })}

                  {filteredUsers.length === 0 && (
                    <div className="p-3 text-sm text-gray-500 text-center">
                      No users found
                    </div>
                  )}
                </div>
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
