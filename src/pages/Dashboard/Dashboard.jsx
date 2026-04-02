import { useEffect, useState } from "react";
import {
  meService,
  healthService,
} from "../../services/auth.service";

import { getAllProjects } from "../../services/project.service";
import { getAllTasksService } from "../../services/tasks.services";
import { getAllMeetings } from "../../services/meeting.service";

import useAuth from "../../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  const [me, setMe] = useState(null);
  const [health, setHealth] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, healthRes, projRes, taskRes, meetRes] =
          await Promise.all([
            meService(),
            healthService(),
            getAllProjects(),
            getAllTasksService(),
            getAllMeetings(),
          ]);

        setMe(meRes?.data?.data);
        setHealth(healthRes?.data || healthRes);
        setProjects(projRes || []);
        setTasks(taskRes?.data || []);
        setMeetings(meetRes || []);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  /* ================= METRICS ================= */
  const totalProjects = projects.length;
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

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800">
          Executive Overview
        </h1>
        <p className="text-sm text-slate-500">
          Real-time enterprise performance metrics
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Projects" value={totalProjects} />
        <StatCard title="Completed Projects" value={completedProjects} />
        <StatCard title="Ongoing Projects" value={ongoingProjects} />

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500">Completion Rate</p>
          <h2 className="text-lg font-semibold mt-1">
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
            <h3 className="font-semibold text-slate-700">
              Project Progress
            </h3>
            <span className="text-sm text-blue-500 cursor-pointer">
              Full Analytics
            </span>
          </div>

          {projects.slice(0, 5).map((p, i) => {
            const percent =
              p.progress || Math.floor(Math.random() * 100);

            return (
              <div key={i} className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs">
                    {p.name || "PROJECT"}
                  </span>
                  <span>{percent}%</span>
                </div>

                <div className="w-full h-2 bg-slate-200 rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
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
            <h3 className="font-semibold text-slate-700">
              Meetings Overview
            </h3>
          </div>

          {meetings.slice(0, 3).map((m, i) => (
            <div
              key={i}
              className="flex justify-between items-center mb-4"
            >
              <div>
                <p className="font-medium text-sm">
                  {m.title || "Meeting"}
                </p>
                <p className="text-xs text-slate-400">
                  {m.location || "Room"}
                </p>
              </div>
              <span className="text-xs text-slate-500">
                {m.time || "--"}
              </span>
            </div>
          ))}

          <button className="w-full mt-2 text-sm bg-slate-100 py-2 rounded-lg hover:bg-slate-200">
            View All Meetings
          </button>
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        {/* TASKS */}
        <div className="col-span-2 bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold mb-4 text-slate-700">
            Tasks Overview
          </h3>

          {tasks.slice(0, 4).map((t, i) => (
            <div
              key={i}
              className="flex justify-between mb-3 text-sm"
            >
              <span>{t.title}</span>
              <span className="text-blue-500">{t.status}</span>
            </div>
          ))}
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
function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-xs text-slate-500">{title}</p>
      <h2 className="text-lg font-semibold mt-1">{value}</h2>
    </div>
  );
}
