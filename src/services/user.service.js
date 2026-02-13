import api from "./api";

/* ---------------- GET ALL USERS ---------------- */
export const getAllUsers = async () => {
  const res = await api.get("/roles/");
  return res.data;
};

/* ---------------- CREATE USER ---------------- */
export const createUserService = async (data) => {
  const res = await api.post("/roles/", data);
  return res.data;
};

/* ---------------- UPDATE USER ---------------- */
export const updateUserService = async (id, data) => {
  const res = await api.put(`/roles/${id}/`, data);
  return res.data;
};

/* ---------------- DELETE USER ---------------- */
export const deleteUserService = async (id) => {
  const res = await api.delete(`/roles/${id}/`);
  return res.data;
};
