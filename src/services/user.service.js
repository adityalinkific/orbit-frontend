import { registerService } from "./auth.service";
import { rolesService } from "./auth.service";
import { request } from "./api";

/* ---------------- GET USERS (FROM ROLES API RESPONSE) ---------------- */
export const getAllUsers = async () => {
  // Since backend has no /users endpoint,
  // we assume users list comes from roles or another supported endpoint.
  const res = await rolesService();
  return res;
};

/* ---------------- CREATE USER ---------------- */
export const createUserService = async (data) => {
  return await registerService(data);
};

/* ---------------- DELETE CURRENT USER ---------------- */
export const deleteUserService = async () => {
  const res = await request("/auth/delete", {
    method: "DELETE",
  });
  return res.data;
};

/* ---------------- UPDATE USER ---------------- */
// Not supported by backend
export const updateUserService = async () => {
  throw new Error("Update user endpoint not available in backend");
};
