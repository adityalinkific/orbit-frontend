import React, { useState } from "react"
import { FaPlus } from "react-icons/fa6"
import MeetingModal from "../../components/meetings/MeetingModal"
import Calendar from "../../components/meetings/Calendar"

const MOCK_MEETINGS = [
  {
    id: 1,
    title: "Product Sync",
    date: "2026-03-05",
    time: "10:00",
    description: "Weekly sync with product team",
    link: "https://zoom.us/j/123",
  },
  {
    id: 2,
    title: "Design Review",
    date: "2026-03-09",
    time: "14:00",
    description: "Review new mockups for dashboard",
    link: "https://zoom.us/j/456",
  },
  {
    id: 3,
    title: "All Hands",
    date: "2026-03-12",
    time: "11:00",
    description: "Monthly company update",
    link: "https://meet.google.com/abc",
  },
  {
    id: 4,
    title: "Client Pitch",
    date: "2026-03-15",
    time: "15:30",
    description: "Pitch to new prospective client",
    link: "https://zoom.us/j/789",
  }
];

const Meetings = () => {
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalMode, setModalMode] = useState("create")
  const [meetings, setMeetings] = useState(MOCK_MEETINGS)

  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    link: "",
  })

  const resetForm = () => {
    setForm({
      title: "",
      date: "",
      time: "",
      description: "",
      link: "",
    })
  }

  const handleDateClick = (dateStr) => {
    setForm({
      title: "",
      date: dateStr,
      time: "09:00",
      description: "",
      link: "",
    })
    setModalMode("create")
    setShowModal(true)
  }

  const handleMeetingClick = (meeting) => {
    setForm(meeting)
    setModalMode("edit")
    setShowModal(true)
  }

  const handleCreateNewClick = () => {
    resetForm()
    setModalMode("create")
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))

      if (modalMode === "create") {
        setMeetings([...meetings, { ...form, id: Date.now() }])
      } else {
        setMeetings(meetings.map(m => m.id === form.id ? form : m))
      }

      console.log("Meeting saved:", form)

      resetForm()
      setShowModal(false)

    } catch (error) {
      console.error("Failed to schedule meeting", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative z-20 min-h-screen bg-gray-50/50 p-8 flex flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Meetings</h1>
          <p className="text-gray-500 text-sm">Schedule and manage team meetings</p>
        </div>

        <button
          onClick={handleCreateNewClick}
          className="flex items-center text-[14px] font-medium gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-white transition-colors hover:bg-blue-700 shadow-sm"
        >
          <FaPlus /> Schedule Meeting
        </button>
      </div>

      {/* Calendar View */}
      <div className="flex-1 h-full min-h-[600px] mb-8">
        <Calendar
          meetings={meetings}
          onDateClick={handleDateClick}
          onMeetingClick={handleMeetingClick}
        />
      </div>

      {/* Meeting Modal */}
      <MeetingModal
        open={showModal}
        onOpenChange={setShowModal}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        mode={modalMode}
      />
    </div>
  )
}

export default Meetings