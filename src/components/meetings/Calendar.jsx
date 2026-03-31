
import { useState, useMemo, useRef, useCallback, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
} from 'lucide-react'
import FilterDropdown from "./FilterDropdown"

const HOURS = Array.from({ length: 16 }, (_, i) => 8 + i) // 08:00 - 23:00
const HOUR_HEIGHT = 64 // h-16 = 64px

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
]

const weekdayShort = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

const formatDateStr = (d) => {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

const formatTime12h = (timeStr) => {
  if (!timeStr) return "";
  const [hh, mm] = timeStr.split(":");
  const hour = parseInt(hh, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const dispHour = hour % 12 || 12;
  return `${dispHour}:${mm} ${ampm}`;
};

const Calendar = ({
  meetings,
  filters,
  setFilters,
  onDateClick,
  onMeetingClick,
  onScheduleClick
}) => {


  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState("week")
  const [selection, setSelection] = useState(null)
  const [now, setNow] = useState(new Date())

// update every minute
useEffect(() => {
  const interval = setInterval(() => {
    setNow(new Date())
  }, 60000)

  return () => clearInterval(interval)
}, [])

  const today = useMemo(() => new Date(), [])
  const todayStr = formatDateStr(today)

  const weekDates = useMemo(() => {
    const d = new Date(currentDate)
    const day = d.getDay()
    const mondayOffset = day === 0 ? -6 : 1 - day
    const monday = new Date(d)
    monday.setDate(d.getDate() + mondayOffset)

    return Array.from({ length: 7 }, (_, i) => {
      const nd = new Date(monday)
      nd.setDate(monday.getDate() + i)
      return nd
    })
  }, [currentDate])

  const headerLabel = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`

  const meetingsByDate = useMemo(() => {
    const map = {}
    for (const m of meetings) {
      if (!map[m.date]) map[m.date] = []
      map[m.date].push(m)
    }
    Object.values(map).forEach(list =>
      list.sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""))
    )
    return map
  }, [meetings])

  // DRAG SELECTION LOGIC - FIXED
  const gridRef = useRef(null)
  const dragStartRef = useRef(null)

  const handleGridMouseDown = useCallback((e) => {
    if (viewMode === "month") return

    const grid = gridRef.current
    if (!grid) return

    const rect = grid.getBoundingClientRect()
    const hourColWidth = 64
    const dayWidth = (rect.width - hourColWidth) / (viewMode === "day" ? 1 : 7)

    const x = e.clientX - rect.left - hourColWidth
    const scrollTop = grid.scrollTop
    const y = e.clientY - rect.top - 56 + scrollTop


    if (x < 0) return

    const dayIndex = Math.floor(x / dayWidth)
    let hourIndex = Math.floor(y / HOUR_HEIGHT)
    hourIndex = Math.max(0, Math.min(HOURS.length - 1, hourIndex))

    const selectedDate = viewMode === "day"
      ? formatDateStr(currentDate)
      : formatDateStr(weekDates[dayIndex])

    const startHour = HOURS[hourIndex]

    dragStartRef.current = {
      date: selectedDate,
      startHour,
      startIndex: hourIndex,
      dayIndex
    }

    setSelection({
      date: selectedDate,
      startHour,
      endHour: startHour,
      startIndex: hourIndex,
      endIndex: hourIndex,
      dayIndex
    })
  }, [currentDate, viewMode, weekDates])

  const handleGridMouseMove = useCallback((e) => {
    if (e.buttons !== 1 || !dragStartRef.current || viewMode === "month") return

    const grid = gridRef.current
    if (!grid) return

    const rect = grid.getBoundingClientRect()
    const scrollTop = grid.scrollTop
    const y = e.clientY - rect.top - 56 + scrollTop


    let hourIndex = Math.floor(y / HOUR_HEIGHT)
    hourIndex = Math.max(0, Math.min(HOURS.length - 1, hourIndex))
    const startIndex = dragStartRef.current.startIndex

    const minIndex = Math.min(startIndex, hourIndex)
    const maxIndex = Math.max(startIndex, hourIndex)

    setSelection({
      date: dragStartRef.current.date,
      startHour: HOURS[minIndex],
      endHour: HOURS[maxIndex] + 1, // +1 to cover full end hour
      startIndex: minIndex,
      endIndex: maxIndex,
      dayIndex: dragStartRef.current.dayIndex
    })
  }, [viewMode])

  const handleGridMouseUp = useCallback(() => {
    if (!dragStartRef.current || !selection) return

    const startTime = `${String(selection.startHour).padStart(2,"0")}:00`
    const endTime = `${String(selection.endHour).padStart(2,"0")}:00`

    onDateClick(selection.date, {
      startTime,
      endTime
    })

    setSelection(null)
    dragStartRef.current = null
  }, [selection, onDateClick])

  // navigation
  const goToToday = () => setCurrentDate(new Date())
  const prevPeriod = () => {
    if (viewMode === "day") {
      const d = new Date(currentDate)
      d.setDate(d.getDate() - 1)
      setCurrentDate(d)
    } else if (viewMode === "week") {
      const d = new Date(currentDate)
      d.setDate(d.getDate() - 7)
      setCurrentDate(d)
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }
  }
  const nextPeriod = () => {
    if (viewMode === "day") {
      const d = new Date(currentDate)
      d.setDate(d.getDate() + 1)
      setCurrentDate(d)
    } else if (viewMode === "week") {
      const d = new Date(currentDate)
      d.setDate(d.getDate() + 7)
      setCurrentDate(d)
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }
  }

  // render month grid (unchanged)
  const renderMonthGrid = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    const cells = []
    for (let i = 0; i < firstDayOfMonth; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)

    return (
      <>
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/80">
          {weekdayShort.map((day, i) => (
            <div key={day} className={`py-3.5 text-center text-[11px] font-bold uppercase tracking-wider ${i === 0 || i === 6 ? "text-gray-400" : "text-gray-500"}`}>
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-[minmax(130px,1fr)] bg-gray-100 gap-[1px]">
          {cells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} className="bg-gray-50/40 min-h-[130px] p-2" />

            const cellDate = new Date(year, month, day)
            const dateStr = formatDateStr(cellDate)
            const dayMeetings = meetingsByDate[dateStr] || []

            const isToday = dateStr === todayStr && cellDate.getMonth() === today.getMonth() && cellDate.getFullYear() === today.getFullYear()
            const isPastCell = cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())

            return (
              <div
                key={dateStr}
                onClick={() => onDateClick(dateStr)}
                className={`bg-white min-h-[130px] p-2 sm:p-3 transition-colors hover:bg-blue-50/30 cursor-pointer group flex flex-col relative ${isToday ? "ring-1 ring-inset ring-blue-500 z-10" : ""}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                    isToday ? "bg-blue-600 text-white shadow-sm shadow-blue-200" :
                    isPastCell ? "text-gray-400" :
                    "text-gray-700 group-hover:bg-gray-100"
                  }`}>
                    {day}
                  </span>
                  {dayMeetings.length > 0 && (
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${isPastCell ? "bg-gray-100 text-gray-500" : "bg-blue-100 text-blue-700"}`}>
                      {dayMeetings.length}
                    </span>
                  )}
                </div>
                <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[85px] scrollbar-hide">
                  {dayMeetings.map(m => {
                    const meetingDateTime = new Date(`${m.date}T${m.startTime || m.time}`)
                    const isMeetingPast = meetingDateTime < new Date()

                    return (
                      <div
                        key={m.id}
                        onClick={e => {
                          e.stopPropagation()
                          onMeetingClick(m)
                        }}
                        className={`px-2 py-1.5 text-xs rounded-md border text-left truncate transition-all ${
                          isMeetingPast || isPastCell
                            ? "bg-gray-50 border-gray-200/60 text-gray-500 hover:bg-gray-100 line-through decoration-gray-300"
                            : "bg-indigo-50/60 border-indigo-100 text-indigo-700 hover:bg-indigo-100 hover:shadow-sm"
                        }`}
                      >
                        <div className="font-medium truncate mb-0.5">{m.title}</div>
                        <div className={`text-[10px] flex items-center gap-1 ${
                          isMeetingPast || isPastCell ? "text-gray-400" : "text-indigo-500"
                        }`}>
                          <Clock className="w-[10px] h-[10px]" /> {formatTime12h(m.startTime || m.time)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </>
    )
  }

  // FIXED time grid with proper selection overlay
  const renderTimeGrid = () => {
    const daysToShow = viewMode === "day" ? [currentDate] : weekDates
    const currentHour = now.getHours()
const currentMinutes = now.getMinutes()

const firstHour = HOURS[0]
const lastHour = HOURS[HOURS.length - 1]

let currentTimeTop = null

if (currentHour >= firstHour && currentHour <= lastHour) {
  const hourOffset = currentHour - firstHour
  const minuteOffset = currentMinutes / 60
  currentTimeTop = (hourOffset + minuteOffset) * HOUR_HEIGHT
}


    return (
      <div 
        
        className="flex flex-col h-full relative"
        onMouseDown={handleGridMouseDown}
        onMouseMove={handleGridMouseMove}
        onMouseUp={handleGridMouseUp}
        onMouseLeave={handleGridMouseUp}
      >
        {/* Header row */}
        <div className="flex border-b border-gray-200 bg-white sticky top-0 z-20">
          <div className="w-16 border-r border-gray-100 flex items-center justify-center text-xs font-medium text-gray-400">
            Time
          </div>
          {daysToShow.map(d => {
            const dateStr = formatDateStr(d)
            const isToday = dateStr === todayStr
            return (
              <div
                key={dateStr}
                className="flex-1 text-center py-3 cursor-pointer hover:bg-blue-50/40"
                onClick={() => onDateClick(dateStr)}
              >
                <div className="text-[11px] uppercase tracking-wide text-gray-400">
                  {weekdayShort[d.getDay()]}
                </div>
                <div className={`mt-1 inline-flex items-center justify-center rounded-full w-7 h-7 text-sm font-medium ${
                  isToday ? "bg-blue-600 text-white shadow-sm shadow-blue-200" : "text-gray-700"
                }`}>
                  {d.getDate()}
                </div>
              </div>
            )
          })}
        </div>

        {/* Content area with proper positioning */}
        <div ref={gridRef} className="flex flex-1 relative overflow-y-auto">
          {/* Hours column */}
          <div className="w-16 border-r border-gray-100 bg-gray-50/60 text-[11px] text-gray-400 sticky left-0 z-10">
            {HOURS.map(h => {
              const displayHour = h % 12 || 12;
              const amPm = h >= 12 ? 'PM' : 'AM';
              return (
                <div key={h} className="h-16 flex items-start justify-center pt-1 border-b border-dashed border-gray-200/80">
                  {`${displayHour}:00 ${amPm}`}
                </div>
              );
            })}
          </div>

          {/* Days columns */}
          {daysToShow.map((d, dayIdx) => {
            const dateStr = formatDateStr(d)
            const isToday = dateStr === todayStr
            const dayMeetings = meetingsByDate[dateStr] || []

            return (
              <div
               key={dateStr} 
                className="flex-1 border-r border-gray-100 relative bg-white"
                style={{ minHeight: `${HOURS.length * HOUR_HEIGHT}px` }}
              >
                {/* Hour slots */}
                {HOURS.map((h, idx) => (
                  <div key={h} className={`h-16 border-b border-dashed border-gray-100 relative ${isToday ? "bg-blue-50/10" : ""}`}>
                    {idx === 0 && (
                      <button
                        onClick={() => onDateClick(dateStr)}
                        className="mt-2 ml-2 text-[11px] px-2 py-0.5 rounded-full bg-gray-100/70 text-gray-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                      >
                        + New
                      </button>
                    )}
                  </div>
                ))}
                {currentTimeTop !== null && isToday && (
                  <div
                    className="absolute left-0 right-0 z-40 pointer-events-none"
                    style={{ top: `${currentTimeTop}px` }}
                  >
                    <div className="relative flex items-center">

                      <div className="absolute -left-15 text-[11px] border rounded-md p-1 font-medium text-blue-500 bg-white z-50">
                        {now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                      </div>

                      <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-blue-500"></div>

                      <div className="border-t-2 border-blue-500 w-full"></div>

                    </div>
                  </div>
                )}

                {/* Meetings */}
                {dayMeetings.map(m => {
                  const [startH, startM] = (m.startTime || "00:00").split(":").map(Number)
                  const [endH, endM] = (m.endTime || "00:00").split(":").map(Number)

                  const startMinutes = startH * 60 + startM
                  const endMinutes = endH * 60 + endM
                  const durationHours = (endMinutes - startMinutes) / 60

                  const startOffsetHours = (startMinutes - HOURS[0] * 60) / 60
                  const meetingTop = Math.max(0, startOffsetHours) * HOUR_HEIGHT
                  const meetingHeight = durationHours * HOUR_HEIGHT


                  const meetingDateTime = new Date(`${m.date}T${m.startTime || m.time}`)
                  const isMeetingPast = meetingDateTime < new Date()

                  return (
                    <div
                      key={m.id}
                      className={`absolute left-2 right-2 rounded-md px-2 py-1.5 text-xs shadow-sm cursor-pointer transition-all z-30 pointer-events-auto ${
                        isMeetingPast
                          ? "bg-gray-50 text-gray-500 border border-gray-200/70 line-through"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      style={{
                      top: `${meetingTop}px`,
                      height: `${meetingHeight}px`,
                    }}

                      onClick={e => {
                        e.stopPropagation()
                        onMeetingClick(m)
                      }}
                    >
                      <div className="font-medium truncate">{m.title}</div>
                      <div className="mt-0.5 flex items-center gap-1 text-[10px] opacity-90">
                        <Clock className="w-[10px] h-[10px]" />
                        {formatTime12h(m.startTime || m.time)}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}

          {/* FIXED SELECTION OVERLAY - Now covers FULL selected tiles */}
          {selection && (
            <div
              className="absolute pointer-events-none z-20 border-2 border-dashed border-blue-400 bg-blue-100/30 rounded-lg shadow-lg"
              style={{
                left:
                  viewMode === "day"
                    ? `64px`
                    : `calc(64px + ${selection.dayIndex} * ((100% - 64px) / 7))`,
                width:
                  viewMode === "day"
                    ? `calc(100% - 64px)`
                    : `calc((100% - 64px) / 7)`,
                top: `${selection.startIndex * HOUR_HEIGHT}px`,
                height: `${(selection.endIndex - selection.startIndex + 1) * HOUR_HEIGHT}px`,
              }}
            >
              <div className="absolute -top-3 -left-3 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-br-xl flex items-center gap-1.5 shadow-lg whitespace-nowrap">
                <Plus className="w-3.5 h-3.5" />
                <span>{selection.startHour % 12 || 12}:00 {selection.startHour >= 12 ? 'PM' : 'AM'}</span>
                <span className="w-px h-3 bg-white/50 mx-1"></span>
                <span>{selection.endHour % 12 || 12}:00 {selection.endHour >= 12 ? 'PM' : 'AM'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 sm:px-6 flex items-center justify-between border-b border-gray-100 bg-white">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <CalendarIcon className="w-5 h-5" />
          </div>
          {headerLabel}
        </h2>
        <div className="flex items-center gap-3">

  {/* <FilterDropdown
    filters={filters}
    setFilters={setFilters}
  /> */}

  <button
    onClick={onScheduleClick}
    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
  >
    + Schedule Meeting
  </button>

</div>

<div className="flex items-center gap-3">

          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors border border-gray-200 hover:border-blue-100 bg-white"
          >
            Today
          </button>
          <div className="flex bg-gray-50 border border-gray-200 rounded-lg p-0.5">
            <button onClick={prevPeriod} className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextPeriod} className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="hidden sm:flex bg-gray-50 border border-gray-200 rounded-lg text-[13px] font-medium">
            {["day", "week", "month"].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-md capitalize ${
                  viewMode === mode
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:bg-white/60"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-[500px] overflow-hidden ">
        {viewMode === "month" ? renderMonthGrid() : renderTimeGrid()}
      </div>
    </div>
  )
}

export default Calendar
