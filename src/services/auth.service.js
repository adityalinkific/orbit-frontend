import { request } from "./api";

/* ---------------- LOGIN ---------------- */
export const loginService = async (data) => {
  const res = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (res.data?.status === false || res.status >= 400) {
    throw new Error(res.data?.message || "Login failed");
  }

  const token =
    res.data?.data?.access_token ||
    res.data?.access_token ||
    res.data?.token;

  if (!token) {
    throw new Error("No token found in login response");
  }

  return {
    token,
    user: null, // we will fetch from /me
  };
};


/* ---------------- REGISTER ---------------- */
export const registerService = async (data) => {
  const res = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (res.data?.status === false || res.status >= 400) {
    const msg =
      res.data?.message?.message ||
      res.data?.message ||
      res.data?.error ||
      "Registration failed";
    throw new Error(msg);
  }

  const token =
    res.data?.data?.access_token ||
    res.data?.access_token ||
    res.data?.token ||
    res.access_token ||
    res.token ||
    res.accessToken;

  if (!token) {
    throw new Error("No token found in register response");
  }

  return {
    token,
    user:
      res.data?.data?.user ||
      res.data?.user || {
        email: data.email,
        role: res.data?.role || res.role || "super_admin",
      },
    raw: res,
  };
};

/* ---------------- ME ---------------- */
export const meService = async () => {
  return request("/auth/me", {
    method: "GET",
  });
};

/* ---------------- HEALTH ---------------- */
export const healthService = async () => {
  return request("/auth/health-check", {
    method: "GET",
  });
};

/* ---------------- GET ALL ROLES ---------------- */
export const rolesService = async () => {
  const res = await request("/roles/role", {
    method: "GET",
  });
  return res.data.data;
};

/* ---------------- CREATE ROLE ---------------- */
export const createRoleService = async (data) => {
  const res = await request("/roles", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
};

/* ---------------- GET ALL DEPARTMENTS ---------------- */
/* ---------------- GET ALL DEPARTMENTS ---------------- */
export const departmentsService = async () => {
  const res = await request("/departments", {
    method: "GET",
  });
  return res.data.data;
};
