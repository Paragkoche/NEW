"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API;

type Admin = {
  username: string;
};

type AuthContextType = {
  admin: Admin | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  createUser: (username: string, password: string) => Promise<void>;
  isLoading: boolean;
  token: string | null;
};

const AuthContext = createContext<AuthContextType>({
  admin: null,
  login: async () => {},
  logout: () => {},
  createUser: async () => {},
  isLoading: false,
  token: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token && username) {
      setAdmin({ username });
      setToken(token);
    } else {
      router.push("/dashboard/login");
    }
    setIsLoading(false);
  }, []);

  // Automatically attach token to every request
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const login = async (username: string, password: string) => {
    try {
      console.log("from:staat", username);

      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        username,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("username", username);
      localStorage.setItem("token", token);
      setAdmin({ username });
      router.push("/dashboard");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message || axiosError.message);
    }
  };

  const createUser = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/create-user`,
        { username, password } // ✅ Send as JSON body
      );
      const token = response.data.access_token;
      localStorage.setItem("token", token);
      setAdmin({ username });
      router.push("/dashboard");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message || axiosError.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAdmin(null);
    router.push("/dashboard/login");
  };

  return (
    <AuthContext.Provider
      value={{ admin, login, logout, createUser, isLoading, token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
