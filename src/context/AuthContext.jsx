import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load session from localStorage OR sessionStorage
useEffect(() => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const storedUser =
    localStorage.getItem("user") || sessionStorage.getItem("user");

  console.log("BOOTSTRAP 👉", { token, storedUser });

  if (token && storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch {
      setUser(null);
    }
  }

  setLoading(false);
}, []);


  // ✅ Login handler with rememberMe
  const login = (data, rememberMe = false) => {
    console.log("AUTH LOGIN CALLED 👉", { ...data, rememberMe });

    // Clear potentially conflicting sessions first
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem("token", data.token);
    storage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);
  };

  // ✅ Logout clears everything
  const logout = () => {
    console.log("AUTH LOGOUT 👉");

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
