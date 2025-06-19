import * as React from "react";
import axios from "axios";
import { API_CONFIG } from "@/config/api";

interface User {
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const UserContext = React.createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = "user_data";
const USER_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(() => {
    // Try to get cached user data from localStorage
    const cached = localStorage.getItem(USER_STORAGE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        // Check if cache is still valid
        if (Date.now() - timestamp < USER_CACHE_DURATION) {
          console.log("Using cached user data:", data);
          return data;
        }
      } catch (e) {
        console.error("Error parsing cached user data:", e);
      }
    }
    return null;
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchUser = React.useCallback(async () => {
    // Don't fetch if we have valid cached data
    if (user) {
      console.log("User already loaded from cache:", user);
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No auth token found - user not logged in");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Fetching user data from API...");

      // Try different possible endpoints
      const endpoints = [
        `${API_CONFIG.baseURL}/api/user`,
        `${API_CONFIG.baseURL}/api/auth/user`,
        `${API_CONFIG.baseURL}/api/me`,
        `${API_CONFIG.baseURL}/api/profile`,
      ];

      let response = null;
      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          response = await axios.get(endpoint, {
            headers: {
              ...API_CONFIG.headers,
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(`Success with endpoint: ${endpoint}`);
          break;
        } catch (err) {
          console.log(`Failed with endpoint: ${endpoint}`, err);
          lastError = err;
          continue;
        }
      }

      if (!response) {
        // If all endpoints fail, try to decode token for basic info
        console.log("All endpoints failed, trying to decode token...");
        try {
          const tokenParts = token.split(".");
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log("Token payload:", payload);

            if (payload.name || payload.email) {
              const userInfo = {
                name: payload.name || "Admin",
                email: payload.email || "admin@desa.com",
              };
              console.log("Using token payload for user info:", userInfo);
              setUser(userInfo);

              // Cache the user data with timestamp
              localStorage.setItem(
                USER_STORAGE_KEY,
                JSON.stringify({
                  data: userInfo,
                  timestamp: Date.now(),
                }),
              );
              setLoading(false);
              return;
            }
          }
        } catch (decodeError) {
          console.error("Error decoding token:", decodeError);
        }

        throw lastError || new Error("All endpoints failed");
      }

      console.log("API Response:", response.data);
      const userData = response.data;

      // Handle different response formats
      let userInfo: User;

      if (userData.data) {
        // Response format: { data: { name, email } }
        userInfo = {
          name: userData.data.name || userData.data.user?.name || "Unknown",
          email:
            userData.data.email ||
            userData.data.user?.email ||
            "unknown@example.com",
        };
      } else if (userData.user) {
        // Response format: { user: { name, email } }
        userInfo = {
          name: userData.user.name || "Unknown",
          email: userData.user.email || "unknown@example.com",
        };
      } else {
        // Direct response format: { name, email }
        userInfo = {
          name: userData.name || "Unknown",
          email: userData.email || "unknown@example.com",
        };
      }

      console.log("Processed user info:", userInfo);
      setUser(userInfo);

      // Cache the user data with timestamp
      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify({
          data: userInfo,
          timestamp: Date.now(),
        }),
      );
    } catch (err) {
      console.error("Error fetching user data:", err);

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError("Token expired or invalid");
          // Clear invalid token
          localStorage.removeItem("authToken");
          localStorage.removeItem(USER_STORAGE_KEY);
        } else {
          setError(`API Error: ${err.response?.data?.message || err.message}`);
        }
      } else {
        setError("Failed to fetch user data");
      }

      // Clear invalid cache
      localStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const logout = React.useCallback(() => {
    console.log("Logging out user");
    localStorage.removeItem("authToken");
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    setError(null);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  // Listen for storage changes (when token is added/removed)
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken") {
        console.log("Auth token changed:", e.newValue ? "added" : "removed");
        if (e.newValue && !user) {
          // Token was added, fetch user data
          console.log("Token added, fetching user data...");
          fetchUser();
        } else if (!e.newValue && user) {
          // Token was removed, clear user
          console.log("Token removed, clearing user data...");
          setUser(null);
          setError(null);
        }
      }
    };

    // Listen for storage events from other tabs/windows
    window.addEventListener("storage", handleStorageChange);

    // Also check for token changes in the same tab
    const checkTokenInterval = setInterval(() => {
      const token = localStorage.getItem("authToken");
      if (token && !user && !loading) {
        console.log("Token found, fetching user data...");
        fetchUser();
      } else if (!token && user) {
        console.log("Token removed, clearing user data...");
        setUser(null);
        setError(null);
      }
    }, 1000); // Check every second

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(checkTokenInterval);
    };
  }, [user, loading, fetchUser]);

  // Initial fetch if we have cached data or token
  React.useEffect(() => {
    console.log("UserProvider mounted, user state:", user);
    if (user || localStorage.getItem("authToken")) {
      fetchUser();
    }
  }, [fetchUser]);

  return (
    <UserContext.Provider
      value={{ user, loading, error, fetchUser, logout, clearError }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
