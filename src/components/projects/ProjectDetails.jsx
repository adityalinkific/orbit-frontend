import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Share2, Plus, Filter, MoreHorizontal, X, Zap } from "lucide-react";
import { getProjectById } from "../../services/project.service";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState("Ongoing");

  useEffect(() => {
    fetchProject();
  }, [id]);

const fetchProject = async () => {
  try {
    const data = await getProjectById(id);

    setProject({
      id: data.id,
      name: data.name,
      description: data.description,
      department_id: data.department_id,

      // ✅ REAL DATA
      completion: data.progress || 0,
      blocked: data.overdue_tasks_count || 0,
      status: getProjectStatus(data),
      lead: data.project_lead || "Unassigned",

      // ✅ DERIVED
      category: `Dept ${data.department_id}`, // improve below
      timeline: formatTimeline(data.created_at, data.updated_at),

      // ⛔ until backend APIs exist
      spillover: 0,
      tasks: [],
      team: [],
    });
  } catch (err) {
    console.error(err);
  }
};

const getProjectStatus = (p) => {
  if (p.is_completed) return "completed";
  if (p.project_health === "at_risk") return "risk";
  if (p.project_health === "delayed") return "delayed";
  return "active";
};

const formatTimeline = (start, end) => {
  if (!start || !end) return "N/A";

  const s = new Date(start).toLocaleDateString();
  const e = new Date(end).toLocaleDateString();

  return `${s} — ${e}`;
};



  if (!project) return <p className="p-6 text-gray-500">Loading project data...</p>;

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-[#111827]">
      
      {/* LEFT TASK PANEL */}
      <div className="w-[380px] bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">
              Project Tasks
            </h3>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Filter size={16} className="text-gray-400" />
            </button>
          </div>

          {/* TAB TOGGLE */}
          <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
            {["Ongoing", "Completed", "Overdue"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === tab ? "bg-white shadow-sm text-blue-600" : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {project.tasks.map((t, i) => (
              <div key={i} className="group border border-gray-100 rounded-xl p-4 hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-4 h-4 rounded-full border-2 border-gray-300 group-hover:border-blue-400" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                    <div className="flex gap-2 mt-2">
                       <span className="bg-gray-100 text-[10px] font-bold px-2 py-0.5 rounded text-gray-500 uppercase tracking-tight">{t.priority}</span>
                       <span className="text-[11px] text-gray-400 flex items-center">🕒 {t.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50/50 transition-all">
            + Add New Task
          </button>
        </div>
      </div>

      {/* RIGHT MAIN PANEL */}
      <div className="flex-1 overflow-y-auto p-10">
        
        {/* HEADER AREA */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded uppercase
                  ${project.status === "delayed" ? "bg-red-50 text-red-500" :
                    project.status === "risk" ? "bg-orange-50 text-orange-500" :
                    project.status === "completed" ? "bg-green-50 text-green-500" :
                    "bg-blue-50 text-blue-500"}
                `}
              >
                {project.status}
              </span>

            </div>
            
            <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
               <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 tracking-wide uppercase">{project.category}</span>
               <div className="flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    project.status === "completed"
                      ? "bg-green-500"
                      : project.status === "delayed"
                      ? "bg-red-500"
                      : project.status === "risk"
                      ? "bg-orange-500"
                      : "bg-blue-500"
                  }`}
                />
                {project.status.toUpperCase()}
              </div>

               <div>Lead: <span className="text-gray-600">{project.lead}</span></div>
               <div>🗓️ {project.timeline} <span className="ml-2 text-red-500 uppercase font-bold">Passed</span></div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="border border-gray-300 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              <Share2 size={16} /> Share
            </button>
            <button className="bg-[#1D4ED8] hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
              Manage Project
            </button>
          </div>
        </div>

        {/* EXECUTION HEALTH STATS */}
        <div className="mb-10">
           <h3 className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-4">Execution Health</h3>
           <div className="grid grid-cols-4 gap-5">
              <StatCard title="COMPLETION %" value={`${project.completion}%`} />
              <StatCard title="BLOCKED TASKS" value={project.blocked} isAlert={project.blocked > 0} />
              <StatCard title="SPILLOVER TASKS" value={project.spillover} />
              <StatCard title="TIMELINE STATUS" value={project.status} isAlert />
           </div>
        </div>

        {/* SCOPE & AI OPTIMIZATION */}
        <div className="grid grid-cols-1 gap-8 mb-10">
          <div>
            <h3 className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-3">Project Scope</h3>
            <p className="text-[15px] leading-relaxed text-gray-500 max-w-3xl">
              {project.description}
            </p>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 relative overflow-hidden">
             <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                  <Zap size={16} fill="white" />
                </div>
                <h4 className="text-sm font-bold text-blue-700">AI Task Optimization Available</h4>
             </div>
             <div className="flex gap-3">
                {["Break into milestones", "Estimate timeline", "Identify risks"].map(btn => (
                  <button key={btn} className="bg-white border border-blue-100 px-4 py-2 rounded-lg text-xs font-semibold text-blue-600 hover:shadow-md transition-all">
                    {btn}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* TEAM SECTION */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">Project Team</h3>
            <button className="text-xs font-bold text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-gray-50">
              <Plus size={14} /> Add Member
            </button>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            {project.team.map((member, i) => (
              <div key={i} className="flex justify-between items-center p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center font-bold text-gray-500">
                     {member.name.charAt(0)}
                   </div>
                   <div>
                     <p className="font-bold text-sm text-gray-800">{member.name}</p>
                     <p className="text-xs text-gray-400">{member.role}</p>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <span className="bg-gray-100 text-[10px] font-bold px-2 py-0.5 rounded text-gray-500 tracking-wide">{member.dept}</span>
                   <button className="text-gray-300 hover:text-red-400">
                     <X size={16} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, isAlert }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</p>
      <p className={`text-2xl font-black ${isAlert ? "text-red-500" : "text-gray-900"}`}>
        {value}
      </p>
    </div>
  );
}