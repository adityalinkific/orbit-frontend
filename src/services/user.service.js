import axios from "axios";

const API = "http://127.0.0.1:8000/api/v1";

// GET ALL USERS
export const getAllUsers = async () => {
  const res = await axios.get(`${API}/users/`);
  return res.data;
};

// CREATE USER
export const createUserService = async (data) => {
  const res = await axios.post(`${API}/users/`, data);
  return res.data;
};

// UPDATE USER
export const updateUserService = async (id, data) => {
  const res = await axios.put(`${API}/users/${id}/`, data);
  return res.data;
};

// DELETE USER
export const deleteUserService = async (id) => {
  await axios.delete(`${API}/users/${id}/`);
};
