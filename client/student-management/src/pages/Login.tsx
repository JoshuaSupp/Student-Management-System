import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await axios.post('/api/login', { email, password });

            // ✅ Save JWT Token
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("token_expiry", (Date.now() + 30 * 60 * 1000).toString()); //30 min
            // ✅ Show success message
            toast.success("Login Successful!", { position: "top-center", autoClose: 1000 });

            // ✅ Redirect to Dashboard
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid credentials. Try Again.");
            console.error(error);
        }
    };

    return (
        <div>
            <div className="container vh-100 d-flex justify-content-center align-items-center">
                <form className="p-5 bg-light rounded-3 shadow-lg border border-secondary w-45 w-sm-60" onSubmit={handleLogin}>
                    <h2 className="text-center mb-4">SMS Login 🏫</h2>
                    <div className="mb-3">
                        <label className="fw-bold">Email:</label>
                        <input type="email" className="form-control p-3" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="fw-bold">Password:</label>
                        <input type="password" className="form-control p-3" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;