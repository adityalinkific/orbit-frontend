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
