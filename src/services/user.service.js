import { registerService } from "./auth.service";
import { rolesService } from "./auth.service";
import { request } from "./api";

/* ---------------- GET ALL USERS (FROM ROLES API RESPONSE) ---------------- */
export const getAllUsersService = async () => {
  const res = await request("/user/all-users", {
    method: "GET",
  });

  // assuming backend returns: { status, message, data }
  return res.data;
};

/* ---------------- CREATE USER ---------------- */
export const createUserService = async (data) => {
  return await registerService(data);
};

/* ---------------- UPDATE USER ---------------- */
// Not supported by backend
export const updateUserService = async (user_id, data) => {
  const res = await request(`/user/update-user/${user_id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  return res.data;
};

/* ---------------- DELETE CURRENT USER ---------------- */
export const deleteUserService = async (id) => {
  const res = await request(`/auth/delete/${id}`, {
    method: "DELETE",
  });

  return res.data;
};
