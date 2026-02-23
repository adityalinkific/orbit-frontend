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
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      role_id: data.role_id,
      department_id: data.department_id,
      reporting_manager_id: data.reporting_manager_id || null,
      is_active: data.is_active !== undefined ? data.is_active : true,
      joined_date: data.joined_date,
    }),
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
