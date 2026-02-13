const API_URL = "http://127.0.0.1:8000/api/v1";

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const res = await fetch(API_URL + endpoint, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  const text = await res.text();
  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }

  if (!res.ok) {
    throw new Error(data.message || "API Error");
  }

  return data;
}
