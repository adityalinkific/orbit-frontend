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
    organizer: "",
    generateLink: false,
    meetingLink: "",
    sendInvite: false,

  });

  

  /* ================= FETCH ================= */
  const fetchMeetings = async () => {
    try {

      const data = await getAllMeetings();
      console.log(data)


      const formatted = data.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,

        date: m.meeting_date,

        startTime: m.start_time?.slice(0, 5) || "",
         repeatType: m.repeat_type || "none",

          participants:
          m.attendees?.map((a) => ({
            id: a.user?.id,
            name: a.user?.name,
            email: a.user?.email,
            status: a.status,
          })) || [],

        // optional: keep raw
        attendees:
          m.attendees?.map((a) => ({
            id: a.user?.id,
            email: a.user?.email,
            name: a.user?.name,
          })) || [],

        meetingLink: m.meeting_link || "",

        status: m.status,
        project_id: m.project_id,
        organizer_id: m.organizer_id,
      }));


      setMeetings(formatted);
    } catch (err) {
      console.error("Failed to fetch meetings", err);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const formatTimeToUTCString = (time) => {
  // time = "13:41"
  const [hours, minutes] = time.split(":").map(Number);

  const date = new Date();
  date.setUTCHours(hours);
  date.setUTCMinutes(minutes);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);

  return date.toISOString().split("T")[1]; 
  // 👉 "13:41:00.000Z"
};


  /* ================= CREATE / UPDATE ================= */
const handleSubmit = async (formData) => {
  setIsSubmitting(true);

  try {

    const payload = {
      title: formData.title,
      description: formData.description,

      meeting_date: formData.date,

      start_time: formatTimeToUTCString(formData.startTime),

      project_id: Number(formData.project_id) || 0,

      status: "Scheduled",

      organizer_id: Number(formData.organizer) || 0,

      attendee_user_ids:
        formData.attendees?.map((u) => Number(u.id)) || [],

      attendee_emails:
        formData.attendees?.map((u) => u.email).filter(Boolean) || [],

      generate_meeting_link: Boolean(formData.generateLink),

      meeting_link: formData.generateLink ? formData.meetingLink : "",
    };

    console.log("✅ FINAL PAYLOAD", payload);

    if (modalMode === "create") {
      await createMeeting(payload);
      toast.success("Meeting created 🎉");
    } else {
      await updateMeeting(formData.id, payload);
      toast.success("Meeting updated ✨");
    }

    await fetchMeetings();
    setShowModal(false);

  } catch (err) {
    console.error("❌ API ERROR:", err?.response?.data || err.message);
    toast.error("Failed to save meeting ❌");
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
