import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types
export type UserRole = "student" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  kyu?: number; // Belt level for students (rage from -8 to +8)
  location?: string; // Where the student trains
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, location: string) => Promise<void>;
  logout: () => void;
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
      // Hard-coded users for testing
      const hardcodedUsers = {
        "adm@email.com": {
          password: "1234",
          user: {
            id: "1",
            name: "Administrador",
            email: "adm@email.com",
            role: "admin" as UserRole,
          },
        },
        "aluno@email.com": {
          password: "1234",
          user: {
            id: "2",
            name: "Aluno Teste",
            email: "aluno@email.com",
            role: "student" as UserRole,
            kyu: 6,
            location: "CT Maylson Campos",
          },
        },
      };

      // Check hard-coded credentials
      const hardcodedUser = hardcodedUsers[email as keyof typeof hardcodedUsers];
      
      if (hardcodedUser && hardcodedUser.password === password) {
        // Simulate token generation
        const mockToken = `mock-token-${email}-${Date.now()}`;
        
        setToken(mockToken);
        setUser(hardcodedUser.user);
        
        localStorage.setItem("token", mockToken);
        localStorage.setItem("user", JSON.stringify(hardcodedUser.user));
        return;
      }

      // If not hard-coded, try API
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas");
      }

      const data = await response.json();
      
      setToken(data.token);
      setUser(data.user);
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, location: string) => {
    try {
      // For now, just log the registration attempt
      // In production, this would create a pending account for admin approval
      console.log("Registration attempt:", { name, email, location });
      
      // Simulate successful registration for testing
      // In real app, admin would need to approve
      const mockUser: User = {
        id: String(Date.now()),
        name,
        email,
        role: "student",
        kyu: 0,
        location,
      };

      const mockToken = `mock-token-${email}-${Date.now()}`;
      
      setToken(mockToken);
      setUser(mockUser);
      
      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      // Uncomment below for API integration
      /*
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, location }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      
      setToken(data.token);
      setUser(data.user);
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      */
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

