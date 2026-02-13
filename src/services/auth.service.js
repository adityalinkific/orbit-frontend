import { request } from "./api";

/* ---------------- LOGIN ---------------- */

export const loginService = async (data) => {
  const res = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  console.log("LOGIN RESPONSE 👉", res);

  const token =
    res.data?.access_token ||
    res.access_token ||
    res.token ||
    res.accessToken;

  if (!token) {
    console.error("LOGIN FAIL: No token found", res);
    throw new Error("No token found in login response");
  }

  return {
    token,
    user:
      res.data?.user ||
      res.user || {
        email: data.email,
        role: res.data?.role || res.role || "super_admin",
      },
  };
};

/* ---------------- REGISTER ---------------- */

export const registerService = async (data) => {
  const res = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  console.log("REGISTER RESPONSE 👉", res);

  const token =
    res.data?.access_token ||
    res.access_token ||
    res.token ||
    res.accessToken;

  if (!token) {
    console.error("REGISTER FAIL: No token found", res);
    throw new Error("No token found in register response");
  }

  return {
    token,
    user:
      res.data?.user ||
      res.user || {
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
  const res = await request("/roles", { method: "GET" });
  return res.data || res;
};

/* ---------------- CREATE ROLE ---------------- */

export const createRoleService = async (data) => {
  const res = await request("/roles", {
    method: "POST",
    body: JSON.stringify(data),
  });

  console.log("CREATE ROLE 👉", res);

  return res.data || res;
};


/* ---------------- GET ALL DEPARTMENTS ---------------- */

export const departmentsService = async () => {
  const res = await request("/departments", { method: "GET" });
  return res.data || res;
};
