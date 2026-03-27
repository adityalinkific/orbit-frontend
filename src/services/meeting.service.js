import api from "./api";

// GET all meetings
export const getAllMeetings = async () => {
  const res = await api.get("/meetings/");
  return res.data?.data || [];
};

// GET meeting by ID
export const getMeetingById = async (id) => {
  const res = await api.get(`/meetings/${id}`);
  return res.data?.data;
};

// CREATE meeting
export const createMeeting = async (payload) => {
  const res = await api.post("/meetings/", payload);
  return res.data?.data;
};

// UPDATE meeting
export const updateMeeting = async (id, payload) => {
  const res = await api.put(`/meetings/${id}`, payload);
  return res.data?.data;
};

// DELETE meeting
export const deleteMeeting = async (id) => {
  const res = await api.delete(`/meetings/${id}`);
  return res.data?.data;
};
