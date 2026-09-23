import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("ricoz_token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (err) {
        console.error("Session verification failed:", err.message);
        localStorage.removeItem("ricoz_token");
        localStorage.removeItem("ricoz_user");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { user: userData, token: jwtToken } = response.data;
    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem("ricoz_token", jwtToken);
    localStorage.setItem("ricoz_user", JSON.stringify(userData));
    return userData;
  };

  const register = async (name, email, password, role) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
      role
    });
    const { user: userData, token: jwtToken } = response.data;
    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem("ricoz_token", jwtToken);
    localStorage.setItem("ricoz_user", JSON.stringify(userData));
    return userData;
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post("/auth/logout");
      }
    } catch (e) {
      // Continue cleanup on frontend
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("ricoz_token");
      localStorage.removeItem("ricoz_user");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
