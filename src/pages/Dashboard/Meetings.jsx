import React, { useEffect, useMemo, useState } from "react";
import MeetingModal from "../../components/meetings/MeetingModal";
import Calendar from "../../components/meetings/Calendar";
import MeetingsSidebar from "../../components/meetings/MeetingsSidebar";
import MeetingDetails from "../../components/meetings/MeetingDetails";
import toast from "react-hot-toast";


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


      const formatted = data.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,

        date: m.meeting_date,

        startTime: m.start_time?.split("T")[1]?.slice(0, 5) || "",
        endTime: m.end_time?.split("T")[1]?.slice(0, 5) || "",

        attendees: m.attendee_user_ids?.map((id) => ({ id })) || [],

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
         toast.error("End time must be after start time");
         setIsSubmitting(false);
        return;
      }

const payload = {
  title: form.title,
  description: form.description,

  meeting_date: form.date,

  start_time: new Date(`${form.date}T${form.startTime}`).toISOString(),
  end_time: new Date(`${form.date}T${form.endTime}`).toISOString(),

  project_id: Number(form.project_id) || 0,

  status: "Scheduled",

  meeting_link: form.generateLink ? form.meetingLink : "",

  organizer_id: form.organizer ? Number(form.organizer) : 0,

  attendee_user_ids: form.attendees?.map((u) => Number(u.id)) || [],

  attendee_emails:
    form.attendees?.map((u) => u.email).filter(Boolean) || [],
  generate_meeting_link: Boolean(form.generateLink),
};




      console.log("✅ FINAL PAYLOAD", payload);

      if (modalMode === "create") {
        await createMeeting(payload);
        toast.success("Meeting created successfully 🎉");
      } else {
        await updateMeeting(form.id, payload);
        toast.success("Meeting updated successfully ✨");
      }

      await fetchMeetings();
      setShowModal(false);

    } catch (err) {
      console.error("❌ API ERROR:", err?.response?.data || err.message);
      toast.error("Something went wrong ❌");
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
      toast.success("Meeting deleted 🗑️");
      fetchMeetings();
      setSelectedMeeting(null);
    } catch (err) {
      console.error("Delete failed", err);
       toast.error("Delete failed ❌");
    }
  };

  /* ================= HANDLERS ================= */
  const handleMeetingClick = (meeting) => {
    setForm({
    ...meeting,
    organizer: meeting.organizer_id || "",
    meetingLink: meeting.meeting_link || "",
    generateLink: Boolean(meeting.meeting_link),
  });
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
  const filteredMeetings = useMemo(() => {
  return meetings.filter((m) => {
    // STATUS FILTER
    if (filters.status !== "all" && m.status !== filters.status) {
      return false;
    }

    // TYPE FILTER (if you add type later)
    if (filters.type !== "all" && m.type !== filters.type) {
      return false;
    }

    // DATE FILTER
    if (filters.date !== "all") {
      const today = new Date();
      const meetingDate = new Date(m.date);

      if (filters.date === "today") {
        if (meetingDate.toDateString() !== today.toDateString()) return false;
      }

      if (filters.date === "upcoming") {
        if (meetingDate < today) return false;
      }

      if (filters.date === "past") {
        if (meetingDate >= today) return false;
      }
    }

    // PARTICIPANT FILTER (if attendees exist)
    if (filters.participant !== "all") {
      const hasUser = m.attendees?.some(
        (u) => u.id === filters.participant
      );
      if (!hasUser) return false;
    }

    return true;
  });
}, [meetings, filters]);


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
