import React, { useState } from "react"
import { FaPlus } from "react-icons/fa6"
import MeetingModal from "../../components/meetings/MeetingModal"
import Calendar from "../../components/meetings/Calendar"
import MeetingsSidebar from "../../components/meetings/MeetingsSidebar"

const MOCK_MEETINGS = [
  {
    id: 1,
    title: "Product Sync",
    date: "2026-03-05",
    startTime: "10:00",
    endTime: "11:00",
    description: "Weekly sync with product team",
  },
  {
    id: 2,
    title: "Design Review",
    date: "2026-03-09",
    startTime: "14:00",
    endTime: "15:00",
    description: "Review new mockups for dashboard",
  },
]


const Meetings = () => {
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalMode, setModalMode] = useState("create")
  const [meetings, setMeetings] = useState(MOCK_MEETINGS)
  const [filters, setFilters] = useState({
  status: "all",
  participant: "all",
  type: "all",
  date: "all",
})


const [form, setForm] = useState({
  title: "",
  description: "",
  date: "",
  startTime: "09:00",
  endTime: "10:00",
  organizer: "Alex Rivera",
  project: "Internal Ops",
  attendees: "",
  sendInvite: true,
  generateLink: true,
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

const handleDateClick = (dateStr, timeRange) => {
  setForm({
    id: undefined,
    title: "",
    description: "",
    date: dateStr,
    startTime: timeRange?.startTime || "09:00",
    endTime: timeRange?.endTime || "10:00",
    organizer: "Alex Rivera",
    project: "Internal Ops",
    attendees: "",
    sendInvite: true,
    generateLink: true,
  })

  setModalMode("create")
  setShowModal(true)
}

const filteredMeetings = meetings.filter(m => {

  const now = new Date()
  const meetingDate = new Date(`${m.date}T${m.startTime}`)

  // STATUS
  if (filters.status === "live") {
    const end = new Date(`${m.date}T${m.endTime}`)
    if (!(meetingDate <= now && end >= now)) return false
  }

  if (filters.status === "scheduled" && meetingDate < now) return false

  if (filters.status === "completed" && meetingDate > now) return false

  // TYPE
  if (filters.type !== "all" && m.type !== filters.type) return false

  // DATE RANGE
  if (filters.date === "today") {
    const today = new Date().toISOString().split("T")[0]
    if (m.date !== today) return false
  }

  if (filters.date === "week") {
    const weekLater = new Date()
    weekLater.setDate(now.getDate() + 7)
    if (!(meetingDate >= now && meetingDate <= weekLater)) return false
  }

  return true
})


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
  <div className="flex h-screen bg-gray-50">

    {/* Sidebar */}
    <MeetingsSidebar meetings={meetings} />

    {/* Main Area */}
    <div className="flex-1 p-6 flex flex-col">

      <div className="flex-1">
       <Calendar
          meetings={filteredMeetings}
          filters={filters}
          setFilters={setFilters}
          onDateClick={handleDateClick}
          onMeetingClick={handleMeetingClick}
          onScheduleClick={handleCreateNewClick}
        />


      </div>

    </div>

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