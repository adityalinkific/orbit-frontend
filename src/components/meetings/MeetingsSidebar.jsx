import React, { useState } from "react"
import { Clock } from "lucide-react"

const MeetingsSidebar = ({ meetings, onMeetingClick }) => {
  const [tab, setTab] = useState("upcoming")

  const today = new Date().toISOString().split("T")[0]

  const upcomingMeetings = meetings.filter(m => m.date >= today)
  const completedMeetings = meetings.filter(m => m.date < today)

  const data = tab === "upcoming" ? upcomingMeetings : completedMeetings

  return (
    <div className="w-[340px] flex flex-col h-screen overflow-y-auto">

      {/* Header */}
      <div className="p-6">
        <h2 className="text-xl font-medium text-gray-900">Meetings</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your professional schedule and recordings
        </p>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 flex gap-2">

        <div className="shadow-md rounded-sm bg-[#f1f5f9]">

        <button
          onClick={() => setTab("upcoming")}
          className={`px-4 py-1.5 text-sm rounded-md font-medium ${
            tab === "upcoming"
              ? "bg-[#ffffff] text-gray-900"
              : "text-gray-600"
          }`}
        >
          Upcoming
        </button>

        <button
          onClick={() => setTab("completed")}
          className={`px-4 py-1.5 text-sm rounded-md font-medium ${
            tab === "completed"
              ? "bg-[#ffffff] text-gray-900"
              : "text-gray-600"
          }`}
        >
          Completed
        </button>
        </div>

      </div>

      {/* Today label */}
      <div className="px-6 text-xs font-medium text-gray-800 mt-10 uppercase tracking-wider">
        Today, {new Date().toLocaleDateString(undefined, { month:"short", day:"numeric"})}
      </div>

      {/* Meeting list */}
      <div className="p-6 pt-3 space-y-4">
        {data.map(meeting => {

          const isLive = meeting.date === today

          return (
            <div
              key={meeting.id}
              onClick={() => onMeetingClick(meeting)}
              className="border border-[#e0e0e0] rounded-lg p-4 hover:shadow-md hover:border-[#005fff] transition bg-white cursor-pointer"
            >

              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">
                  {meeting.title}
                </h4>

                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    isLive
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {isLive ? "LIVE" : "SCHEDULED"}
                </span>
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                <Clock className="w-4 h-4" />
                {meeting.startTime} – {meeting.endTime}
              </div>

              {/* avatars */}
              <div className="flex justify-between items-center mt-4">

                <div className="flex -space-x-2">
                  {meeting.participants?.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      title={p.name}
                      className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 border flex items-center justify-center text-[10px] font-semibold"
                    >

                      {p.name?.split(" ").map(n => n[0]).join("")}
                    </div>
                  ))}

                  {meeting.participants?.length > 3 && (
                    <div className="w-7 h-7 rounded-full bg-gray-200 border flex items-center justify-center text-[10px]">
                      +{meeting.participants.length - 3}
                    </div>
                  )}
                </div>

                {isLive && (
                  <button className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-blue-700">
                    Join Now
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MeetingsSidebar
