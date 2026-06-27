// frontend/src/context/AppContext.jsx
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [credit, setCredit] = useState(0); // numeric default
  const [recentImages, setRecentImages] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  // Auth headers
  const authHeaders = () => (token ? { Authorization: `Bearer ${token}` } : {});

  // Load credits and user info
  const loadCreditsData = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${backendUrl}/api/user/credits`, { headers: authHeaders() });
      const data = response.data;

      console.log("Credits API response:", data); // debug

      if (data.success) {
        // Prioritize creditBalance (matches your MongoDB and backend)
        setCredit(data.creditBalance ?? data.credits ?? 0);
        setUser(data.user ?? null);
      }
    } catch (error) {
      console.error("Failed to load credits:", error.message);
    }
  };

  // Load user's previous images
  const loadUserImages = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${backendUrl}/api/image/my-images`, { headers: authHeaders() });
      const data = response.data;
      if (data.success) setRecentImages(data.images || []);
    } catch (error) {
      console.error("Could not load images:", error.message || error);
    }
  };

  // Generate image
  const generateImage = async (prompt) => {
    if (!token) {
      toast.error("You must be logged in to generate images");
      return null;
    }
    try {
      const response = await axios.post(
        `${backendUrl}/api/image/generate-image`,
        { prompt },
        { headers: authHeaders() }
      );
      const data = response.data;

      if (data.success) {
        await loadCreditsData();
        await loadUserImages();
        return data.resultImage;
      } else {
        toast.error(data.message || "Failed to generate image");
        await loadCreditsData();
        if (data.creditBalance === 0 || data.creditsLeft === 0) navigate("/buy");
        return null;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Error generating image");
      return null;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setCredit(0);
    setRecentImages([]);
  };

  // Auto-load data when token exists (page reload or login)
  useEffect(() => {
    if (token) {
      loadCreditsData();
      loadUserImages();
    }
  }, [token]);

  return (
    <AppContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        showLogin,
        setShowLogin,
        credit,
        setCredit,
        loadCreditsData,
        loadUserImages,
        backendUrl,
        generateImage,
        logout,
        recentImages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;