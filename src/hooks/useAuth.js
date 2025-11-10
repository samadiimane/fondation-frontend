/** @typedef {{id?: number|string|null, email?: string|null, roles?: string[]}} AuthUser */
"use client";

import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";

import {
  AUTH_EVENT_NAME,
  AUTH_TOKEN_STORAGE_KEY,
  clearStoredToken,
  decodeJwtPayload,
  getStoredToken,
  login as apiLogin,
  loginWithGoogle as apiLoginWithGoogle,
  signup as apiSignup,
} from "@/lib/api";

const noop = () => {};

const AuthContext = createContext({
  user: null,
  roles: [],
  token: null,
  isAuthenticated: false,
  initializing: true,
  login: noop,
  signup: noop,
  loginWithGoogle: noop,
  logout: noop,
  refreshFromStorage: noop,
});

const isBrowser = typeof window !== "undefined";

const normalizeRoles = (roles) => {
  if (!Array.isArray(roles)) return [];
  return roles
    .map((role) => {
      const text = typeof role === "string" ? role : String(role || "");
      return text.trim().toLowerCase();
    })
    .filter(Boolean);
};

const mergeRoles = (first = [], second = []) => {
  const merged = [...normalizeRoles(first), ...normalizeRoles(second)];
  return Array.from(new Set(merged));
};

const buildUserFromPayload = (payload, overrideUser) => {
  if (overrideUser) {
    return overrideUser;
  }
  if (!payload) {
    return null;
  }
  return {
    id: payload.sub ?? null,
    email: payload.email ?? null,
  };
};

const isExpired = (payload) => {
  if (!payload?.exp) return false;
  const expiresAt = Number(payload.exp) * 1000;
  return Number.isFinite(expiresAt) && expiresAt <= Date.now();
};

export const AuthProvider = ({children}) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [initializing, setInitializing] = useState(true);

  const resetState = useCallback(() => {
    setToken(null);
    setUser(null);
    setRoles([]);
  }, []);

  const applyToken = useCallback(
    (nextToken, userOverride = null) => {
      if (!nextToken) {
        clearStoredToken();
        resetState();
        return false;
      }
      const decoded = decodeJwtPayload(nextToken);
      if (!decoded || isExpired(decoded)) {
        clearStoredToken();
        resetState();
        return false;
      }
      const nextUser = buildUserFromPayload(decoded, userOverride);
      const derivedRoles = mergeRoles(decoded.roles, nextUser?.roles);
      setToken(nextToken);
      setUser(nextUser);
      setRoles(derivedRoles);
      return true;
    },
    [resetState],
  );

  const refreshFromStorage = useCallback(() => {
    if (!isBrowser) {
      setInitializing(false);
      return false;
    }
    const stored = getStoredToken();
    const applied = applyToken(stored, null);
    setInitializing(false);
    if (!applied && !stored) {
      resetState();
    }
    return applied;
  }, [applyToken, resetState]);

  useEffect(() => {
    refreshFromStorage();
  }, [refreshFromStorage]);

  useEffect(() => {
    if (!isBrowser) return undefined;
    const handleStorage = (event) => {
      if (event?.key && event.key !== AUTH_TOKEN_STORAGE_KEY) {
        return;
      }
      refreshFromStorage();
    };
    const handleAuthEvent = () => refreshFromStorage();
    window.addEventListener("storage", handleStorage);
    window.addEventListener(AUTH_EVENT_NAME, handleAuthEvent);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(AUTH_EVENT_NAME, handleAuthEvent);
    };
  }, [refreshFromStorage]);

  const login = useCallback(
    async (email, password) => {
      const payload = await apiLogin(email, password);
      const nextToken = payload?.access_token || getStoredToken();
      applyToken(nextToken, payload?.user ?? null);
      return payload;
    },
    [applyToken],
  );

  const signup = useCallback(
    async (email, password) => {
      const payload = await apiSignup(email, password);
      const nextToken = payload?.access_token || getStoredToken();
      applyToken(nextToken, payload?.user ?? null);
      return payload;
    },
    [applyToken],
  );

  const loginWithGoogle = useCallback(
    async (idToken) => {
      const payload = await apiLoginWithGoogle(idToken);
      const nextToken = payload?.access_token || getStoredToken();
      applyToken(nextToken, payload?.user ?? null);
      return payload;
    },
    [applyToken],
  );

  const logout = useCallback(() => {
    clearStoredToken();
    resetState();
  }, [resetState]);

  const value = useMemo(
    () => ({
      user,
      roles,
      token,
      initializing,
      isAuthenticated: Boolean(token),
      login,
      signup,
      loginWithGoogle,
      logout,
      refreshFromStorage,
    }),
    [user, roles, token, initializing, login, signup, loginWithGoogle, logout, refreshFromStorage],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

export default useAuth;
