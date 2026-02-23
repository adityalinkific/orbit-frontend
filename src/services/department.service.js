import API from "./api";

export const getDepartments = async () => {
  const response = await API.get("/departments/");
  return response.data;
};
