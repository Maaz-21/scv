"use client";

import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = () => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const storedRole = localStorage.getItem("role");

      if (storedToken && storedUser && storedRole) {
        setToken(storedToken);
        // Only parse if storedUser is valid JSON
        try {
          setUser(JSON.parse(storedUser));
        } catch (parseError) {
          console.error("Failed to parse user data, clearing storage:", parseError);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setLoading(false);
          return;
        }
        setRole(storedRole);
      }
    } catch (error) {
      console.error("Error loading user from storage:", error);
      // Clear corrupted data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken, newUser, newRole) => {
    try {
      setToken(newToken);
      setUser(newUser);
      setRole(newRole);

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("role", newRole);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRole(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  };

  const value = {
    user,
    role,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}