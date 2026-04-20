import api from "./api";

export const getAllProjects = async () => {
  const res = await api.get("/projects/project-detail");
   console.log(res.data?.data)
  return res.data?.data || [];
};

export const createProjectService = async (payload) => {
  const res = await api.post("/projects/", payload);
  return res.data;
};


export const updateProjectService = async (projectId, payload) => {
  const res = await api.put(
    `/projects/update-project/${projectId}`,
    payload
  );
  return res.data;
};

/* ---------------- GET PROJECT BY ID ---------------- */
export const getProjectById = async (id) => {
  const res = await api.get(`/projects/project-detail/${id}`);
  return res.data?.data;
};

export const getDashboardMetrics = async () => {
  const res = await api.get("/projects/dashboard-metrics");
  return res.data?.data;
};

