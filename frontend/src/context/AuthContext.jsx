import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getToken()); // Get token and validate expiration
  const [completedChapters, setCompletedChapters] = useState(0); // Initialize to 0
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to retrieve token and validate expiration
  function getToken() {
    const tokenData = localStorage.getItem("token");
    const expirationTime = localStorage.getItem("tokenExpiration");

    // Check if the token exists and if it has expired
    if (tokenData && expirationTime) {
      if (Date.now() < parseInt(expirationTime)) {
        return tokenData; // Token is still valid
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        return null; // Token has expired
      }
    }
    return null; // No token available
  }

  useEffect(() => {
    const fetchCompletedChapters = async () => {
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/profile/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const completedArray = response.data.completed || []; // Adjust based on your response structure
          setCompletedChapters(completedArray.length);
          setUser(response.data); // Update user state with the fetched data
        } catch (err) {
          setError("Error fetching completed chapters.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // Set loading to false if no token
      }
    };

    fetchCompletedChapters();
  }, [token]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = async (credentials) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        credentials
      );
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);

      // Store expiration time (24 hours from now)
      const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      localStorage.setItem("tokenExpiration", expirationTime.toString());
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCompletedChapters(0); // Reset completed chapters on logout
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    delete axios.defaults.headers.common["Authorization"];
  };

  const markChapterAsRead = () => {
    setCompletedChapters((prev) => prev + 1);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        token,
        completedChapters,
        loading,
        error,
        markChapterAsRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
