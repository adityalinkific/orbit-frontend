import { Funnel, Plus, X, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllProjects,  updateProjectService, createProjectService, getDashboardMetrics } from "../../services/project.service";
import { getDepartments } from "../../services/department.service";

import ProjectCard from "../../components/projects/ProjectCard";
import { getAllUsersService } from "../../services/user.service";
import ProjectModal from "../../components/projects/ProjectModal";
import { toast } from "react-hot-toast";


export default function Projects() {
  const [tab, setTab] = useState("active");
  const [openModal, setOpenModal] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);


   const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);

  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department_id: "",
    owner_id: "",
    start_date: "",
    end_date: "",
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
      owner_id: project.owner_id || "",
      start_date: project.start_date
        ? project.start_date.split("T")[0]
        : "",
      end_date: project.end_date
        ? project.end_date.split("T")[0]
        : "",
    });

    setOpenModal(true);
  };



  const handleSubmit = async () => {
     if (isSubmitting) return;
    try {
      if (!formData.name || !formData.department_id || !formData.owner_id) {
        toast.error("Name, Department & Owner required");
        return;
      }
       setIsSubmitting(true);
      const payload = {
        name: formData.name,
        description: formData.description,
        department_id: Number(formData.department_id),
        owner_id: Number(formData.owner_id),
        start_date: formData.start_date
          ? new Date(formData.start_date).toISOString()
          : null,
        end_date: formData.end_date
          ? new Date(formData.end_date).toISOString()
          : null,
        is_completed: false,
      };

      if (editingProject) {
        await updateProjectService(editingProject.id, payload);
        toast.success("Project updated successfully");
      } else {
        await createProjectService(payload);
        toast.success("Project created successfully");
      }

      setOpenModal(false);
      setFormData({
        name: "",
        description: "",
        department_id: "",
        owner_id: "",
        start_date: "",
        end_date: "",
      });
      setEditingProject(null);

      fetchProjects();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
    setIsSubmitting(false); 
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

const fetchUsers = async () => {
  try {
    const res = await getAllUsersService();

    setUsers(res.data || []); 

  } catch (err) {
    console.error("Failed to fetch users", err);
    setUsers([]); // fallback safety
  }
};

const handleToggleStatus = async (projectId, newStatus) => {
  try {
    // call API here
    await updateProjectService(projectId, { status: newStatus });

    // update UI
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, status: newStatus } : p
      )
    );
  } catch (err) {
    console.error(err);
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
  fetchUsers(); 
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
          onClick={() => {
            setEditingProject(null);
            setFormData({
              name: "",
              description: "",
              department_id: "",
              owner_id: "",
              start_date: "",
              end_date: "",
            });
            setOpenModal(true);
          }}

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
        <ProjectCard key={project.id} project={project}  onToggleStatus={handleToggleStatus}/>
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
      <ProjectModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingProject(null);
        }}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        departments={departments}
        users={users}
        editingProject={editingProject}
         isSubmitting={isSubmitting}
      />

    </div>
  );
}
