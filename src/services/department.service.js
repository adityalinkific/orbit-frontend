import api from "./api"
import axios from "axios";
/* ---------------- GET ALL DEPARTMENTS ---------------- */
export const getDepartments = async () => {
  const res = await api.get("/departments/");

  // backend returns { status, message, data }
  if (!Array.isArray(res.data.data)) {
    throw new Error("Response validation failed");
  }

  return res.data.data;
};

/* ---------------- CREATE DEPARTMENT ---------------- */
export const createDepartment = async (payload) => {
  const res = await api.post("/departments/", payload);

  if (!res.data?.data) {
    throw new Error("Response validation failed");
  }

  return res.data.data;
};

/* ---------------- GET SINGLE DEPARTMENT ---------------- */
export const getDepartmentById = async (id) => {
  const res = await api.get(`/departments/${id}`);

  if (!res.data?.data) {
    throw new Error("Response validation failed");
  }

  return res.data.data;
};

/* ---------------- UPDATE DEPARTMENT ---------------- */
export const updateDepartment = async (id, payload) => {
  const res = await api.put(
    `/departments/update-department/${id}`,
    {
      name: payload.name,
      description: payload.description,
      department_head_id:
        typeof payload.department_head_id === "number"
          ? payload.department_head_id
          : null,
      is_active: payload.is_active,
    }
  )

  return res.data.data
}


/* ---------------- DELETE DEPARTMENT ---------------- */
export const deleteDepartment = async (id) => {
  const res = await api.delete(`/departments/delete-department/${id}`);
  return res.data.data;
};

/* ---------------- GET DEPARTMENT MEMBERS ---------------- */
export const getDepartmentMembers = async (departmentId) => {
  const res = await axios.get("/api/v1/user/all-users");

  const users = Array.isArray(res?.data?.data)
    ? res.data.data
    : [];

  const members = users.filter(
    (user) => user.department_id === departmentId
  );

  return members;
};