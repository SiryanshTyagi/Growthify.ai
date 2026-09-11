/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useMemo, useState } from "react";
import { useCallback } from "react";
import axios from "axios";

export const Context = createContext({
  isAuthenticated: false,
  isAuthLoading: true,
  user: null,
  token: null,
  loginUser: async () => {},
  registerUser: async () => {},
  logout: () => {},
});

const applyAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      applyAuthHeader(token);
      try {
        const response = await axios.get("/api/user/me");
        setUser(response.data);
      } catch {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        applyAuthHeader(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    restoreSession();
  }, [token]);

  const persistSession = useCallback((nextToken, nextUser) => {
    localStorage.setItem("token", nextToken);
    setToken(nextToken);
    setUser(nextUser);
    applyAuthHeader(nextToken);
  }, []);

  const loginUser = useCallback(async ({ email, password }) => {
    const response = await axios.post("/api/auth/login", { email, password });
    persistSession(response.data.token, response.data.user);
    return response.data;
  }, [persistSession]);

  const registerUser = useCallback(async ({ name, email, password }) => {
    const response = await axios.post("/api/auth/register", { name, email, password });
    persistSession(response.data.token, response.data.user);
    return response.data;
  }, [persistSession]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    applyAuthHeader(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token && user),
      isAuthLoading,
      user,
      token,
      loginUser,
      registerUser,
      logout,
    }),
    [token, user, isAuthLoading, loginUser, registerUser, logout],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
