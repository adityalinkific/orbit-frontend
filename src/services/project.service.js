import api from "./api";


export const getAllProjects = async () => {
  const res = await api.get("/projects/project-detail");
  return res.data?.data || [];
};

