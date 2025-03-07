import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface AuthContextType {
    isAuthenticated: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("token"); // 🔐 Get token from localStorage
                if (!token) {
                    setIsAuthenticated(false);
                    navigate("/login"); // 🚨 Redirect to login if no token
                    return;
                }

                // 🔍 Verify token with API
                const res = await axios.get("/api/auth/verify-token", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.valid) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem("token"); // 🔐 Remove invalid token
                    setIsAuthenticated(false);
                    navigate("/login"); // 🚨 Redirect to login if token is invalid
                }
            } catch (err) {
                console.error("Auth check failed", err);
                localStorage.removeItem("token"); // 🔐 Remove invalid token
                setIsAuthenticated(false);
                navigate("/login"); // 🚨 Redirect to login on error
            }
        };

        checkAuth();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};