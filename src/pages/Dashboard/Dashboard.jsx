import { useEffect, useState } from "react";
import {
  meService,
  healthService,
} from "../../services/auth.service";

import { getAllProjects } from "../../services/project.service";
import { getAllTasksService } from "../../services/tasks.services";
import { getAllMeetings } from "../../services/meeting.service";
import { getAllUsersService } from "../../services/user.service";

import useAuth from "../../hooks/useAuth";
import { Calendar } from "lucide-react";
import DashboardSkeleton from "../../components/skeletons/DashboardSkeleton";

export default function Dashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState(null);
  const [health, setHealth] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);

  const [loading, setLoading] = useState(true);




  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, healthRes, projRes, taskRes, meetRes, userRes] =
          await Promise.all([
            meService(),
            healthService(),
            getAllProjects(),
            getAllTasksService(),
            getAllMeetings(),
            getAllUsersService(),
          ]);

        setUsers(userRes?.data || []);


        setMe(meRes?.data?.data);
        setHealth(healthRes?.data || healthRes);
        setProjects(projRes || []);
        setTasks(taskRes?.data || []);
        setMeetings(meetRes || []);
      } catch (err) {
        console.error(err);
      } finally{
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <DashboardSkeleton />;

  /* ================= METRICS ================= */
  const totalProjects = projects.length;
  const totalEmployees = users.length;
  const completedProjects = projects.filter(
    (p) => p.status === "completed"
  ).length;

  const ongoingProjects = totalProjects - completedProjects;

  const completionRate =
    totalProjects > 0
      ? Math.round((completedProjects / totalProjects) * 100)
      : 0;

  /* ================= HELPERS ================= */
  const username = me?.name || user?.email || "User";

  const getRole = () => {
    const r =
      me?.role?.role || user?.role?.role || user?.role || "employee";
    return r.replace("_", " ").toUpperCase();
  };
  const colors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
];

const getColor = (i) => colors[i % colors.length];
const formatTime = (time) => {
  if (!time) return "--";
  return time.slice(0, 5);
};

const getMeetingStatus = (m) => {
  try {
    const now = new Date();

    const date = m.date || m.meeting_date;
    const time = m.startTime || m.start_time;

    if (!date || !time) return "scheduled";

    // safer parsing
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);

    const start = new Date(year, month - 1, day, hour, minute);

    let duration = 60; // default 1 hour

    if (m.repeatType && m.repeatType !== "none") {
      duration = 120; // 2 hours for repeating
    }

    const end = new Date(start.getTime() + duration * 60 * 1000);


    if (now >= start && now <= end) return "live";
    if (now > end) return "completed";
    return "scheduled";
  } catch (err) {
    console.error("Meeting status error:", err);
    return "scheduled";
  }
};

