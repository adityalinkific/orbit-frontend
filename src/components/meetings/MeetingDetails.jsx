import {
  Clock,
  Calendar,
  Pencil,
  Trash2,
  Video,
  Copy,
  FileText,
  Sparkles,
  CheckCircle2,
  Users,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import MeetingModal from "./MeetingModal"; 
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import toast from "react-hot-toast";


const MeetingDetails = ({ meeting, onBack, onDelete, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState(meeting);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!meeting) return null;

  const formatTimeToUTCString = (time) => {
  const [hours, minutes] = time.split(":").map(Number);

  const date = new Date();
  date.setUTCHours(hours);
  date.setUTCMinutes(minutes);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);

  return date.toISOString().split("T")[1];
};


  // Sync form when opening modal
const handleEditClick = () => {
  setForm({
    ...meeting,

    attendees: meeting.participants || [],

    organizer: meeting.organizer_id || "",

    meetingLink: meeting.meeting_link || "",

    generateLink: Boolean(meeting.meeting_link),
  });

  setIsModalOpen(true);
};


const handleUpdateSubmit = async (formData) => {
  try {
    setIsSaving(true);


    const payload = {
      title: formData.title,
      description: formData.description,

      meeting_date: formData.date,

      start_time: formatTimeToUTCString(formData.startTime),

      project_id: Number(formData.project_id) || 0,

      status: "Scheduled",

      organizer_id: Number(formData.organizer) || 0,

      attendee_user_ids:
        formData.attendees?.map((p) => Number(p.id)) || [],

      attendee_emails:
        formData.attendees?.map((p) => p.email).filter(Boolean) || [],

      generate_meeting_link: Boolean(formData.generateLink),

      meeting_link: formData.generateLink ? formData.meetingLink : "",
    };

    await onUpdate(payload);
    toast.dismiss();
    toast.success("Meeting updated successfully ✨");
    setIsModalOpen(false);
  } catch (err) {
    console.error("Update failed:", err);
    toast.error("Update failed ❌");
  } finally {
    setIsSaving(false);
  }
};


const copyLink = () => {
  if (meeting.meetingLink) {
    navigator.clipboard.writeText(meeting.meetingLink);
    toast.success("Link copied 📋");
  } else {
    toast.error("No link available");
  }
};

  const now = new Date();
  const start = new Date(`${meeting.date}T${meeting.startTime}`);

  let end;

  if (meeting.repeatType && meeting.repeatType !== "none") {
    // 🔁 repeating → 2 hours window
    end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  } else {
    // ⏱️ one-time → 1 hour
    end = new Date(start.getTime() + 60 * 60 * 1000);
  }

  let isLive = false;

  if (meeting.repeatType && meeting.repeatType !== "none") {
    // repeating → check daily window
    const todayStart = new Date();
    todayStart.setHours(start.getHours(), start.getMinutes(), 0, 0);

    const todayEnd = new Date(todayStart.getTime() + 2 * 60 * 60 * 1000);

    isLive = now >= todayStart && now <= todayEnd;
  } else {
    // one-time
    isLive = now >= start && now <= end;
  }


const handleJoinMeeting = () => {
  if (!meeting.meetingLink) {
    toast.error("No meeting link available");
    return;
  }

  window.open(meeting.meetingLink, "_blank", "noopener,noreferrer");
};

let isUpcoming = false;
let isEnded = false;

if (meeting.repeatType && meeting.repeatType !== "none") {
  const todayStart = new Date();
  todayStart.setHours(start.getHours(), start.getMinutes(), 0, 0);

  const todayEnd = new Date(todayStart.getTime() + 2 * 60 * 60 * 1000);

  isUpcoming = now < todayStart;
  isEnded = now > todayEnd;
} else {
  isUpcoming = now < start;
  isEnded = now > end;
}


const getButtonState = () => {
  if (isLive) {
    return {
      label: "Join Now",
      className:
        "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200",
      disabled: false,
    };
  }

  if (isUpcoming) {
    return {
      label: "Starts Soon",
      className:
        "bg-gray-200 text-gray-600 cursor-not-allowed",
      disabled: true,
    };
  }

  return {
    label: "Meeting Ended",
    className:
      "bg-gray-100 text-gray-400 cursor-not-allowed",
    disabled: true,
  };
};

const btnState = getButtonState();






  return (
    <div className="min-h-screen bg-[#f8fafc] p-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <span onClick={onBack} className="cursor-pointer hover:text-blue-600 transition-colors">
          Meetings
        </span>
        <span>/</span>
        <span className="text-gray-900 font-medium">{meeting.title}</span>
      </nav>

      {/* HEADER SECTION */}
      <header className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm mb-8 flex justify-between items-center">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {meeting.title}
            </h1>
            {isLive && (
              <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse border border-blue-100">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                LIVE NOW
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-6 text-gray-600">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <Calendar size={18} className="text-blue-500" />
              <span className="text-sm font-medium">
                {new Date(meeting.date).toLocaleDateString('en-US', { 
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <Clock size={18} className="text-blue-500" />
              <span className="text-sm font-medium">
                {meeting.startTime} 

              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleEditClick}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700"
          >
            <Pencil size={16} />
            Edit
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            className="p-2.5 border cursor-pointer border-red-100 text-red-500 rounded-xl hover:bg-red-50 transition-all"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={handleJoinMeeting}
            disabled={btnState.disabled || !meeting.meetingLink}
            className={`px-6 py-2 rounded-xl  flex items-center gap-2 transition-all font-semibold ${btnState.className}`}
          >
            <Video size={18} />
            {btnState.label}
          </button>

                  </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-6">
              <FileText size={20} className="text-blue-500" />
              Meeting Agenda & Notes
            </h3>
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {meeting.description || "No specific agenda has been set for this meeting."}
              </p>
            </div>
          </section>

          <section className="bg-gradient-to-br from-white to-blue-50/30 border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-6">
              <Sparkles size={20} className="text-amber-500" />
              AI Insights
            </h3>
            <p className="text-sm text-gray-600 italic bg-white/50 p-4 rounded-xl border border-blue-100">
              {meeting.aiSummary || "The AI is currently processing the transcript to generate insights..."}
            </p>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Users size={20} className="text-blue-500" />
                Participants
              </h3>
              <span className="text-slate-700 text-xs font-bold px-2 py-1 rounded-md">
                {meeting.participants?.length || 0} Total
              </span>
            </div>

            <div className="space-y-4">
              {(meeting.participants || meeting.attendees || []).map((p) => (
                <div key={p.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-blue-100">
                      {p.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.role || "Team Member"}</p>
                    </div>
                  </div>
                  <CheckCircle2 size={18} className="text-green-500" />
                </div>
              ))}
            </div>
          </section>

          <section className=" bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ExternalLink size={20} />
              Meeting Access
            </h3>
            <div className="flex items-center justify-between bg-[#f8fafc] p-3 rounded-xl border border-white/10 group">
              <span className="text-blue-300  text-sm truncate font-mono">
                {meeting.meetingLink || "No link generated"}
              </span>
              <button 
                onClick={copyLink}
                className="p-2 hover:bg-white/10 cursor-pointer rounded-lg transition-colors"
              >
                <Copy size={16} />
              </button>
            </div>
          </section>
        </div>
      </div>

      <MeetingModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        form={form}
        setForm={setForm}
        isSubmitting={isSaving}
        onSubmit={handleUpdateSubmit}
        mode="edit"
      />
      <ConfirmDeleteModal
  open={confirmOpen}
  onOpenChange={setConfirmOpen}
  isDeleting={isDeleting}
  title="Delete Meeting"
  description="This meeting will be permanently deleted. This action cannot be undone."
  onConfirm={async () => {
    try {
      setIsDeleting(true);

      await onDelete(meeting.id);

      toast.success("Meeting deleted 🗑️");
      setConfirmOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete meeting ❌");
    } finally {
      setIsDeleting(false);
    }
  }}
/>

    </div>
  );
};

export default MeetingDetails;