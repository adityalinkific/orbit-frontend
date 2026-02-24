import { request } from "./api";
import { registerService } from "./auth.service";

/* ---------------- GET ALL USERS ---------------- */
export const getAllUsersService = async () => {
  const res = await request("/user/all-users", {
    method: "GET",
  });
  return res.data;
};

/* ---------------- CREATE USER ---------------- */
export const createUserService = async (data) => {
  const res = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res.data;
};

/* ---------------- UPDATE USER ---------------- */
export const updateUserService = async (user_id, data) => {
  const res = await request(`/user/update-user/${user_id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
};

/* ---------------- DELETE USER ---------------- */
export const deleteUserService = async (id) => {
  const res = await request(`/auth/delete/${id}`, {
    method: "DELETE",
  });
  return res.data;
};
