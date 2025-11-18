import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService } from "@/services";
import type { User, UserRole } from "@/types";

// Re-export types for compatibility
export type { User, UserRole };

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ user: User; token: string }>;
  register: (name: string, email: string, password: string, location: string) => Promise<{ user: User; token: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await authService.login({ email, password });

      setToken(data.token);
      setUser(data.user);

      localStorage.setItem("token", data.token); // Corrigido: salvar token
      localStorage.setItem("user", JSON.stringify(data.user));

      return { user: data.user, token: data.token };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, location: string) => {
    try {
      const data = await authService.register({ name, email, password, location });

      setToken(data.token);
      setUser(data.user);

      localStorage.setItem("token", data.token); // Corrigido: salvar token
      localStorage.setItem("user", JSON.stringify(data.user));

      return { user: data.user, token: data.token };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
    }
  };

  const refreshUser = async () => {
    try {
      const data = await authService.refreshUser();
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      console.error("Refresh user error:", error);
      // Se falhar, fazer logout
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        refreshUser,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
