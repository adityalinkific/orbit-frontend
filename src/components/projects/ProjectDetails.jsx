import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Share2, Plus, Filter, MoreHorizontal, X, Zap, Upload, Trash2, Calendar, Eye, Trash } from "lucide-react";
import { deleteProjectService, getProjectById, updateProjectService, uploadProjectDocument } from "../../services/project.service";
import { getDepartments } from "../../services/department.service";
import { getAllUsersService } from "../../services/user.service";
import ProjectModal from "./ProjectModal";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import { toast } from "react-hot-toast";
import AddMemberModal from "./AddMemberModal";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState("Ongoing");
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [openMemberModal, setOpenMemberModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);



  const [openModal, setOpenModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department_id: "",
    owner_id: "",
    start_date: "",
    end_date: "",
  });

  const fetchDepartments = async () => {
  try {
    const data = await getDepartments();
    setDepartments(data);
  } catch (err) {
    console.error(err);
  }
};

const fetchUsers = async () => {
  try {
    const res = await getAllUsersService();
    setUsers(res.data || []);
  } catch (err) {
    console.error(err);
  }
};


  useEffect(() => {
    fetchProject();
    fetchDepartments();
    fetchUsers();
  }, [id]);

const fetchProject = async () => {
  try {
    const data = await getProjectById(id);

    setProject({
      id: data.id,
      name: data.name,
      description: data.description,
      department_id: data.department_id,
      owner_id: data.owner_id,
      start_date: data.start_date,
      end_date: data.end_date,

      completion: data.progress || 0,
      blocked: data.overdue_tasks_count || 0,
      status: getProjectStatus(data),
      lead: data.project_lead || "Unassigned",

      category: getDepartmentName(data.department_id),
      timeline: formatTimeline(data.created_at, data.updated_at),

      spillover: 0,
      tasks: [],
      team: [],
    });

    setDocuments(
  (data.documents || []).map((doc) => ({
    id: doc.id,
    file_name: doc.file_name || "Untitled",
    uploaded_by: doc.uploaded_by || "Unknown",
    created_at: doc.created_at,
    file_url: doc.file_url, 
  }))
);


  } catch (err) {
    console.error(err);
  }
};


const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    setUploading(true);

    const res = await uploadProjectDocument(project.id, file);

    const newDoc = res.data || res;

    setDocuments((prev) => [newDoc, ...prev]);


    toast.success("File uploaded successfully")

  } catch (err) {
    console.error(err);
    toast.error("Upload failed");
  } finally {
    setUploading(false);
  }
};

const handleSubmit = async () => {
  try {
    if (!formData.name || !formData.department_id || !formData.owner_id) {
      toast.error("Name, Department & Owner required");
      return;
    }

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

    await updateProjectService(project.id, payload);

    toast.success("Project updated successfully");

    setOpenModal(false);
    fetchProject(); // refresh UI
  } catch (err) {
    console.error(err);
    toast.error("Update failed");
  }
};

const handleDeleteProject = async () => {
  try {
    setIsDeleting(true);

    await deleteProjectService(project.id);

    toast.success("Project deleted");


    setDeleteOpen(false);

    // redirect after delete
    navigate("/projects"); 

  } catch (err) {
    console.error(err);
    toast.error("Delete failed");
  } finally {
    setIsDeleting(false);
  }
};

const getDepartmentName = (id) => {
  const dept = departments.find((d) => d.id === id);
  return dept?.name || "GENERAL";
};

