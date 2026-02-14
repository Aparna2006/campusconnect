import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updates) => {
    const nextUser = { ...(user || {}), ...updates };
    localStorage.setItem("user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  useEffect(() => {
    const preferred = user?.settings?.theme || "system";
    const resolved =
      preferred === "system"
        ? (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : preferred;

    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.setAttribute("data-theme-preference", preferred);
  }, [user?.settings?.theme]);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
