import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        axios.post("http://localhost:5000/login", { email, password })
            .then((res) => {
                alert("Login Successful");
                navigate("/home");
            })
            .catch((error) => {
                alert(error.response?.data?.message || "Try Again");
                console.error(error);
            });
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
  )
}

export default Login