const getProjectStatus = (p) => {
  if (p.status === "archived") return "archived";

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

const getStatusConfig = (status) => {
  const formatted = status.charAt(0).toUpperCase() + status.slice(1);

  switch (status) {
    case "completed":
      return {
        label: formatted,
        text: "text-green-600",
        bg: "bg-green-50",
      };
    case "delayed":
      return {
        label: formatted,
        text: "text-red-500",
        bg: "bg-red-50",
      };
    case "risk":
      return {
        label: "At Risk",
        text: "text-orange-500",
        bg: "bg-orange-50",
      };
      case "archived":
      return {
        label: "Archived",
        text: "text-gray-500",
        bg: "bg-gray-50",
      };
    default:
      return {
        label: formatted,
        text: "text-blue-600",
        bg: "bg-blue-50",
      };
  }
};

const handlePreview = (doc) => {
  if (!doc.file_url) {
    toast.error("No preview available");
    return;
  }

  window.open(doc.file_url, "_blank");
};

const renderPreview = (doc) => {
  if (!doc.file_url) {
    return <p className="text-gray-400">No preview available</p>;
  }

  const ext = doc.file_name.split(".").pop()?.toLowerCase();
  const url = doc.file_url;

  // 🖼️ IMAGES
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
    return (
      <img
        src={url}
        alt={doc.file_name}
        className="max-h-full max-w-full object-contain"
      />
    );
  }

  // 📄 PDF
  if (ext === "pdf") {
    return (
      <iframe
        src={url}
        title="PDF Preview"
        className="w-full h-full"
      />
    );
  }

  // 📝 DOC / DOCX / XLS / XLSX / PPT → GOOGLE VIEWER
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext)) {
    const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
      url
    )}&embedded=true`;

    return (
      <iframe
        src={viewerUrl}
        title="Document Preview"
        className="w-full h-full"
      />
    );
  }

  // ⚠️ FALLBACK
  return (
    <div className="text-center">
      <p className="text-gray-500 mb-3">
        Preview not supported for this file type
      </p>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline text-sm"
      >
        Open / Download File
      </a>
    </div>
  );
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
                      : project.status === "archived"
                      ? "bg-gray-500"
                      : "bg-blue-500"
                  }`}
                />
                {project.status.toUpperCase()}
              </div>

               <div>Lead: <span className="text-gray-600">{project.lead}</span></div>
               <div className="flex items-center gap-1"> <Calendar size={14}/> {project.timeline}</div>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <button
              onClick={() => {
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
              }}
              className="flex gap-1 text-sm items-center px-4 py-1.5 font-medium rounded-sm bg-[#005fff] text-white cursor-pointer"
            >
              Update Project
            </button>
              <button
                onClick={() => setDeleteOpen(true)}
                className="text-red-500 cursor-pointer px-2 py-1.5 rounded-sm hover:bg-red-200"
              >
                <Trash2 />
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
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                TIMELINE STATUS
              </p>

              <div
                className={`inline-flex items-center px-3 py-1 text-xl font-semibold 
                ${getStatusConfig(project.status).text}`}
              >
                {getStatusConfig(project.status).label}
              </div>
            </div>

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
            <button
              onClick={() => setOpenMemberModal(true)}
              className="text-xs font-bold text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-gray-50"
            >
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
        {/* DOCUMENTS SECTION */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">
              Project Documents
            </h3>

            <label className="text-xs font-bold text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-gray-50">
              <Upload size={14} /> Upload Document
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            {/* HEADER */}
            <div className="grid grid-cols-6 text-xs font-semibold text-gray-400 px-6 py-3 border-b">
              <span className="col-span-2">NAME</span>
              <span>TYPE</span>
              <span>UPLOADED BY</span>
              <span>DATE</span>
              <span className="text-right">ACTIONS</span>
            </div>

            {/* ROWS */}
            {documents.length === 0 ? (
                <div className="p-10 text-center text-gray-400 text-sm">
                  No documents uploaded yet
                </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="grid grid-cols-6 px-6 py-4 text-sm border-b last:border-0 items-center hover:bg-gray-50 transition"
                >
                  {/* NAME */}
                  <div className="col-span-2 flex items-center gap-2">
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-blue-600 hover:underline truncate"
                    >
                      {doc.file_name}
                    </a>
                  </div>

                  {/* TYPE */}
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded w-fit">
                    {doc.file_name.split(".").pop()?.toUpperCase()}
                  </span>

                  {/* USER */}
                  <span className="text-gray-500 text-xs">
                    User #{doc.uploaded_by}
                  </span>

                  {/* DATE */}
                  <span className="text-gray-400 text-xs">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </span>

                  {/* ACTIONS */}
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="text-gray-400 hover:text-blue-500"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))

            )}
          </div>

          {uploading && (
            <p className="text-xs text-blue-500 mt-2">Uploading...</p>
          )}
        </div>


      </div>

      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white w-[90%] max-w-4xl h-[80vh] rounded-xl shadow-lg flex flex-col overflow-hidden">
            
            {/* HEADER */}
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h3 className="text-sm font-semibold truncate">
                {previewDoc.file_name}
              </h3>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              {renderPreview(previewDoc)}
            </div>
          </div>
        </div>
      )}

      <ProjectModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        departments={departments}
        users={users}
        editingProject={project}
      />
      <ConfirmDeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        description={`Are you sure you want to delete "${project?.name}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
      <AddMemberModal
        open={openMemberModal}
        onClose={() => setOpenMemberModal(false)}
        projectId={project.id}
        onSuccess={fetchProject}
      />



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