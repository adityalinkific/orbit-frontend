import api from "./api";

/* ---------------- PROJECTS ---------------- */

export const getAllProjects = async () => {
  const res = await api.get("/projects/project-detail");
  return res.data?.data || [];
};

export const createProjectService = async (payload) => {
  const res = await api.post("/projects/", payload);
  return res.data?.data;
};

export const updateProjectService = async (projectId, payload) => {
  const res = await api.put(`/projects/update-project/${projectId}`, payload);
  return res.data?.data;
};

export const deleteProjectService = async (projectId) => {
  const res = await api.delete(`/projects/delete-project/${projectId}`);
  return res.data;
};

export const getProjectById = async (id) => {
  const res = await api.get(`/projects/project-detail/${id}`);
  return res.data?.data;
};

export const getDashboardMetrics = async () => {
  const res = await api.get("/projects/dashboard-metrics");
  return res.data?.data;
};

/* ---------------- MEMBERS ---------------- */

export const addProjectMember = async (projectId, payload) => {
  const res = await api.post(`/projects/${projectId}/members`, payload);
  return res.data;
};

export const bulkAddProjectMembers = async (projectId, payload) => {
  const res = await api.post(`/projects/${projectId}/members/bulk`, payload);
  return res.data;
};

export const removeProjectMember = async (projectId, userId) => {
  const res = await api.delete(`/projects/${projectId}/members/${userId}`);
  return res.data;
};

/* ---------------- DOCUMENTS ---------------- */

export const uploadProjectDocument = async (projectId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post(
    `/projects/${projectId}/documents`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return res.data?.data; 
};

export const viewProjectDocument = async (projectId, documentId) => {
  const res = await api.get(
    `/projects/${projectId}/documents/${documentId}/view`,
    { responseType: "blob" }
  );
  return res;
};

export const deleteProjectDocument = async (projectId, documentId) => {
  const res = await api.delete(
    `/projects/${projectId}/documents/${documentId}` 
  );
  return res.data;
};
