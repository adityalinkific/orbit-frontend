import API from "./api";

/* ---------------- GET ALL DEPARTMENTS ---------------- */
export const getDepartments = async () => {
  const response = await API.get("/departments/");
  return response.data;
};

/* ---------------- CREATE DEPARTMENT ---------------- */
export const createDepartment = async (data) => {
  try {
    const response = await API.post("/departments/", data);
    return response;
  } catch (error) {
    if (error.response?.status === 409) {
      console.error("🛑 SERVER DUPLICATE DETECTED:", error.response.data);
      throw error; // Let handleSubmit catch it
    }
    throw error;
  }
};


/* ---------------- GET SINGLE DEPARTMENT ---------------- */
export const getDepartmentById = async (id) => {
  const response = await API.get(
    `/departments/department-detail/${id}`
  );
  return response.data;
};

/* ---------------- UPDATE DEPARTMENT ---------------- */
export const updateDepartment = async (id, data) => {
  const response = await API.put(
    `/departments/update-department/${id}`,
    data
  );
  return response.data;
};

/* ---------------- DELETE DEPARTMENT ---------------- */
export const deleteDepartment = async (id) => {
  const response = await API.delete(
    `/departments/delete-department/${id}`
  );
  return response.data;
};