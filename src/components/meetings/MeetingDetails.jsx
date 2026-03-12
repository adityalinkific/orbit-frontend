import { Clock, Calendar, Pencil, Trash2, Video, Copy, UserPlus, NotebookText } from "lucide-react"

const MeetingDetails = ({ meeting, onBack }) => {

  const {
    title,
    date,
    startTime,
    endTime,
    description,
    participants = [],
    meetingLink,
    aiSummary,
    actionItems
  } = meeting || {}

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <span
          onClick={onBack}
          className="cursor-pointer hover:underline"
        >
          Meetings
        </span>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{title}</span>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex justify-between items-start">

        <div>
          <h1 className="text-[32px] font-medium text-gray-900">
            {title || "Untitled Meeting"}
          </h1>

          <div className="flex flex-col gap-1 mt-3 text-slate-800 text-[14px]">

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {date
                ? new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    })
                : "Date not set"}

            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {startTime && endTime
                ? `${startTime} – ${endTime}`
                : "Time not set"}
            </div>

          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">

          <button className="p-2 border cursor-pointer border-gray-200 rounded-md hover:bg-gray-100">
            <Pencil className="w-4 h-4" />
          </button>

          <button className="p-2 border cursor-pointer border-gray-200 rounded-md hover:bg-gray-100">
            <Trash2 className="w-4 h-4" />
          </button>

          {meetingLink ? (
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              <Video className="w-4 h-4" />
              Join Meeting
            </button>
          ) : (
            <button className="flex items-center gap-2 bg-gray-200 text-gray-600 px-4 py-2 rounded-md cursor-not-allowed">
              <Video className="w-4 h-4" />
              No Meeting Link
            </button>
          )}

        </div>

      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6 mt-6">

        {/* LEFT COLUMN */}
        <div className="col-span-2 space-y-6">

          {/* Meeting Notes */}
          <div className="bg-white rounded-xl border border-gray-200  p-6">

            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-1">

                <NotebookText size={16} />
              <h3 className="font-medium text-gray-900">
                Meeting Notes
              </h3>
                </div>
              <button className="text-sm cursor-pointer text-blue-600 hover:underline">
                Edit Notes
              </button>
            </div>

            {description ? (
              <p className="text-gray-600 text-sm">
                {description}
              </p>
            ) : (
              <p className="text-gray-400 text-sm">
                No meeting notes available.
              </p>
            )}

          </div>

          {/* AI Insights */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">

            <h3 className="font-medium text-gray-900 mb-4">
              ✨ AI Meeting Insights
            </h3>

            {aiSummary ? (
              <>
                <p className="text-gray-600 text-sm mb-4">
                  {aiSummary}
                </p>

                {actionItems?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 mb-2">
                      ACTION ITEMS
                    </h4>

                    <ul className="space-y-2">
                      {actionItems.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <input type="checkbox" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-400 text-sm">
                AI insights will appear here once the meeting transcript is processed.
              </p>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* Participants */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">

            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900">
                Participants ({participants.length})
              </h3>
              <button className="cursor-pointer">
                <UserPlus size={16}/>
              </button>
            </div>

            {participants.length > 0 ? (
              <div className="space-y-3">

                {participants.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3"
                  >

                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                        {p.name?.split(" ").map(n => n[0]).join("")}
                        </div>


                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {p.role?.role || "Participant"}

                      </p>
                    </div>

                  </div>
                ))}

              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                No participants added yet.
              </p>
            )}

          </div>

          {/* Meeting Access */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">

            <h3 className="font-medium text-gray-900 mb-4">
              Meeting Access
            </h3>

            {meetingLink ? (
              <div className="bg-gray-50 border rounded-md p-3 flex justify-between items-center text-sm">

                <span className="text-blue-600 truncate">
                  {meetingLink}
                </span>

                <Copy
                  className="w-4 h-4 text-gray-500 cursor-pointer"
                  onClick={() =>
                    navigator.clipboard.writeText(meetingLink)
                  }
                />

              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                No meeting link generated yet.
              </p>
            )}

          </div>

        </div>

      </div>

    </div>
  )
}

export default MeetingDetails
