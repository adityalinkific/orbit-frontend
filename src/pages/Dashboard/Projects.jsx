import { Funnel, Plus, X, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllProjects,  updateProjectService, createProjectService, getDashboardMetrics } from "../../services/project.service";
import { getDepartments } from "../../services/department.service";

import ProjectCard from "../../components/projects/ProjectCard";

export default function Projects() {
  const [tab, setTab] = useState("active");
  const [openModal, setOpenModal] = useState(false);
  const [metrics, setMetrics] = useState(null);

   const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);

  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
  name: "",
  description: "",
  department_id: "",
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleEdit = (project) => {
  setEditingProject(project);
  setFormData({
    name: project.name,
    description: project.description,
    department_id: project.department_id || "",
  });
  setOpenModal(true);
};


const handleSubmit = async () => {
  try {
    if (!formData.name || !formData.department_id) {
      alert("Name & Department required");
      return;
    }

    const payload = {
      ...formData,
      department_id: Number(formData.department_id),
    };

    if (editingProject) {
      await updateProjectService(editingProject.id, payload);
      alert("Project updated successfully");
    } else {
      await createProjectService(payload);
      alert("Project created successfully");
    }

    setOpenModal(false);
    setFormData({ name: "", description: "", department_id: "" });
    setEditingProject(null);

    fetchProjects();
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};




    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();

        const formatted = data.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          department_id: p.department_id,

          
          progress: p.progress || 0,
          overdue: p.overdue_tasks_count || 0,
          owner: p.project_lead || "Unassigned",

          
          status: getProjectStatus(p),
          department: getDepartmentName(p.department_id),
          tasks: 0, // until backend gives total tasks
        }));

        setProjects(formatted);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };
  
    const formatTimeline = (start, end) => {
  if (!start || !end) return "N/A";

  const s = new Date(start).toLocaleDateString();
  const e = new Date(end).toLocaleDateString();

  return `${s} — ${e}`;
};


    const fetchDepartments = async () => {
  try {
    const data = await getDepartments();
    setDepartments(data);
  } catch (err) {
    console.error("Failed to fetch departments", err);
  }
};

  const fetchMetrics = async () => {
  try {
    const data = await getDashboardMetrics();
    setMetrics(data);
  } catch (err) {
    console.error("Failed to fetch metrics", err);
  }
};

const getProjectStatus = (p) => {
  if (p.is_completed) return "completed";

  if (p.project_health === "at_risk") return "risk";
  if (p.project_health === "delayed") return "delayed";

  return "active";
};

const getDepartmentName = (id) => {
  const dept = departments.find((d) => d.id === id);
  return dept?.name || "GENERAL";
};


useEffect(() => {
  fetchDepartments();
  fetchMetrics();
}, []);

useEffect(() => {
  if (departments.length) {
    fetchProjects();
  }
}, [departments]);




  return (
    <div className="relative z-20 min-h-screen bg-gray-50 p-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">
          Projects
        </h1>
        <p className="text-gray-500 text-sm">
          Manage and track your organization's active initiatives.
        </p>
      </div>

      {/* ACTION BAR */}
      <div className="px-6 py-4 flex gap-2 items-center">
        <div className="shadow-md rounded-sm bg-[#f1f5f9]">
          <button
            onClick={() => setTab("active")}
            className={`px-4 py-1.5 text-sm rounded-sm font-medium ${
              tab === "active"
                ? "bg-white text-blue-500"
                : "text-gray-600"
            }`}
          >
            Active
          </button>

          <button
            onClick={() => setTab("archived")}
            className={`px-4 py-1.5 text-sm rounded-sm font-medium cursor-pointer ${
              tab === "archived"
                ? "bg-white text-blue-500"
                : "text-gray-600"
            }`}
          >
            Archived
          </button>
        </div>

        <button className="flex gap-1 text-sm items-center bg-white px-4 py-1.5 font-medium rounded-sm border border-gray-300">
          <Funnel size={16} />
          Filter
        </button>

        <button
          onClick={() => setOpenModal(true)}
          className="flex gap-1 text-sm items-center px-4 py-1.5 font-medium rounded-sm bg-[#005fff] text-white cursor-pointer"
        >
          <Plus size={16} />
          Create Project
        </button>
      </div>
      {/* PROJECT GRID */}
<div className="px-6 mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  {loading ? (
    <p>Loading...</p>
  ) : (
    <>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}

      {/* ADD NEW CARD */}
      <div
        onClick={() => setOpenModal(true)}
        className="flex flex-col items-center gap-3 cursor-pointer bg-white rounded-xl border border-gray-200 p-5 text-[#64748b] shadow-sm hover:shadow-md transition"
      >
        <div className="text-3xl mb-2">+</div>
        <p className="font-medium">Start New Project</p>
        <p className="text-xs">Define a new initiative.</p>
      </div>
    </>
  )}
</div>

{/* METRICS CARDS */}
<div className=" px-6 mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
  {metrics ? (
    <>
      {/* Total Budget */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Budget</p>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">$1.24M</h2>
        <p className="text-xs text-green-600 font-medium mt-1 flex items-center">
          <span className="mr-1">↑</span> 12% vs last quarter
        </p>
      </div>

      {/* Active Projects */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Projects</p>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">{metrics.active_projects_count}</h2>
        <p className="text-xs text-gray-400 mt-1">Across 6 Departments</p>
      </div>

      {/* Avg Completion */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avg. Completion</p>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">{metrics.average_completion_percentage}%</h2>
        <p className="text-xs text-gray-400 mt-1">Historical velocity: 2.4/wk</p>
      </div>

      {/* Risk Alerts */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Risk Alerts</p>
        <h2 className="text-2xl font-bold text-red-500 mt-1">{metrics.risk_alerts_count}</h2>
        <p className="text-xs text-gray-400 mt-1">Requires attention</p>
      </div>
    </>
  ) : (
    <p className="px-6 text-sm text-gray-500">Loading metrics...</p>
  )}
</div>




      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl p-6">
            
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>

            {/* TITLE */}
            <h2 className="text-lg font-semibold text-gray-900">
              Create Project
            </h2>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Define a new enterprise initiative with its owner, scope and timeline.
            </p>

            {/* FORM */}
            <div className="space-y-4">
              
              {/* PROJECT NAME */}
              <div>
                <label className="text-xs text-gray-500 font-medium">
                  PROJECT NAME
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Project Quantum Leap"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                              </div>

              {/* ROW */}
              <div className="grid grid-cols-2 gap-4">
                
                <div>
                  <label className="text-xs text-gray-500 font-medium">
                    DEPARTMENT
                  </label>
                  <select
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleChange}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Select Dept</option>

                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>

                </div>

                <div>
                  <label className="text-xs text-gray-500 font-medium">
                    OWNER
                  </label>
                  <select className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option>Assign Owner</option>
                  </select>
                </div>
              </div>

              {/* DATE ROW */}
              <div className="grid grid-cols-2 gap-4">
                
                <div>
                  <label className="text-xs text-gray-500 font-medium">
                    START DATE
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-medium">
                    END DATE
                  </label>
                  <input
                    type="date"
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="text-xs text-gray-500 font-medium">
                  DESCRIPTION
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Brief summary..."
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />

              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenModal(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {editingProject ? "Update Project" : "Create Project"}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
