import api from "./api";

/* =========================
   TASK CRUD
========================= */

// Create Task
export const createTaskService = async (payload) => {
  const res = await api.post("/tasks/", payload);
  return res.data;
};

// Get All Tasks
export const getAllTasksService = async () => {
  const res = await api.get("/tasks/task-detail");
  return res.data;
};

// Get Single Task
export const getTaskByIdService = async (taskId) => {
  const res = await api.get(`/tasks/task-detail/${taskId}`);
  return res.data;
};

// Update Task
export const updateTaskService = async (taskId, payload) => {
  const res = await api.put(`/tasks/update-task/${taskId}`, payload);
  return res.data;
};

// Delete Task
export const deleteTaskService = async (taskId) => {
  const res = await api.delete(`/tasks/delete-task/${taskId}`);
  return res.data;
};



/* =========================
   TASK ASSIGNMENT
========================= */

// Assign Task
export const assignTaskService = async (payload) => {
  const res = await api.post("/tasks/task-assign", payload);
  return res.data;
};

// Update Assigned Task
export const updateAssignedTaskService = async (assignTaskId, payload) => {
  const res = await api.put(
    `/tasks/task-assign/update-task-assign/${assignTaskId}`,
    payload
  );
  return res.data;
};

// Delete Assigned Task
export const deleteAssignedTaskService = async (assignTaskId) => {
  const res = await api.delete(
    `/tasks/task-assign/delete-task-assign/${assignTaskId}`
  );
  return res.data;
};

// Update Task Status
export const updateTaskStatusService = async (assignTaskId, payload) => {
  const res = await api.patch(
    `/tasks/task-assign/update-status/${assignTaskId}`,
    payload
  );
  return res.data;
};

// Get Single Assigned Task
export const getAssignedTaskByIdService = async (assignTaskId) => {
  const res = await api.post(
    `/tasks/task-assign/task-assign-detail/${assignTaskId}`
  );
  return res.data;
};

// Get All Assigned Tasks
export const getAllAssignedTasksService = async () => {
  const res = await api.get(
    "/tasks/task-assign/all-task-assign-detail"
  );
  return res.data;
};
