
import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
} from "../services/auth.service.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore the session when the application starts.
  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const currentUser = await getCurrentUser();

        if (isMounted) {
          setUser(currentUser);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Log in an existing user.
  const login = useCallback(async (credentials) => {
    const authenticatedUser = await loginUser(credentials);

    setUser(authenticatedUser);

    return authenticatedUser;
  }, []);

  // Register a new user and authenticate them.
  const register = useCallback(async (details) => {
    const registeredUser = await registerUser(details);

    setUser(registeredUser);

    return registeredUser;
  }, []);

  // Log out and clear the local session.
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
