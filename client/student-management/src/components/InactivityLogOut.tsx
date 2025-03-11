import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useInactivityLogout = (timeout = 30 * 60 * 1000) => { // Default: 30 mins
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // Don't track if no token

    const resetTokenExpiry = () => {
      localStorage.setItem("token_expiry", (Date.now() + timeout).toString());
    };

    const checkTokenExpiry = () => {
      const expiry = localStorage.getItem("token_expiry");
      if (expiry && Date.now() > Number(expiry)) {
        console.log("⏳ Token expired due to inactivity. Logging out...");
        localStorage.clear();
        sessionStorage.clear();
        navigate("/");
      }
    };

    resetTokenExpiry(); // Set initial token expiry on login

    window.addEventListener("mousemove", resetTokenExpiry);
    window.addEventListener("keypress", resetTokenExpiry);
    window.addEventListener("click", resetTokenExpiry);

    const interval = setInterval(checkTokenExpiry, 60000);

    return () => {
      window.removeEventListener("mousemove", resetTokenExpiry);
      window.removeEventListener("keypress", resetTokenExpiry);
      window.removeEventListener("click", resetTokenExpiry);
      clearInterval(interval);
    };
  }, [navigate, timeout]);
};

export default useInactivityLogout;
