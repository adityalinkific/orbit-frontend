import React, { useEffect, useState } from "react";
import MeetingModal from "../../components/meetings/MeetingModal";
import Calendar from "../../components/meetings/Calendar";
import MeetingsSidebar from "../../components/meetings/MeetingsSidebar";
import MeetingDetails from "../../components/meetings/MeetingDetails";

import {
  getAllMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
} from "../../services/meeting.service";

const Meetings = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMode, setModalMode] = useState("create");

  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const [filters, setFilters] = useState({
    status: "all",
    participant: "all",
    type: "all",
    date: "all",
  });



  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    date: "",
    startTime: "09:00",
    endTime: "10:00",
    attendees: [],
    project_id: "", 
  });

  /* ================= FETCH ================= */
  const fetchMeetings = async () => {
    try {

      const data = await getAllMeetings();

      // Transform API → UI format
      const formatted = data.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        date: m.start_time?.split("T")[0],
        startTime: m.start_time?.split("T")[1]?.slice(0, 5),
        endTime: m.end_time?.split("T")[1]?.slice(0, 5),
        participants: [],
        status: m.status,
        project_id: m.project_id,
      }));

      setMeetings(formatted);
    } catch (err) {
      console.error("Failed to fetch meetings", err);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {


      if (form.startTime >= form.endTime) {
        alert("End time must be after start time");
        return;
      }

     const payload = {
  title: form.title,
  description: form.description,

  start_time: new Date(`${form.date}T${form.startTime}`).toISOString(),
  end_time: new Date(`${form.date}T${form.endTime}`).toISOString(),

  project_id: Number(form.project_id),

  attendees: form.attendees?.map((u) => u.id),

  organizer_id: form.organizer || null,

  meeting_link: form.meetingLink || null,

  status: "Scheduled",
};


      console.log("✅ FINAL PAYLOAD", payload);

      if (modalMode === "create") {
        await createMeeting(payload);
      } else {
        await updateMeeting(form.id, payload);
      }

      await fetchMeetings();
      setShowModal(false);

    } catch (err) {
      console.error("❌ API ERROR:", err?.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleDateClick = (date, timeRange) => {
  setForm({
  title: "",
  description: "",
  date,
  startTime: timeRange?.startTime || "09:00",
  endTime: timeRange?.endTime || "10:00",
  attendees: [],
  project_id: "", 
});


  setModalMode("create");
  setShowModal(true);
};


  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await deleteMeeting(id);
      fetchMeetings();
      setSelectedMeeting(null);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  /* ================= HANDLERS ================= */
  const handleMeetingClick = (meeting) => {
    setForm(meeting);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleCreateNewClick = () => {
    setForm({
      title: "",
      description: "",
      date: "",
      startTime: "09:00",
      endTime: "10:00",
    });
    setModalMode("create");
    setShowModal(true);
  };

  /* ================= FILTER ================= */
  const filteredMeetings = meetings; // keep your existing filter logic if needed

  return (
    <div className="h-screen bg-gray-50">
      {selectedMeeting ? (
        <MeetingDetails
          meeting={selectedMeeting}
          onBack={() => setSelectedMeeting(null)}
          onDelete={() => handleDelete(selectedMeeting.id)}
          onUpdate={async (updatedData) => {
            await updateMeeting(selectedMeeting.id, updatedData);
            await fetchMeetings();
            setSelectedMeeting(null);
          }}
        />
      ) : (
        <div className="flex h-full">
          <MeetingsSidebar
            meetings={meetings}
            onMeetingClick={(m) => setSelectedMeeting(m)}
          />

          <div className="flex-1 p-6 flex flex-col">
            <Calendar
              meetings={filteredMeetings}
              filters={filters}
              setFilters={setFilters}
              onMeetingClick={handleMeetingClick}
              onScheduleClick={handleCreateNewClick}
              onDateClick={handleDateClick}
            />
          </div>
        </div>
      )}

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
  );
};

export default Meetings;
