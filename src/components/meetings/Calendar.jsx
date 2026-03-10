import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users } from 'lucide-react';

const Calendar = ({ meetings, onDateClick, onMeetingClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const today = new Date();

    // Navigation
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };
    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };
    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Generate days array
    const days = [];
    // Add empty slots for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    // Helper to format date for matching
    const formatDateStr = (year, month, day) => {
        const d = new Date(year, month, day);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full mt-6">
            {/* Header with month navigation */}
            <div className="p-4 sm:px-6 flex items-center justify-between border-b border-gray-100 bg-white">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2.5">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <CalendarIcon className="w-5 h-5" />
                    </div>
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex items-center gap-3">
                    <button
                        onClick={goToToday}
                        className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors border border-gray-200 hover:border-blue-100 bg-white"
                    >
                        Today
                    </button>
                    <div className="flex bg-gray-50 border border-gray-200 rounded-lg p-0.5">
                        <button onClick={prevMonth} className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={nextMonth} className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition-all">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/80">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                    <div key={day} className={`py-3.5 text-center text-[11px] font-bold uppercase tracking-wider ${i === 0 || i === 6 ? 'text-gray-400' : 'text-gray-500'}`}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 auto-rows-[minmax(130px,1fr)] bg-gray-100 gap-[1px]">
                {days.map((day, index) => {
                    if (!day) return <div key={`empty-${index}`} className="bg-gray-50/40 min-h-[130px] p-2" />;

                    const dateStr = formatDateStr(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const dayMeetings = meetings.filter(m => m.date === dateStr);

                    // Check if today
                    const isToday = day === today.getDate() &&
                        currentDate.getMonth() === today.getMonth() &&
                        currentDate.getFullYear() === today.getFullYear();

                    // Check if past
                    const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const isPastCell = cellDate < new Date(today.setHours(0, 0, 0, 0));

                    return (
                        <div
                            key={day}
                            onClick={() => onDateClick(dateStr)}
                            className={`bg-white min-h-[130px] p-2 sm:p-3 transition-colors hover:bg-blue-50/30 cursor-pointer group flex flex-col relative
                 ${isToday ? 'ring-1 ring-inset ring-blue-500 z-10' : ''}`}
                        >
                            {/* Day Header */}
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full transition-colors 
                   ${isToday ? 'bg-blue-600 text-white shadow-sm shadow-blue-200' :
                                        isPastCell ? 'text-gray-400' :
                                            'text-gray-700 group-hover:bg-gray-100'}`}
                                >
                                    {day}
                                </span>
                                {dayMeetings.length > 0 && (
                                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${isPastCell ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-700'}`}>
                                        {dayMeetings.length}
                                    </span>
                                )}
                            </div>

                            {/* Meetings List */}
                            <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[85px] scrollbar-hide">
                                {dayMeetings // Sort by time
                                    .sort((a, b) => a.time.localeCompare(b.time))
                                    .map(meeting => {

                                        const meetingDateTime = new Date(`${meeting.date}T${meeting.time}`);
                                        const isMeetingPast = meetingDateTime < new Date();

                                        return (
                                            <div
                                                key={meeting.id}
                                                onClick={(e) => { e.stopPropagation(); onMeetingClick(meeting); }}
                                                className={`px-2 py-1.5 text-xs rounded-md border text-left truncate transition-all ${isMeetingPast || isPastCell
                                                        ? 'bg-gray-50 border-gray-200/60 text-gray-500 hover:bg-gray-100 line-through decoration-gray-300'
                                                        : 'bg-indigo-50/60 border-indigo-100 text-indigo-700 hover:bg-indigo-100 hover:shadow-sm'
                                                    }`}
                                            >
                                                <div className="font-medium truncate mb-0.5" style={{ textDecorationStyle: 'solid' }}>{meeting.title}</div>
                                                <div className={`text-[10px] flex items-center gap-1 ${isMeetingPast || isPastCell ? 'text-gray-400' : 'text-indigo-500'}`}>
                                                    <Clock className="w-[10px] h-[10px] flex-shrink-0" /> {meeting.time}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Calendar;