const formatDate = (date) => {
  if (!date) return "--";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getInitials = (text) => {
  if (!text) return "NA";
  const words = text.split(" ");
  return words.length > 1
    ? words[0][0] + words[1][0]
    : words[0][0];
};

const getTaskStatus = (dueDate) => {
  if (!dueDate) return "upcoming";

  const today = new Date();
  const due = new Date(dueDate);

  const diff = (due - today) / (1000 * 60 * 60 * 24);

  if (diff < 0) return "overdue";
  if (diff <= 2) return "due_soon";
  return "upcoming";
};





  return (
    <div className="p-6 bg-[#f4f7fb] min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-slate-900">
          Executive Overview
        </h1>
        <p className="text-sm text-slate-500">
          Real-time enterprise performance metrics
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Employees" value={totalEmployees} />
        <StatCard title="Completed Projects" value={completedProjects} />
        <StatCard title="Ongoing Projects" value={ongoingProjects} />

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Completion Rate</p>
          <h2 className="text-2xl font-semibold mt-1">
            {completionRate}%
          </h2>
          <div className="w-full h-2 bg-slate-200 rounded-full mt-2">
            <div
              className="h-2 bg-blue-500 rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-3 gap-6">
        {/* PROJECT PROGRESS */}
        <div className="col-span-2 bg-white rounded-xl p-5 shadow-sm">
          <div className="flex justify-between mb-4">
            <h3 className="font-medium text-slate-900">
              Project Progress
            </h3>
            <span className="text-xs font-medium text-blue-500 cursor-pointer">
              Full Analytics
            </span>
          </div>

          {projects.slice(0, 5).map((p, i) => {
            const percent =
              p.progress || Math.floor(Math.random() * 100);

            return (
              <div key={i} className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className={`bg-blue-50 text-white ${getColor(i)} opacity-[0.9] font-medium  px-2 py-0.5 rounded-sm text-xs`}>
                    {p.name || "PROJECT"}
                  </span>
                  <span>{percent}%</span>
                </div>

                <div className="w-full h-2 bg-slate-200 rounded-full">
                  <div
                    className={`h-2 rounded-full ${getColor(i)}`}
                    style={{ width: `${percent}%` }}
                  />

                </div>
              </div>
            );
          })}
        </div>

        {/* MEETINGS */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex justify-between mb-4">
            <h3 className="font-medium text-slate-900">
              Meetings Overview
            </h3>
            <span className="text-xs font-medium ">
              <Calendar/>
            </span>
          </div>

          {meetings.slice(0, 4).map((m, i) => {
            const status = getMeetingStatus(m);

            return (
              <div
                key={i}
                className="flex justify-between items-center mb-4 p-3 rounded-lg hover:bg-slate-50 transition"
              >
                <div>
                  <p className="font-medium text-sm text-slate-800">
                    {m.title || "Meeting"}
                  </p>

                  <p className="text-xs text-slate-400">
                    {new Date(m.meeting_date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-semibold text-slate-900">
                    {formatTime(m.start_time)}
                  </span>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-sm font-medium ${
                      status === "live"
                        ? "bg-green-100 text-green-700"
                        : status === "completed"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {status.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}


          <button className="w-full cursor-pointer mt-2 text-sm bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition font-medium">
            View All Meetings →
          </button>

                  </div>
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        {/* TASKS */}
       {/* TASKS - DEADLINE APPROACHING */}
        <div className="col-span-2 bg-white rounded-xl p-5 shadow-sm">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-slate-900">
              Deadline Approaching
            </h3>
            <button className="text-xs font-medium text-blue-500 cursor-pointer">
              View All
            </button>
          </div>

          {/* TASK LIST */}
          <div className="space-y-6">
            {tasks.slice(0, 4).map((task, i) => {
              const status = getTaskStatus(task.due_date);
              const initials = getInitials(task.title);

              return (
                <div
                  key={i}
                  className="flex items-center justify-between"
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-3">
                    {/* AVATAR */}
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 text-sm font-semibold">
                      {initials}
                    </div>

                    {/* TEXT */}
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        Due: {formatDate(task.due_date)}
                      </p>
                    </div>
                  </div>

                  {/* STATUS BADGE */}
                  <StatusBadge status={status} />
                </div>
              );
            })}
          </div>
        </div>


        {/* APPROVAL / HEALTH */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-slate-700">
              System Health
            </h3>
          </div>

          <p className="text-sm">
            Status:{" "}
            <span className="font-medium">
              {health?.status || "OK"}
            </span>
          </p>
          <p className="text-sm text-slate-500">
            Service: Auth API
          </p>
        </div>
      </div>

      {/* AI INSIGHTS */}
      <div className="mt-6 rounded-xl p-6 text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md">
        <h3 className="font-semibold mb-3">
          ✨ AI Business Insights
        </h3>

        <ul className="text-sm space-y-1 mb-3">
          <li>• Productivity increased this week</li>
          <li>• Engineering team has highest workload</li>
          <li>• Tasks at risk detected</li>
        </ul>

        <button className="bg-white text-black px-4 py-2 rounded-lg text-sm">
          View Detailed Insights
        </button>
      </div>
    </div>
  );
}

/* ================= COMPONENT ================= */
/* ================= COMPONENTS ================= */

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-xs font-semibold  text-slate-500">{title}</p>
      <h2 className="text-2xl font-semibold mt-1">{value}</h2>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    overdue: "bg-red-100 text-red-600",
    due_soon: "bg-orange-100 text-orange-600",
    upcoming: "bg-blue-100 text-blue-600",
  };

  const labels = {
    overdue: "OVERDUE",
    due_soon: "DUE SOON",
    upcoming: "UPCOMING",
  };

  return (
    <span
      className={`text-xs px-3 py-1 rounded-sm font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

